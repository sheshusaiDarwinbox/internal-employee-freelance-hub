import { type PaginateModel, Schema, model } from "mongoose";
import type { Request, RequestModelType } from "../types/request.types";
import paginate from "mongoose-paginate-v2";

export enum RequestTypeEnum {
  ApproveTask = "ApproveTask",
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
});

requestSchema.plugin(paginate);

export const RequestModel = model<Request, PaginateModel<RequestModelType>>(
  "Request",
  requestSchema
);
