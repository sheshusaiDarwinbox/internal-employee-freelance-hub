import { Response } from "express";
import nodemailer from "nodemailer";
import { hashPassword } from "./password.util";
import crypto from "crypto";
import { UserVerification } from "../models/userVerification.model";
import { error } from "./error.util";
import { Types } from "mongoose";
import { forgotPassword } from "../models/forgotPassword.model";
import { HttpStatusCodes } from "./httpsStatusCodes.util";

export const config = {
  service: "gmail",
  auth: {
    user: process.env.NODEJS_GMAIL_APP_USER,
    pass: process.env.NODEJS_GMAIL_APP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testmaildarwinbox@gmail.com",
    pass: "pgkjgecbdslibsmc",
  },
});

export const sendVerificationEmail = async (
  data: {
    EID: string;
    _id: Types.ObjectId;
    email: string;
    password: string;
  },
  baseUrl: string,
  res: Response
) => {
  try {
    const verifyString = crypto.randomBytes(16).toString("base64") + data._id;

    const hashedVerifyString = await hashPassword(verifyString);
    const message = {
      from: "testmaildarwinbox@gmail.com", // sender address
      to: data.email, // list of receivers
      subject: "Verify your Account", // Subject line
      html: `<p>click <a href=${
        baseUrl + "/api/verify/" + data._id + "/" + verifyString
      }>here</a><b></b> to activate your Account</p>`,
    };

    console.log(`${baseUrl + "/api/verify/" + data._id + "/" + verifyString}`);
    // {baseUrl}/verify/id/verifyString

    const result = await UserVerification.create({
      email: data.email,
      verifyString: hashedVerifyString,
      _id: data._id,
    });

    if (!result) throw new Error("userverification doc failed to create");

    transporter
      .sendMail(message)
      .then((info) => {
        return res.status(201).json({
          msg: "Verification Email sent",
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
          id: data._id,
          password: data.password,
        });
      })
      .catch((err) => {
        return res.status(500).json({ msg: err });
      });
  } catch (err) {
    error(err, res);
  }
};

export const sendForgotPasswordMail = async (
  data: {
    _id: Types.ObjectId;
    email: string;
    redirectUrl: string;
  },
  res: Response
) => {
  try {
    const forgotVerifyString =
      crypto.randomBytes(16).toString("base64") + data._id;

    const hashedforgotVerifyString = await hashPassword(forgotVerifyString);

    const message = {
      from: "testmaildarwinbox@gmail.com",
      to: data.email,
      subject: "Forgot Password",
      html: `<p>Hello!</p><br><p>click <a href=${
        data.redirectUrl +
        "/" +
        data._id +
        "/" +
        forgotVerifyString
      }>here</a> to reset your password</p>`,
    };

    console.log(
      `${
        data.redirectUrl +
        "/" +
        data._id +
        "/" +
        forgotVerifyString
      }`
    );

    const result = await forgotPassword.create({
      email: data.email,
      forgotVerifyString: hashedforgotVerifyString,
      _id: data._id,
    });

    if (!result) throw new Error("forgot Password doc failed to created");

    transporter.sendMail(message).then((info) => {
      return res.status(HttpStatusCodes.OK).json({
        msg: "Forgot mail sent",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    });
  } catch (err) {
    error(err, res);
  }
};