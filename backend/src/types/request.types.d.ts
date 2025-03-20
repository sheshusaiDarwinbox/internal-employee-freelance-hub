import type { Model } from "mongoose";
import { RequestTypeEnum } from "../models/request.model";
import { ReqStatus } from "../models/request.model";

export interface Request {
  ReqID: string;
  From: string;
  To: string;
  description: string;
  reqType: {
    type: keyof typeof RequestTypeEnum;
  };
  status: {
    type: keyof typeof ReqStatus;
  };
}

export type RequestModelType = Model<Request>;
