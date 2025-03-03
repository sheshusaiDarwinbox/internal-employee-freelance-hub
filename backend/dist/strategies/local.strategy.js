"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userAuth_model_1 = require("../models/userAuth.model");
const password_util_1 = require("../utils/password.util");
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = userAuth_model_1.User.findOne({ EID: user.EID });
        if (!findUser) {
            throw new Error("User not found");
        }
        else {
            done(null, user);
        }
    }
    catch (err) {
        done(err, null);
    }
}));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "EID",
    passwordField: "password",
}, (EID, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userAuth_model_1.User.findOne({
            $or: [{ EID: EID }, { email: EID }],
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = yield (0, password_util_1.comparePassword)(password, user.get("password"));
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        if (!user.get("verified"))
            throw new Error("User Not verified");
        const sessionUser = {
            EID: user.get("EID"),
            role: user.get("role"),
            PID: user.get("PID"),
            DID: user.get("DID"),
            ManagerID: user.get("ManagerID"),
            // password: user.get("password"),
        };
        done(null, sessionUser);
    }
    catch (err) {
        done(err, false);
    }
})));
