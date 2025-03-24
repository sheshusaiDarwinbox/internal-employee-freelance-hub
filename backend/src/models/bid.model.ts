import { type PaginateModel, Schema, model } from "mongoose";
import type { Bid, BidModelType } from "../types/bid.types";
import paginate from "mongoose-paginate-v2";

export const bidSchema = new Schema<Bid, BidModelType>({
  BidID: { type: String, required: true, index: true, unique: true },
  GigID: { type: String, required: true },
  description: { type: String, required: true },
  EID: { type: String, required: true },
});

bidSchema.plugin(paginate);

export const BidModel = model<Bid, PaginateModel<BidModelType>>(
  "Bid",
  bidSchema
);
