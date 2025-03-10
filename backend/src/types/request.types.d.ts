import type { Model } from "mongoose";
import { ReqStatus } from "../models/request.model"; // Ensure ReqStatus is imported
import { RequestTypeEnum } from "../models/request.model";

export interface Request {
  ReqID: string;
  From: string;
  To: string;
  description: string;
  reqType: {
    type: keyof typeof RequestTypeEnum;
  };
  reqStatus: {
    type: keyof typeof ReqStatus;
  }; // Ensure reqStatus is defined as keyof ReqStatus
  email: string; // Ensure email is defined
  name: string; // Add name field
  skillset: string[]; // Add skillset field
  GID: string; // Add GID field
}

export type RequestModelType = Model<Request>;
