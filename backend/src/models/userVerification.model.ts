import { Schema, model } from "mongoose";
import {
  type UserVerificationType,
  type UserVerificationModel,
} from "../types/userAuth.types";

export const userVerificationSchema = new Schema<
  UserVerificationType,
  UserVerificationModel
>({
  verifyString: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: "6h" },
});

// userVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 21600 });

export const UserVerification = model<
  UserVerificationType,
  UserVerificationModel
>("userVerification", userVerificationSchema);
