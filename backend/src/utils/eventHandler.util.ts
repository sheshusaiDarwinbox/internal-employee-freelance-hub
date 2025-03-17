import { RemoteSocket, Server, Socket } from "socket.io";
import { createSessionStore } from "../app";
import { client } from "../database/connection";
import { Gig } from "../models/gig.model";
import { BidModel } from "../models/bid.model";
import { GigSchema } from "../types/gig.types";
import { MessageModel } from "../models/message.model";

export const connectedUsers = new Map();

export const handleEvent = (
  socket: Socket,
  eventName: string,
  callback: (data: any) => void
) => {
  socket.on(eventName, (data) => {
    const sessionID = socket.request.sessionID;

    const sessionStore = createSessionStore();

    sessionStore.get(sessionID, (err, session) => {
      if (err || !session) {
        socket.disconnect();
        return;
      }

      if (session.cookie && session.cookie.expires) {
        const expiryTime = new Date(session.cookie.expires);
        if (expiryTime <= new Date()) {
          socket.disconnect();
        }
      }

      callback(data);
    });
  });
};

export const registerEvents = (socket: Socket, io: Server) => {
  handleEvent(socket, "user_input", async (data: any) => {
    console.log("Received input:", data);

    const multi = client.multi();
    const { GigID, page = 1 } = data;
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

      multi.exec();
    } else {
      socket.emit("result", "bad request");
    }
  });

  handleEvent(socket, "register_user", async () => {
    connectedUsers.set(socket.request.user.EID, socket.id);

    io.emit("users_list", Array.from(connectedUsers.keys()));
  });

  handleEvent(socket, "send_message", async (data: any) => {
    const message = await MessageModel.create({
      SenderID: data.SenderID,
      ReceiverID: data.ReceiverID,
      Content: data.Content,
      Timestamp: Date.now(),
    });

    const receiverSocketId = connectedUsers.get(data.ReceiverID);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", {
        SenderID: data.SenderID,
        Content: data.Content,
        Timestamp: message.Timestamp,
      });
    }

    socket.emit("receive_message", {
      SenderID: data.SenderID,
      Content: data.Content,
      Timestamp: message.Timestamp,
    });
  });
};
