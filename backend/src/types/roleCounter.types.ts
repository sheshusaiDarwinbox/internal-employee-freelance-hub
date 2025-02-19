import type { Model } from "mongoose";
import { UserRole } from "./userAuth.types";

export interface RoleCounter {
  role: UserRole;
  counter: number;
}

export type RoleCounterModel = Model<RoleCounter>;
