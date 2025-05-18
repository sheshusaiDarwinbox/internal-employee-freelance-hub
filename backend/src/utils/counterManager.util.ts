import { CounterID } from "../models/idCounter.model";
import { IDs } from "../models/idCounter.model";
import { ClientSession } from "mongoose";

export const IDMap = {
  EID: "EMP",
  OID: "O",
  GigID: "G",
  DID: "D",
  PID: "P",
  BidID: "B",
  NID: "N",
  ReqID: "Req",
  RefID: "Ref",
};

export const generateId = async (type: IDs, session: ClientSession) => {
  const counterDoc = await CounterID.findOneAndUpdate(
    { id: type },
    { $inc: { counter: 1 } },
    { session, new: true, upsert: true }
  );

  const id = `${IDMap[type]}${counterDoc.counter.toString().padStart(6, "0")}`;

  return id;
};

export const initializeCounters = async () => {
  const id = await CounterID.find();
  if (id.length !== 0) return;
  for (const id of Object.values(IDs)) {
    console.log(id);
    await CounterID.findOneAndUpdate(
      { id },
      { $setOnInsert: { counter: 0 } },
      { upsert: true }
    ).catch((err) => {
      console.log(err);
    });
  }
};
