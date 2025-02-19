import type { Model } from "mongoose";

export enum DepartmentEnum {
  Engineering = "Engineering",
  Product = "Product",
  Finance = "Finance",
  Marketing = "Marketing",
  Sales = "Sales",
  CustomerSupport = "Customer Support", // Note: Enums typically avoid spaces, so this could be CamelCase
  Other = "Other",
}

export type DepartmentType = keyof typeof DepartmentEnum;
export interface Department {
  DID: string;
  name: string;
  Description: string;
  Type: DepartmentType;
  TeamSize: number;
}

export type DepartmentModelType = Model<Department>;
