import { Router } from "express";
import { UserVerification } from "../models/userVerification.model";
import { comparePassword, hashPassword } from "../utils/password.util";
import {
  forgotPasswordType,
  UserVerificationType,
} from "../types/userAuth.types";
import { User } from "../models/userAuth.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";
import { join } from "path";
import { readFile } from "fs/promises";
import {
  ForgotPasswordResetZodSchema,
  ForgotPasswordZodSchema,
} from "../utils/zod.util";
import { sendForgotPasswordMail } from "../utils/mail.util";
import { forgotPassword } from "../models/forgotPassword.model";
import { sessionHandler } from "../utils/session.util";

export const userVerifyController = Router();

userVerifyController.get(
  "/verify/:ID/:verifyString",
  sessionHandler(async (req, res) => {
    const { ID, verifyString } = req.params;
    const verifyInfo: UserVerificationType | null =
      await UserVerification.findOne({ _id: ID });
    if (!verifyInfo) throw new Error("Bad Request");
    const isMatch = await comparePassword(
      verifyString,
      verifyInfo.verifyString
    );

    if (!isMatch) throw new Error("Invalid verifyString");
    const user = await User.findOne({ email: verifyInfo.email });
    if (!user) throw new Error("Invalid user");
    const result = await User.updateOne(
      { email: verifyInfo.email },
      { verified: true }
    );
    if (!result) throw new Error("User Not verified");
    await UserVerification.deleteOne({ _id: ID });
    const filePath = join(__dirname, "../public/accountVerified.html");
    const htmlContent = await readFile(filePath, "utf-8");
    res.status(HttpStatusCodes.OK).send(htmlContent);
  })
);

userVerifyController.post(
  "/forgot-password",
  sessionHandler(async (req, res) => {
    console.log("/forgot-password called to get the link for forgot password");
    ForgotPasswordZodSchema.parse(req.body);
    const { email, redirectUrl } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Email not found");

    sendForgotPasswordMail(
      {
        _id: user._id,
        email: email,
        redirectUrl,
      },
      res
    );
  })
);

userVerifyController.post(
  "/forgot-password/:ID/:forgotVerifyString",
  sessionHandler(async (req, res) => {
    console.log("forgot password reset called");
    const { ID, forgotVerifyString } = req.params;
    ForgotPasswordResetZodSchema.parse(req.body);
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword)
      throw new Error("Passwords must be same");
    const forgotInfo: forgotPasswordType | null = await forgotPassword.findOne({
      _id: ID,
    });
    if (!forgotInfo) throw new Error("Bad Request");
    const isMatch = await comparePassword(
      forgotVerifyString,
      forgotInfo.forgotVerifyString
    );
    if (!isMatch) throw new Error("Invalid forgot verify string ");
    const user = await User.findOne({ email: forgotInfo.email });
    if (!user) throw new Error("Invalid user");
    const hashedPassword = await hashPassword(newPassword);
    const result = await User.updateOne(
      { email: forgotInfo.email },
      { password: hashedPassword }
    );

    if (!result) throw new Error("Password reset failed");
    await forgotPassword.deleteOne({ _id: ID });
    const filePath = join(__dirname, "../public/passwordResetSuccessful.html");
    const htmlContent = await readFile(filePath, "utf-8");
    res.status(HttpStatusCodes.OK).send(htmlContent);
  })
);
