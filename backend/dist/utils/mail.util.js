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
exports.sendForgotPasswordMail = exports.sendVerificationEmail = exports.config = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const password_util_1 = require("./password.util");
const crypto_1 = __importDefault(require("crypto"));
const userVerification_model_1 = require("../models/userVerification.model");
const error_util_1 = require("./error.util");
const forgotPassword_model_1 = require("../models/forgotPassword.model");
const httpsStatusCodes_util_1 = require("./httpsStatusCodes.util");
exports.config = {
    service: "gmail",
    auth: {
        user: process.env.NODEJS_GMAIL_APP_USER,
        pass: process.env.NODEJS_GMAIL_APP_PASSWORD,
    },
};
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "testmaildarwinbox@gmail.com",
        pass: "pgkjgecbdslibsmc",
    },
});
const sendVerificationEmail = (data, baseUrl, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyString = crypto_1.default.randomBytes(16).toString("base64") + data._id;
        const hashedVerifyString = yield (0, password_util_1.hashPassword)(verifyString);
        const message = {
            from: "testmaildarwinbox@gmail.com", // sender address
            to: data.email, // list of receivers
            subject: "Verify your Account", // Subject line
            html: `<p>click <a href=${baseUrl + "/api/verify/" + data._id + "/" + verifyString}>here</a><b></b> to activate your Account</p>`,
        };
        console.log(`${baseUrl + "/api/verify/" + data._id + "/" + verifyString}`);
        // {baseUrl}/verify/id/verifyString
        const result = yield userVerification_model_1.UserVerification.create({
            email: data.email,
            verifyString: hashedVerifyString,
            _id: data._id,
        });
        if (!result)
            throw new Error("userverification doc failed to create");
        transporter
            .sendMail(message)
            .then((info) => {
            return res.status(201).json({
                msg: "Verification Email sent",
                info: info.messageId,
                preview: nodemailer_1.default.getTestMessageUrl(info),
                id: data._id,
                password: data.password,
            });
        })
            .catch((err) => {
            return res.status(500).json({ msg: err });
        });
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendForgotPasswordMail = (data, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const forgotVerifyString = crypto_1.default.randomBytes(16).toString("base64") + data._id;
        const hashedforgotVerifyString = yield (0, password_util_1.hashPassword)(forgotVerifyString);
        const message = {
            from: "testmaildarwinbox@gmail.com",
            to: data.email,
            subject: "Forgot Password",
            html: `<p>Hello!</p><br><p>click <a href=${data.redirectUrl +
                "/" +
                data._id +
                "/" +
                forgotVerifyString}>here</a> to reset your password for darwinbox freelance Application</p>`,
        };
        console.log(`${data.redirectUrl +
            "/" +
            data._id +
            "/" +
            forgotVerifyString}`);
        const result = yield forgotPassword_model_1.forgotPassword.create({
            email: data.email,
            forgotVerifyString: hashedforgotVerifyString,
            _id: data._id,
        });
        if (!result)
            throw new Error("forgot Password doc failed to created");
        transporter.sendMail(message).then((info) => {
            return res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).json({
                msg: "Forgot mail sent",
                info: info.messageId,
                preview: nodemailer_1.default.getTestMessageUrl(info),
            });
        });
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.sendForgotPasswordMail = sendForgotPasswordMail;
