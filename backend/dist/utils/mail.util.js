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
exports.sendForgotPasswordMail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const password_util_1 = require("./password.util");
const crypto_1 = __importDefault(require("crypto"));
const userVerification_model_1 = require("../models/userVerification.model");
const forgotPassword_model_1 = require("../models/forgotPassword.model");
const httpsStatusCodes_util_1 = require("./httpsStatusCodes.util");
const server_1 = require("../server");
const sendVerificationEmail = (data, session) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport(server_1.config);
    const verifyString = crypto_1.default.randomBytes(16).toString("base64url") + data._id;
    const baseUrl = process.env.BASE_URL;
    const hashedVerifyString = yield (0, password_util_1.hashPassword)(verifyString);
    const message = {
        from: "testmaildarwinbox@gmail.com",
        to: data.email,
        subject: "Verify your Account",
        html: `<p>click <a href=${baseUrl + "/api/verify/" + data._id + "/" + verifyString}>here</a><b></b> to activate your Account</p>
    <br> Your EID is: ${data.EID} <br>
    Your password is: ${data.password} 
    `,
    };
    console.log(`${baseUrl + "/api/verify/" + data._id + "/" + verifyString}`);
    // {baseUrl}/verify/id/verifyString
    const [verification] = yield userVerification_model_1.UserVerification.create([
        {
            email: data.email,
            verifyString: hashedVerifyString,
            _id: data._id,
        },
    ], { session });
    if (!verification)
        throw new Error("userverification doc failed to create");
    const info = yield transporter.sendMail(message);
    return {
        msg: "Verification Email sent",
        info: info.messageId,
        preview: nodemailer_1.default.getTestMessageUrl(info),
        id: data._id,
        password: data.password,
    };
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendForgotPasswordMail = (data, res) => __awaiter(void 0, void 0, void 0, function* () {
    const forgotVerifyString = crypto_1.default.randomBytes(16).toString("base64url") + data._id;
    const hashedforgotVerifyString = yield (0, password_util_1.hashPassword)(forgotVerifyString);
    const transporter = nodemailer_1.default.createTransport(server_1.config);
    const message = {
        from: "testmaildarwinbox@gmail.com",
        to: data.email,
        subject: "Forgot Password",
        html: `<p>Hello!</p><br><p>click <a href=${data.redirectUrl + "/" + data._id + "/" + forgotVerifyString}>here</a> to reset your password</p>`,
    };
    console.log(`${data.redirectUrl + "/" + data._id + "/" + forgotVerifyString}`);
    const d = yield forgotPassword_model_1.forgotPassword.findOne({ _id: data._id });
    if (d)
        yield forgotPassword_model_1.forgotPassword.deleteOne({ _id: data._id });
    const result = yield forgotPassword_model_1.forgotPassword.create({
        email: data.email,
        forgotVerifyString: hashedforgotVerifyString,
        _id: data._id,
    });
    if (!result)
        throw new Error("forgot Password doc failed to created");
    const info = yield transporter.sendMail(message);
    return res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).json({
        msg: "Forgot mail sent",
        info: info.messageId,
        preview: nodemailer_1.default.getTestMessageUrl(info),
    });
});
exports.sendForgotPasswordMail = sendForgotPasswordMail;
