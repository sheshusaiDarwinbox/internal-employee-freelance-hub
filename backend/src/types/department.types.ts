import type { Model } from "mongoose";

export type DepartmentType =
  | "Engineering"
  | "Product"
  | "Finance"
  | "Marketing"
  | "Sales"
  | "Customer Support"
  | "Other";

export interface Department {
  DID: string;
  name: string;
  Description: string;
  Type: DepartmentType;
  TeamSize: number;
}

export type DepartmentModelType = Model<Department>;
