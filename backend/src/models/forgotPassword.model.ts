import { Schema, model } from "mongoose";
import type {
  forgotPasswordType,
  forgotPasswordModel,
} from "../types/userAuth.types";

export const forgotPasswordSchema = new Schema<
  forgotPasswordType,
  forgotPasswordModel
>({
  forgotVerifyString: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: "1h" },
});

forgotPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export const forgotPassword = model<forgotPasswordType, forgotPasswordModel>(
  "forgotPassword",
  forgotPasswordSchema
);
