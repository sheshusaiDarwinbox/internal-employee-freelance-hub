import { Schema, model } from "mongoose";
import type { UserAuth, UserAuthModel } from "../types/userAuth.types";

const userAuthSchema = new Schema<UserAuth, UserAuthModel>({
  EID: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  role: { type: String, required: true },
});

export const User: UserAuthModel = model<UserAuth, UserAuthModel>(
  "UserAuth",
  userAuthSchema
);
