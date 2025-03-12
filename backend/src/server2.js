import { createClient } from "redis";
import { userSockets } from "../dist/server.js";

const client2 = createClient({
  url: "redis://localhost:6379",
});

client2.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

async function processJob(job) {
  console.log("Processing job:", job);
}

async function listenToQueue() {
  while (true) {
    try {
      const job = await client2.rPop("resultQueue");

      if (job) {
        await processJob(job);
      } else {
        console.log("No job in the queue. Waiting for new jobs...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
      }
    } catch (error) {
      console.error("Error while processing job:", error);
    }
  }
}

listenToQueue();
