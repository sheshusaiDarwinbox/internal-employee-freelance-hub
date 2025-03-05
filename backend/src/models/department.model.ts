import { Schema, model, type PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import type {
  Department,
  DepartmentModelType,
} from "../types/department.types";

export enum DepartmentEnum {
  Engineering = "Engineering",
  Product = "Product",
  Finance = "Finance",
  Marketing = "Marketing",
  Sales = "Sales",
  CustomerSupport = "Customer Support",
  Other = "Other",
}

const departmentSchema = new Schema<Department, DepartmentModelType>({
  DID: { type: String, required: true, index: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  function: {
    type: String,
    required: true,
    enum: DepartmentEnum,
  },
  ManagerID: {
    type: String,
  },
  teamSize: { type: Number, required: true },
});

departmentSchema.index({ name: "text" });
departmentSchema.plugin(paginate);

export const DepartmentModel = model<
  Department,
  PaginateModel<DepartmentModelType>
>("Department", departmentSchema);
