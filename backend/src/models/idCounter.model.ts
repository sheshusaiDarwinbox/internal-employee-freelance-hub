import { Schema, model } from "mongoose";
import type { IDCounter, IDCounterModel } from "../types/idCounter.types";

export enum IDs {
  EID = "EID",
  OID = "OID",
  DID = "DID",
  PID = "PID",
  GigID = "GigID",
  BidID = "BidID",
  NID = "NID",
  ReqID = "ReqID",
  RefID = "RefID",
}

const counterSchema = new Schema<IDCounter, IDCounterModel>({
  id: { type: String, enum: IDs, required: true, unique: true },
  counter: { type: Number, required: true, default: 1 },
});

export const CounterID = model("Counter", counterSchema);
