import { Response } from "express";
import nodemailer from "nodemailer";
import { hashPassword } from "./password.util";
import crypto from "crypto";
import { UserVerification } from "../models/userVerification.model";
import { Types } from "mongoose";
import { forgotPassword } from "../models/forgotPassword.model";
import { HttpStatusCodes } from "./httpsStatusCodes.util";
import { config } from "../server";

export const sendVerificationEmail = async (data: {
  EID: string;
  _id: Types.ObjectId;
  email: string;
  password: string;
}) => {
  const transporter = nodemailer.createTransport(config);
  const verifyString = crypto.randomBytes(16).toString("base64url") + data._id;
  const baseUrl = process.env.BASE_URL;
  const hashedVerifyString = await hashPassword(verifyString);
  const message = {
    from: "testmaildarwinbox@gmail.com",
    to: data.email,
    subject: "Verify your Account",
    html: `<p>click <a href=${
      baseUrl + "/api/verify/" + data._id + "/" + verifyString
    }>here</a><b></b> to activate your Account</p>
    <br> Your EID is: ${data.EID} <br>
    Your password is: ${data.password} 
    `,
  };

  console.log(`${baseUrl + "/api/verify/" + data._id + "/" + verifyString}`);
  // {baseUrl}/verify/id/verifyString

  const [verification] = await UserVerification.create([
    {
      email: data.email,
      verifyString: hashedVerifyString,
      _id: data._id,
    },
  ]);

  if (!verification) throw new Error("userverification doc failed to create");

  const info = await transporter.sendMail(message);
  return {
    msg: "Verification Email sent",
    info: info.messageId,
    preview: nodemailer.getTestMessageUrl(info),
    id: data._id,
    password: data.password,
  };
};

export const sendForgotPasswordMail = async (
  data: {
    _id: Types.ObjectId;
    email: string;
    redirectUrl: string;
  },
  res: Response
) => {
  const forgotVerifyString =
    crypto.randomBytes(16).toString("base64url") + data._id;

  const hashedforgotVerifyString = await hashPassword(forgotVerifyString);

  const transporter = nodemailer.createTransport(config);

  const message = {
    from: "testmaildarwinbox@gmail.com",
    to: data.email,
    subject: "Forgot Password",
    html: `<p>Hello!</p><br><p>click <a href=${
      data.redirectUrl + "/" + data._id + "/" + forgotVerifyString
    }>here</a> to reset your password</p>`,
  };

  console.log(
    `${data.redirectUrl + "/" + data._id + "/" + forgotVerifyString}`
  );

  const d = await forgotPassword.findOne({ _id: data._id });
  if (d) await forgotPassword.deleteOne({ _id: data._id });
  const result = await forgotPassword.create({
    email: data.email,
    forgotVerifyString: hashedforgotVerifyString,
    _id: data._id,
  });

  if (!result) throw new Error("forgot Password doc failed to created");

  const info = await transporter.sendMail(message);
  return res.status(HttpStatusCodes.OK).json({
    msg: "Forgot mail sent",
    info: info.messageId,
    preview: nodemailer.getTestMessageUrl(info),
  });
};
