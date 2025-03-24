import mongoose from "mongoose";
import { createClient } from "redis";

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;
const REDIS_TIMEOUT = 10000;
const redisUrl = "redis://localhost:6379";

export const client = createClient({ url: redisUrl });

export default async function connect(
  retryCount = 0
): Promise<typeof mongoose | null> {
  try {
    const db = await mongoose.connect(
      "mongodb://127.0.0.1:27018,127.0.0.1:27019,127.0.0.1:27020/org",
      {
        replicaSet: "rs0",
        readPreference: "primary",
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        retryWrites: true,
        w: "majority",
        directConnection: false,
      }
    );

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    console.log("Mongo Database connected");

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Redis connection timeout"));
      }, REDIS_TIMEOUT);

      client
        .connect()
        .then(() => {
          clearTimeout(timeout);
          console.log("Redis connected successfully");
          resolve(true);
        })
        .catch((err) => {
          clearTimeout(timeout);
          reject(err);
        });
    });

    client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    return db;
  } catch (err) {
    console.error(`Connection attempt ${retryCount + 1} failed:`, err);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      return connect(retryCount + 1);
    }

    console.error("Max retries reached. Could not connect to database.");
    process.exit(1);
  }
}
