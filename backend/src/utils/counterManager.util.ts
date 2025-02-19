import { CounterRole } from "../models/roleCounter.model";
import { UserRole } from "../types/userAuth.types";

export const generateId = async (role: UserRole) => {
  const counterDoc = await CounterRole.findOneAndUpdate(
    { role },
    { $inc: { counter: 1 } },
    { new: true, upsert: true }
  );

  const id = `${role === "Other" ? "O" : "EMP"}-${counterDoc.counter
    .toString()
    .padStart(6, "0")}`;

  return id;
};

export const initializeCounters = async () => {
  const roles = ["Employee", "Manager", "Admin", "Other"];
  for (const role of roles) {
    await CounterRole.findOneAndUpdate(
      { role },
      { $setOnInsert: { counter: 1 } }, // Initialize counter for each role
      { upsert: true }
    );
  }
};
