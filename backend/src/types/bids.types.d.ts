import type { Model } from "mongoose";

export interface Bid {
  BID: string;
  TaskID: string;
  description: string;
  EID: string;
}

export type BidModelType = Model<Bid>;
