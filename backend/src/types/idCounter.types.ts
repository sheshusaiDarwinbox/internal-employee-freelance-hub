import type { Model } from "mongoose";

import { IDs } from "../models/idCounter.model";

export type IDType = keyof typeof IDs;
export interface IDCounter {
  id: IDType;
  counter: number;
}

export type IDCounterModel = Model<IDCounter>;
