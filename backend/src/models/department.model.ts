import { Schema, model } from "mongoose";
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
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: DepartmentEnum,
  },
  teamSize: { type: Number, required: true },
});

export const DepartmentModel = model<Department, DepartmentModelType>(
  "Department",
  departmentSchema
);
