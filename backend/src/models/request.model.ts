import { type PaginateModel, Schema, model } from "mongoose";
import type { Request, RequestModelType } from "../types/request.types";
import paginate from "mongoose-paginate-v2";

export enum RequestTypeEnum {
  ApproveGig = "ApproveGig",
  CreateUser = "CreateUser",
  DeleteUser = "DeleteUser",
}
export enum ReqStatus {
  Complete = "Complete",
  Pending = "Pending",
  Rejected = "Rejected",
}

const requestSchema = new Schema<Request, RequestModelType>({
  ReqID: { type: String, required: true, index: true, unique: true },
  From: { type: String, required: true },
  To: { type: String, required: true },
  reqType: {
    type: String,
    required: true,
    enum: Object.values(RequestTypeEnum),
  },
  description: { type: String },
  name: { type: String }, // Add name field
  email: { type: String }, // Add email field
  skillset: { type: [String] }, // Add skillset field
  reqStatus: { type: String, required: true, enum: Object.values(ReqStatus)  },
  GID: { type: String } // Add GID field
});

requestSchema.plugin(paginate);

export const RequestModel = model<Request, PaginateModel<RequestModelType>>(
  "Request",
  requestSchema
);
