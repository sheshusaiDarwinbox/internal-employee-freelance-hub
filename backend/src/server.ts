import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { Worker } from "bullmq";
import express from "express";
import { createClient } from "redis";
import { promisify } from "util";
import Queue from "bull";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { createApp } from "./app";
import connect, { client } from "./database/connection";
import { setAdmin } from "./utils/adminSetup.util";
import { initializeCounters } from "./utils/counterManager.util";
import { Gig } from "./models/gig.model";
import { BidModel } from "./models/bid.model";
import { GigModel, GigSchema } from "./types/gig.types";
import { setupSocket } from "./socket"; // Import setupSocket
import { MessageModel, MessageStatus } from "./models/messages.model";
import { User } from "./models/userAuth.model";

export const user = process.env.NODEJS_GMAIL_APP_USER;
export const pass = process.env.NODEJS_GMAIL_APP_PASSWORD;

export const config = {
  service: "gmail",
  auth: {
    user: user,
    pass: pass,
  },
};

export const userSockets: any = {};

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


  // Setup Socket.IO
  setupSocket(io); // Initialize Socket.IO using setupSocket

  const client2 = createClient({
    url: "redis://localhost:6379",
  });

  client2.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

  async function processJob(job: string) {
    console.log("Processing job:", job);

    const data = job.split(" ");
    if (data.length <= 1) return;
    const socket = userSockets[data[0]];
    const GigID = data[1];
    const page = data[2];
    delete data[0];
    delete data[1];
    delete data[2];

    const modifiedData = [];
    let total = 0;
    for (let i = 3; i < data.length - 1; i += 2) {
      const EID = "EMP" + data[i].padStart(6, "0");
      const [bid] = await BidModel.aggregate([
        { $match: { GigID: GigID, EID: EID } },
        {
          $lookup: {
            from: "userauths",
            localField: "EID",
            foreignField: "EID",
            as: "userauth",
          },
        },
        {
          $project: {
            GigID: 1,
            BidID: 1,
            description: 1,
            "userauth.fullName": 1,
            "userauth.EID": 1,
          },
        },
      ]);
      total = await BidModel.countDocuments({ GigID: GigID, EID: EID });
      (bid as any).score = data[i + 1];
      modifiedData.push(bid);
    }

    const result = {
      data: modifiedData,
      total: total,
    };

    socket.emit("result", result);
  }

  async function listenToQueue() {
    while (true) {
      try {
        const job = await client2.rPop("resultQueue");

        if (job) {
          await processJob(job);
        } else {
          // console.log("No job in the queue. Waiting for new jobs...");
          await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
        }
      } catch (error) {
        console.error("Error while processing job:", error);
      }
    }
  }

  listenToQueue();

  const myJobQueue = new Queue("resultQueue", "redis://127.0.0.1:6379");

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
            page: page,
            GigID: GigID,
          })
        );

        myJobQueue.add(inputData);

        multi.exec();
        socket.emit("Processing the request submitted");
      } else {
        socket.emit("result", "bad request");
      }
      });

          // socket.on(
          //   "sendMessage",
          //   async ({ MsgID, SenderID, ReceiverID, Content }) => {
          //           const message = await MessageModel.create({
          //             Timestamp: Date.now(),
          //             MsgID,
          //             SenderID,
          //             ReceiverID,
          //             Content,
          //             Status: MessageStatus.Sent,
          //           });
            
          //           const receiverSocket = userSockets.get(ReceiverID);
          //           if (receiverSocket) {
          //             io.to(receiverSocket).emit("receiveMessage", message);
          //             await MessageModel.findByIdAndUpdate(message._id, {
          //               Status: MessageStatus.Delivered,
          //             });
          //           }
          //           socket.emit("receiveMessage", message);
          //         }
          // );
    

          // socket.on("getChatHistory", async ({ user1Id, user2Id }) => {
          //   const chatHistory = await MessageModel.find({
          //     $or: [
          //       { SenderID: user1Id, ReceiverID: user2Id },
          //       { SenderID: user2Id, ReceiverID: user1Id },
          //     ],
          //   }).sort({ Timestamp: 1 });
          //   socket.emit("chatHistory", "hi");
          // });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      delete userSockets[socket.id];
    });
  });

  io.on("error", () => {
    console.log("failed to connect ");
  });

  const subscriber = createClient({
    url: "redis://localhost:6379",
  });

  subscriber.subscribe("resultQueue", () => {
    console.log("Subscribed to resultQueue");
  });

  subscriber.on("message", (channel, message) => {
    if (channel === "resultQueue") {
      console.log("Message received from resultQueue:", message);

      try {
        const data = JSON.parse(message); // Assuming the message is a JSON string
        console.log(data);
      } catch (error) {
        console.error("Error processing result:", error);
      }
    }
  });

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
});
