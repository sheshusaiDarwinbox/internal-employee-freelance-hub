import { CounterID } from "../models/idCounter.model";
import { IDs } from "../models/idCounter.model";

export enum IDMap {
  EID = "EMP",
  OID = "O",
  TaskID = "T",
  DID = "D",
  JID = "J",
}

export const generateId = async (type: IDMap) => {
  const counterDoc = await CounterID.findOneAndUpdate(
    { type },
    { $inc: { counter: 1 } },
    { new: true, upsert: true }
  );

  const id = `${type}-${counterDoc.counter.toString().padStart(6, "0")}`;

  return id;
};

export const initializeCounters = async () => {
  const id = await CounterID.find();
  if (id.length !== 0) return;
  for (const id of Object.values(IDs)) {
    console.log(id);
    await CounterID.findOneAndUpdate(
      { id },
      { $setOnInsert: { counter: 0 } }, // Initialize counter for each role
      { upsert: true }
    ).catch((err) => {
      console.log(err);
    });
  }
};
