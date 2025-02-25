import type { Model } from "mongoose";

export enum RequestTypeEnum {
  ApproveTask = "ApproveTask",
  CreateUser = "CreateUser",
  DeleteUser="DeleteUser",
//   ApproveRewardOrPayment = "approveRewardOrPayment"
}
export enum ReqStatus{
  Complete="Complete",
  Pending = "Pending",
  Reject = "Reject"
}

export interface Request {
  ReqID: string;
  FromEID: string;
  ToEID: string;
  description:string,
  reqType: {
    type: keyof typeof RequestTypeEnum;
  };
  status:{
    type : keyof typeof ReqStatus;
  }
}

export type RequestModelType = Model<Request>;
