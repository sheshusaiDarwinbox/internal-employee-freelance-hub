import { Server } from "socket.io";
import { MessageModel, MessageStatus } from "./models/messages.model";
import { User } from "./models/userAuth.model";

const users = new Map(); // Store connected users

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Handle user online status
    socket.on("userOnline", async (userID) => {
      users.set(userID, socket);
      await User.findByIdAndUpdate(userID, { status: "online" });
      io.emit("updateUserStatus", { userID, status: "online" });
    });

    // Handle messaging
    socket.on(
      "sendMessage",
      async ({ MsgID, SenderID, ReceiverID, Content }) => {
        console.log("Received sendMessage event:", { MsgID, SenderID, ReceiverID, Content });
        const message = await MessageModel.create({
          Timestamp: Date.now(),
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
        socket.emit("receiveMessage", message);
      }
    );

    //Handle recive message.
    socket.on("receiveMessage", async (messageID)=>{
        await MessageModel.findByIdAndUpdate(messageID, {
            Status: MessageStatus.Delivered,
          });
    })

    // Handle chat history retrieval
    // ... your existing code ...

socket.on("getChatHistory", async ({ user1Id, user2Id }) => {
  console.log("Received getChatHistory event:", { user1Id, user2Id }); // Added log
  try {
    const chatHistory = await MessageModel.find({
      $or: [
        { SenderID: user1Id, ReceiverID: user2Id },
        { SenderID: user2Id, ReceiverID: user1Id },
      ],
    }).sort({ Timestamp: 1 });
    console.log("Chat history retrieved:", chatHistory); // Added log
    socket.emit("chatHistory", chatHistory);
  } catch (error) {
    console.error("Error retrieving chat history:", error); // Added log
  }
});

// ... your existing code ...

    // Handle user disconnect
    socket.on("disconnect", async () => {
      const userID = [...users.entries()].find(([_, id]) => id === socket.id)?.[0];
      if (userID) {
        users.delete(userID);
        await User.findByIdAndUpdate(userID, { status: "offline" });
        io.emit("updateUserStatus", { userID, status: "offline" });
      }
    });

    //Handle user offline.
    socket.on("userOffline", async (userID)=>{
        await User.findByIdAndUpdate(userID, {status:"offline"});
        io.emit("updateUserStatus", {userID, status:"offline"});
    })
  });

  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
  return io;
};