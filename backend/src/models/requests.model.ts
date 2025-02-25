import { Schema, model } from "mongoose";
import type { Request, RequestModelType } from "../types/requests.types";
import { RequestTypeEnum } from "../types/requests.types";

const requestSchema = new Schema<Request, RequestModelType>({
  ReqID: { type: String, required: true, index: true, unique: true },
  FromEID: { type: String, required: true },
  ToEID: { type: String, required: true },
  reqType: {
    type: String,
    required: true,
    enum: Object.values(RequestTypeEnum),
  }
});

export const RequestModel = model<Request, RequestModelType>('Request', requestSchema);
