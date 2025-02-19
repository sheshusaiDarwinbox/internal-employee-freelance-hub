import { Schema, model } from "mongoose";
import type {
  Department,
  DepartmentType,
  DepartmentModelType,
} from "../types/department.types";

const departmentSchema = new Schema<Department, DepartmentModelType>({
  DID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  Description: { type: String, required: true },
  Type: {
    type: String,
    required: true,
    enum: [
      "Engineering",
      "Product",
      "Finance",
      "Marketing",
      "Sales",
      "Customer Support",
      "Other",
    ] as DepartmentType[],
  },
  TeamSize: { type: Number, required: true },
});

export const DepartmentModel = model<Department, DepartmentModelType>(
  "Department",
  departmentSchema
);
