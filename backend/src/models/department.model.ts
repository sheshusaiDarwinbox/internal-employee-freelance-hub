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
  CustomerSupport = "Customer Support", // Note: Enums typically avoid spaces, so this could be CamelCase
  Other = "Other",
}

const departmentSchema = new Schema<Department, DepartmentModelType>({
  DID: { type: String, required: true, index: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: DepartmentEnum,
  },
  teamSize: { type: Number, required: true },
});

departmentSchema.plugin(paginate);

export const DepartmentModel = model<
  Department,
  PaginateModel<DepartmentModelType>
>("Department", departmentSchema);
