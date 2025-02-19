import { Schema, model } from "mongoose";
import type { RoleCounterModel, RoleCounter } from "../types/roleCounter.types";

const counterSchema = new Schema<RoleCounter, RoleCounterModel>({
  role: { type: String, required: true, unique: true },
  counter: { type: Number, required: true, default: 1 },
});

export const CounterRole = model("Counter", counterSchema);
