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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userVerifyController = void 0;
const express_1 = require("express");
const userVerification_model_1 = require("../models/userVerification.model");
const password_util_1 = require("../utils/password.util");
const userAuth_model_1 = require("../models/userAuth.model");
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const zod_util_1 = require("../utils/zod.util");
const mail_util_1 = require("../utils/mail.util");
const forgotPassword_model_1 = require("../models/forgotPassword.model");
const session_util_1 = require("../utils/session.util");
exports.userVerifyController = (0, express_1.Router)();
exports.userVerifyController.get("/verify/:ID/:verifyString", (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID, verifyString } = req.params;
    const verifyInfo = yield userVerification_model_1.UserVerification.findOne({ _id: ID });
    if (!verifyInfo)
        throw new Error("Bad Request");
    const isMatch = yield (0, password_util_1.comparePassword)(verifyString, verifyInfo.verifyString);
    if (!isMatch)
        throw new Error("Invalid verifyString");
    const user = yield userAuth_model_1.User.findOne({ email: verifyInfo.email });
    if (!user)
        throw new Error("Invalid user");
    const result = yield userAuth_model_1.User.updateOne({ email: verifyInfo.email }, { verified: true });
    if (!result)
        throw new Error("User Not verified");
    yield userVerification_model_1.UserVerification.deleteOne({ _id: ID });
    const filePath = (0, path_1.join)(__dirname, "../public/accountVerified.html");
    const htmlContent = yield (0, promises_1.readFile)(filePath, "utf-8");
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(htmlContent);
})));
exports.userVerifyController.post("/forgot-password", (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/forgot-password called to get the link for forgot password");
    zod_util_1.ForgotPasswordZodSchema.parse(req.body);
    const { email, redirectUrl } = req.body;
    const user = yield userAuth_model_1.User.findOne({ email: email });
    if (!user)
        throw new Error("Email not found");
    (0, mail_util_1.sendForgotPasswordMail)({
        _id: user._id,
        email: email,
        redirectUrl,
    }, res);
})));
exports.userVerifyController.post("/forgot-password/:ID/:forgotVerifyString", (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("forgot password reset called");
    const { ID, forgotVerifyString } = req.params;
    zod_util_1.ForgotPasswordResetZodSchema.parse(req.body);
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword)
        throw new Error("Passwords must be same");
    const forgotInfo = yield forgotPassword_model_1.forgotPassword.findOne({
        _id: ID,
    });
    if (!forgotInfo)
        throw new Error("Bad Request");
    const isMatch = yield (0, password_util_1.comparePassword)(forgotVerifyString, forgotInfo.forgotVerifyString);
    if (!isMatch)
        throw new Error("Invalid forgot verify string ");
    const user = yield userAuth_model_1.User.findOne({ email: forgotInfo.email });
    if (!user)
        throw new Error("Invalid user");
    const hashedPassword = yield (0, password_util_1.hashPassword)(newPassword);
    const result = yield userAuth_model_1.User.updateOne({ email: forgotInfo.email }, { password: hashedPassword });
    if (!result)
        throw new Error("Password reset failed");
    yield forgotPassword_model_1.forgotPassword.deleteOne({ _id: ID });
    const filePath = (0, path_1.join)(__dirname, "../public/passwordResetSuccessful.html");
    const htmlContent = yield (0, promises_1.readFile)(filePath, "utf-8");
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(htmlContent);
})));
