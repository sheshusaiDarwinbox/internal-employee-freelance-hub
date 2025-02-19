import { Counter } from "../models/roleCounter.model";
import { UserRole } from "../types/userAuth.types";

const generateEmployeeId = async (role: UserRole) => {
  const counterDoc = await Counter.findOneAndUpdate(
    { role },
    { $inc: { counter: 1 } },
    { new: true, upsert: true }
  );

  const employeeId = `${role === "Other" ? "O" : "EMP"}-${counterDoc.counter
    .toString()
    .padStart(6, "0")}`;

  return employeeId;
};

const initializeCounters = async () => {
  const roles = ["Employee", "Manager", "Admin", "Other"];
  for (const role of roles) {
    await Counter.findOneAndUpdate(
      { role },
      { $setOnInsert: { counter: 1 } }, // Initialize counter for each role
      { upsert: true }
    );
  }
};
