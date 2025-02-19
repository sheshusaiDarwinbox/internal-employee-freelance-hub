import { Schema, model } from "mongoose";
import type { CounterModel, RoleCounter } from "../types/roleCounter.types";

const counterSchema = new Schema<RoleCounter, CounterModel>({
  role: { type: String, required: true, unique: true },
  counter: { type: Number, required: true, default: 1 },
});

export const Counter = model("Counter", counterSchema);
