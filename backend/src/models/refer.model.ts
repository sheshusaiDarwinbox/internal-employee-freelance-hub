import { PaginateModel, Schema, model } from "mongoose";
import type { Refer, ReferModelType } from "../types/refer.types";
import paginate from "mongoose-paginate-v2";

const referSchema = new Schema<Refer, ReferModelType>({
  RefID: { type: String, required: true, index: true, unique: true },
  GigID: { type: String, required: true },
  EID: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
});

referSchema.plugin(paginate);

export const ReferModel = model<Refer, PaginateModel<ReferModelType>>(
  "Refer",
  referSchema
);
