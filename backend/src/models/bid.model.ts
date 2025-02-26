import { type PaginateModel, Schema, model } from "mongoose";
import type { Bid, BidModelType } from "../types/bid.types";
import paginate from "mongoose-paginate-v2";

const bidSchema = new Schema<Bid, BidModelType>({
  BID: { type: String, required: true, index: true, unique: true },
  TaskID: { type: String, required: true },
  description: { type: String, required: true },
  EID: { type: String, required: true },
});

bidSchema.plugin(paginate);

export const BidModel = model<Bid, PaginateModel<BidModelType>>(
  "Bid",
  bidSchema
);
