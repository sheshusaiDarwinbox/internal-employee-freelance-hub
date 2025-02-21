import { Schema, model } from "mongoose";
import type { IDCounter, IDCounterModel } from "../types/idCounter.types";

export enum IDs {
  EID = "EID",
  OID = "OID",
  DID = "DID",
  JID = "JID",
  TaskID = "TaskID",
  BidID = "BidID",
  NID = "NID",
  RequestID = "RequestID",
  ReferID = "ReferID",
}

const counterSchema = new Schema<IDCounter, IDCounterModel>({
  id: { type: String, enum: IDs, required: true, unique: true },
  counter: { type: Number, required: true, default: 1 },
});

export const CounterID = model("Counter", counterSchema);
