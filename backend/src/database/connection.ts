import mongoose from "mongoose";

export default async function connect() {
  const db = await mongoose.connect("mongodb://localhost:27017/org");

  console.log("Database connected");
  return db;
}
