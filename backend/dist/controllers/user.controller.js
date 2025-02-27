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
exports.userControlRouter = exports.getUserById = exports.deleteUserByID = exports.getAllUsers = exports.createUser = void 0;
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const job_model_1 = require("../models/job.model");
const zod_util_1 = require("../utils/zod.util");
const express_1 = require("express");
const userAuth_model_1 = require("../models/userAuth.model");
const counterManager_util_1 = require("../utils/counterManager.util");
const department_model_1 = require("../models/department.model");
const password_util_1 = require("../utils/password.util");
const idCounter_model_1 = require("../models/idCounter.model");
const mail_util_1 = require("../utils/mail.util");
const session_util_1 = require("../utils/session.util");
exports.createUser = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = zod_util_1.CreateUserSchema.parse(req.body);
    const department = yield department_model_1.DepartmentModel.findOne({ DID: data.DID });
    const job = yield job_model_1.JobModel.findOne({ JID: data.JID });
    if (!department || !job)
        throw new Error("Department or Job not found");
    const id = yield (0, counterManager_util_1.generateId)(idCounter_model_1.IDs.EID);
    const password = (0, password_util_1.generateRandomPassword)();
    const hashedPassword = yield (0, password_util_1.hashPassword)(password);
    const user = yield userAuth_model_1.User.create(Object.assign(Object.assign({}, data), { verified: false, EID: id, password: hashedPassword, doj: new Date() }));
    const result = yield department_model_1.DepartmentModel.findOneAndUpdate({ DID: data.DID }, { $inc: { teamSize: 1 } });
    if (!result)
        throw new Error("Department not updated");
    (0, mail_util_1.sendVerificationEmail)({ EID: id, _id: user._id, password, email: data.email }, "http://localhost:3000", res);
}));
exports.getAllUsers = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { types, page = 0 } = req.query;
    const filter = {};
    const pageNum = Number(page);
    if (types) {
        const typesArray = types.split(",");
        zod_util_1.UsersArraySchema.parse(typesArray);
        filter.role = { $in: typesArray };
    }
    const users = yield userAuth_model_1.User.paginate(filter, {
        offset: pageNum * 10,
        limit: 10,
    });
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(users);
}));
exports.deleteUserByID = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID } = req.params;
    zod_util_1.GetUserSchema.parse({ EID: ID });
    const user = yield userAuth_model_1.User.findOne({ EID: ID });
    if (!user)
        throw new Error("Bad Request");
    const result = yield userAuth_model_1.User.deleteOne({ EID: ID });
    if (result.acknowledged === false)
        throw new Error("User Not Deleted");
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(user);
}));
exports.getUserById = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID } = req.params;
    zod_util_1.GetUserSchema.parse({ EID: ID });
    const user = yield userAuth_model_1.User.findOne({ EID: ID });
    if (!user)
        throw new Error("Bad Request");
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(user);
}));
exports.userControlRouter = (0, express_1.Router)();
exports.userControlRouter.post("/create", exports.createUser);
exports.userControlRouter.get("", exports.getAllUsers);
exports.userControlRouter.delete("/:ID", exports.deleteUserByID);
exports.userControlRouter.get("/:ID", exports.getUserById);
