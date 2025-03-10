import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { Queue, Worker } from "bullmq";
import express from "express";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { createApp } from "./app";
import connect, { client } from "./database/connection";
import { setAdmin } from "./utils/adminSetup.util";
import { initializeCounters } from "./utils/counterManager.util";

export const user = process.env.NODEJS_GMAIL_APP_USER;
export const pass = process.env.NODEJS_GMAIL_APP_PASSWORD;

export const config = {
  service: "gmail",
  auth: {
    user: user,
    pass: pass,
  },
};

connect().then(() => {
  const app = createApp();
  const app2 = express();
  const server = http.createServer(app2);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const inputQueue = new Queue("inputQueue", {
    connection: { host: "localhost", port: 6379 },
  });
  const resultQueue = new Queue("resultQueue", {
    connection: { host: "localhost", port: 6379 },
  });

  let userSockets: any = {};

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("user_input", async (inputData) => {
      console.log("Received input:", inputData);

      userSockets[socket.id] = socket;

      const job = await inputQueue.add("process_input", {
        input: inputData,
        socketId: socket.id,
      });
      console.log("Job added to inputQueue:", job.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      delete userSockets[socket.id];
    });
  });

  io.on("error", () => {
    console.log("failed to connect ");
  });

  const resultWorker = new Worker(
    "resultQueue",
    async (job) => {
      const result = job.data.result;
      const socketId = job.data.socketId;

      console.log("Sending result:", result);

      const socket = userSockets[socketId];
      if (socket) {
        socket.emit("result", result);
        console.log("Result sent to user:", result);
      }
    },
    { connection: { host: "localhost", port: 6379 } }
  );

  process.on("SIGINT", async () => {
    try {
      await client.del("inputQueue");
      await client.del("resultQueue");
      console.log("Queues cleared on shutdown");
      process.exit(0);
    } catch (err) {
      console.error("Error while clearing Redis queues:", err);
      process.exit(1);
    }
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
    setAdmin();
    initializeCounters();
  });
  server.listen(4000, () => {
    console.log("ws server running on port 4000");
  });
});
