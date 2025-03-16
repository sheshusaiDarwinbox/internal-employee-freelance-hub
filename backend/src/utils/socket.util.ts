import { RequestHandler, Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { User } from "../models/userAuth.model";
import { userSockets } from "../server";
import { BidModel } from "../models/bid.model";
import { client } from "../database/connection";
import { registerEvents } from "./eventHandler.util";

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
    (bid as any).score = data[i + 1];
    modifiedData.push(bid);
  }

  const result = {
    data: modifiedData,
    total: modifiedData.length,
  };

  socket.emit("result", result);
}

async function listenToQueue() {
  while (true) {
    try {
      const job = await client.rPop("resultQueue");

      if (job) {
        await processJob(job);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error while processing job:", error);
    }
  }
}

export const establishSocketConnection = async (
  io: Server,
  sessionMiddleware: RequestHandler
) => {
  const multi = client.multi();
  io.use((socket, next) => {
    sessionMiddleware(
      socket.request as Request,
      {} as Response,
      next as NextFunction
    );
  });

  io.use((socket, next) => {
    if (
      socket.request.session &&
      socket.request.session.passport &&
      socket.request.session.passport.user
    ) {
      const findUser = User.findOne({
        EID: socket.request.session.passport.user.EID,
      });
      if (!findUser) return next(new Error("User not found"));
      socket.request.user = socket.request.session.passport?.user;
      next();
    } else return next(new Error("Authentication error"));
  });

  listenToQueue();

  io.on("connection", async (socket) => {
    console.log("User connected");

    userSockets[socket.id] = socket;
    registerEvents(socket);
    socket.on("disconnect", () => {
      console.log("User disconnected");
      delete userSockets[socket.id];
    });
  });

  io.on("error", () => {
    console.log("failed to connect ");
  });
};
