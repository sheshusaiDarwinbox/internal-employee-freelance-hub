import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { Queue, Worker } from "bullmq";
import express from "express";
import {} from "redis";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { createApp } from "./app";
import connect, { client } from "./database/connection";
import { setAdmin } from "./utils/adminSetup.util";
import { initializeCounters } from "./utils/counterManager.util";
import { RedisCommander } from "ioredis";
import { Gig } from "./models/gig.model";
import { BidModel } from "./models/bid.model";
import { GigModel, GigSchema } from "./types/gig.types";

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
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST"],
    },
  });

  const inputQueue = new Queue("inputQueue");
  const resultQueue = new Queue("resultQueue", {
    connection: { host: "localhost", port: 6379 },
  });

  inputQueue.on("error", (err) => {
    console.log(err);
  });

  let userSockets: any = {};

  function execMultiAsync(multi: any): Promise<any> {
    return new Promise((resolve, reject) => {
      multi.exec((err: any, replies: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(replies);
        }
      });
    });
  }

  const multi = client.multi();
  io.on("connection", async (socket) => {
    console.log("User connected");

    socket.on("user_input", async (inputData) => {
      console.log("Received input:", inputData);

      userSockets[socket.id] = socket;

      const { GigID, page = 1 } = inputData;
      console.log(inputData);
      const gig: GigSchema | null = await Gig.findOne({ GigID: GigID });
      const bids = await BidModel.find({ GigID: GigID }).select("EID -_id");

      if (gig && bids) {
        multi.rPush(
          "inputQueue",
          JSON.stringify({
            gigSkills: gig.skills,
            bids: bids,
            socketId: socket.id,
          })
        );

        multi.exec();
        socket.emit("Processing the request submitted");
      } else {
        socket.emit("result", "bad request");
      }
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

  server.listen(3000, () => {
    console.log("Server running on port 3000");
    setAdmin();
    initializeCounters();
  });
  // server.listen(4000, () => {
  //   console.log("ws server running on port 4000");
  // });
});
