import type { Model } from "mongoose";
import { DepartmentEnum } from "../models/department.model";

export type DepartmentType = keyof typeof DepartmentEnum;
export interface Department {
  DID: string;
  name: string;
  description: string;
  type: DepartmentType;
  teamSize: number;
}

export type DepartmentModelType = Model<Department>;
