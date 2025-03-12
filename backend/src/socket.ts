import { Server } from "socket.io";
import { MessageModel, MessageStatus } from "./models/messages.model";
import { User } from "./models/userAuth.model";

const users = new Map(); // Store connected users

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Handle user online status
    socket.on("userOnline", async (userID) => {
      users.set(userID, socket.id);
      await User.findByIdAndUpdate(userID, { status: "online" });
      io.emit("updateUserStatus", { userID, status: "online" });
    });

    // Handle messaging
    socket.on(
      "sendMessage",
      async ({ MsgID, SenderID, ReceiverID, Content }) => {
        const message = await MessageModel.create({
          MsgID,
          SenderID,
          ReceiverID,
          Content,
          Status: MessageStatus.Sent,
        });

        const receiverSocket = users.get(ReceiverID);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", message);
          await MessageModel.findByIdAndUpdate(message._id, {
            Status: MessageStatus.Delivered,
          });
        }
      }
    );

    // Handle user disconnect
    socket.on("disconnect", async () => {
      const userID = [...users.entries()].find(([_, id]) => id === socket.id)?.[0];
      if (userID) {
        users.delete(userID);
        await User.findByIdAndUpdate(userID, { status: "offline" });
        io.emit("updateUserStatus", { userID, status: "offline" });
      }
    });
  });

  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
  return io;
};