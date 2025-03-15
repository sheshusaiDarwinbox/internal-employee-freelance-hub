import dotenv from "dotenv";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { NextFunction, Request, Response } from "express";
import { createApp } from "./app";
import connect, { client } from "./database/connection";
import { setAdmin } from "./utils/adminSetup.util";
import { initializeCounters } from "./utils/counterManager.util";
import { Gig } from "./models/gig.model";
import { BidModel } from "./models/bid.model";
import { GigSchema } from "./types/gig.types";
import { User } from "./models/userAuth.model";
import { establishSocketConnection } from "./utils/socket.util";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
export const user = process.env.NODEJS_GMAIL_APP_USER;
export const pass = process.env.NODEJS_GMAIL_APP_PASSWORD;
export const userSockets: any = {};
export const config = {
  service: "gmail",
  auth: {
    user: user,
    pass: pass,
  },
};

connect().then(() => {
  const { app, sessionMiddleware, sessionStore } = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST"],
    },
  });
  establishSocketConnection(io, sessionMiddleware);
  // io.use((socket, next) => {
  //   sessionMiddleware(
  //     socket.request as Request,
  //     {} as Response,
  //     next as NextFunction
  //   );
  // });

  // io.use((socket, next) => {
  //   console.log(socket.request.session);
  //   if (
  //     socket.request.session &&
  //     socket.request.session.passport &&
  //     socket.request.session.passport.user
  //   ) {
  //     const findUser = User.findOne({
  //       EID: socket.request.session.passport.user.EID,
  //     });
  //     if (!findUser) return next(new Error("User not found"));
  //     socket.request.user = socket.request.session.passport?.user;
  //     next();
  //   } else return next(new Error("Authentication error"));
  // });

  // async function processJob(job: string) {
  //   console.log("Processing job:", job);

  //   const data = job.split(" ");
  //   if (data.length <= 1) return;
  //   const socket = userSockets[data[0]];
  //   const GigID = data[1];
  //   const page = data[2];
  //   delete data[0];
  //   delete data[1];
  //   delete data[2];

  //   const modifiedData = [];
  //   for (let i = 3; i < data.length - 1; i += 2) {
  //     const EID = "EMP" + data[i].padStart(6, "0");
  //     const [bid] = await BidModel.aggregate([
  //       { $match: { GigID: GigID, EID: EID } },
  //       {
  //         $lookup: {
  //           from: "userauths",
  //           localField: "EID",
  //           foreignField: "EID",
  //           as: "userauth",
  //         },
  //       },
  //       {
  //         $project: {
  //           GigID: 1,
  //           BidID: 1,
  //           description: 1,
  //           "userauth.fullName": 1,
  //           "userauth.EID": 1,
  //         },
  //       },
  //     ]);
  //     (bid as any).score = data[i + 1];
  //     modifiedData.push(bid);
  //   }

  //   const result = {
  //     data: modifiedData,
  //     total: modifiedData.length,
  //   };

  //   socket.emit("result", result);
  // }

  // async function listenToQueue() {
  //   while (true) {
  //     try {
  //       const job = await client.rPop("resultQueue");

  //       if (job) {
  //         await processJob(job);
  //       } else {
  //         await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
  //       }
  //     } catch (error) {
  //       console.error("Error while processing job:", error);
  //     }
  //   }
  // }

  // listenToQueue();

  // const multi = client.multi();
  // io.on("connection", async (socket) => {
  //   console.log("User connected");

  //   socket.on("user_input", async (inputData) => {
  //     console.log(socket.request.sessionID);

  //     console.log("Received input:", inputData);

  //     userSockets[socket.id] = socket;

  //     const { GigID, page = 1 } = inputData;
  //     const gig: GigSchema | null = await Gig.findOne({ GigID: GigID });
  //     const bids = await BidModel.find({ GigID: GigID }).select("EID -_id");

  //     if (gig && bids) {
  //       multi.rPush(
  //         "inputQueue",
  //         JSON.stringify({
  //           gigSkills: gig.skills,
  //           bids: bids,
  //           socketId: socket.id,
  //           page: page,
  //           GigID: GigID,
  //         })
  //       );

  //       multi.exec();
  //       socket.emit("Processing the request submitted");
  //     } else {
  //       socket.emit("result", "bad request");
  //     }
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("User disconnected");
  //     delete userSockets[socket.id];
  //   });
  // });

  // io.on("error", () => {
  //   console.log("failed to connect ");
  // });

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
