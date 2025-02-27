import { Router } from "express";
import { error } from "../utils/error.util";
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
  forgotPasswordResetZodSchema,
  forgotPasswordZodSchema,
} from "../utils/zod.util";
import { sendForgotPasswordMail } from "../utils/mail.util";
import { forgotPassword } from "../models/forgotPassword.model";

export const userVerifyController = Router();

userVerifyController.get("/verify/:ID/:verifyString", async (req, res) => {
  try {
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
  } catch (err) {
    error(err, res);
  }
});

userVerifyController.post("/forgot-password", async (req, res) => {
  try {
    forgotPasswordZodSchema.parse(req.body);
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
  } catch (err) {
    error(err, res);
  }
});

userVerifyController.post(
  "/forgot-password/:ID/:forgotVerifyString",
  async (req, res) => {
    try {
      const { ID, forgotVerifyString } = req.params;
      forgotPasswordResetZodSchema.parse(req.body);
      const { newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword)
        throw new Error("Passwords must be same");
      const forgotInfo: forgotPasswordType | null =
        await forgotPassword.findOne({ _id: ID });
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
      console.log("result :",result);
      if (!result) throw new Error("Password reset failed");
      await forgotPassword.deleteOne({ _id: ID });
      const filePath = join(
        __dirname,
        "../public/passwordResetSuccessful.html"
      );
      const htmlContent = await readFile(filePath, "utf-8");
      res.status(HttpStatusCodes.OK).json({ msg: "Password reset successful" });;
    } catch (err) {
      error(err, res);
    }
  }
);
