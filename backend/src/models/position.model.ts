import { Schema, model, type PaginateModel } from "mongoose";
import { type Position, type PositonModelType } from "../types/position.types";
import paginate from "mongoose-paginate-v2";

export enum PositionTypeEnum {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Internship = "Internship",
  Temporary = "Temporary",
  Freelance = "Freelance",
  Contract = "Contract",
  Other = "Other",
}

export const jobSchema = new Schema<Position, PositonModelType>({
  PID: { type: String, required: true, index: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: PositionTypeEnum,
    required: true,
  },
  salary: { type: Number },
  DID: { type: Schema.Types.String, ref: "Department", required: true },
});

jobSchema.index({ title: "text" });
jobSchema.plugin(paginate);

export const PositionModel = model<Position, PaginateModel<PositonModelType>>(
  "Job",
  jobSchema
);
