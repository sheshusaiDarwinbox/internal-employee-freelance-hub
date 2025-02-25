import { Schema, model } from "mongoose";
import type { Bid, BidModelType } from "../types/bids.types";

const bidSchema = new Schema<Bid, BidModelType>({
  BID: { type: String, required: true, index: true, unique: true },
  TaskID: { type: String, required: true },
  description: { type: String, required: true },
  EID: { type: String ,required:true}
});

export const BidModel = model<Bid, BidModelType>('Bid', bidSchema);
