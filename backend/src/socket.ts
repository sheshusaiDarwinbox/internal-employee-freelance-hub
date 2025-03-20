import { Server } from "socket.io";
import { MessageModel, MessageStatus } from "./models/messages.model";
import { User } from "./models/userAuth.model";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserAuth } from "./types/userAuth.types";

const users = new Map<string, string>(); // Store connected users (userID, socket.id)

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Handle user online status
    socket.on("userOnline", async (userID) => {
      users.set(userID, socket.id); // Store user EID with socket.id
      
      try {
        console.log("userOnline event received:", userID);
        const user = await User.findOne({EID: userID}) as UserAuth;
        if(user){
            user.status = "Online";
            await User.updateOne({EID: userID},{status: "Online"});
            io.emit("updateUserStatus", { userID, status: "Online" });
        }
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });
    // Handle messaging
    socket.on(
      "sendMessage",
      async ({ MsgID, SenderID, ReceiverID, Content }) => {
        console.log("Received sendMessage event:", { MsgID, SenderID, ReceiverID, Content });
        try {
          const message = await MessageModel.create({
            Timestamp: Date.now(),
            MsgID,
            SenderID,
            ReceiverID,
            Content,
            Status: MessageStatus.Sent,
          });

          const receiverSocketId = users.get(ReceiverID);
          if (receiverSocketId) {
            const deliveredMessage = await MessageModel.findOneAndUpdate(
              { MsgID: MsgID },
              { Status: MessageStatus.Delivered },
              { new: true }
            );
            io.to(receiverSocketId).emit("receiveMessage", deliveredMessage);
            io.to(receiverSocketId).emit("updateMessageStatus", { MsgID: MsgID, Status: MessageStatus.Delivered });
          }
          socket.emit("receiveMessage", message);
          socket.emit("updateMessageStatus", { MsgID: MsgID, Status: MessageStatus.Sent });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });

    //Handle recive message.
    socket.on("receiveMessage", async (messageID) => {
      try {
        await MessageModel.findByIdAndUpdate(messageID, {
          Status: MessageStatus.Delivered,
        });
      } catch (error) {
        console.error("Error updating message status:", error);
      }
    });
    socket.on("messageRead", async (MsgID) => {
      try {
        const readMessage = await MessageModel.findOneAndUpdate(
          { MsgID: MsgID },
          { Status: MessageStatus.Read },
          { new: true }
        );
        if(readMessage){
            io.emit("updateMessageStatus", { MsgID: MsgID, Status: MessageStatus.Read });
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });


    // Handle chat history retrieval
    socket.on("getChatHistory", async ({ user1Id, user2Id }) => {
      console.log("Received getChatHistory event:", { user1Id, user2Id });
      try {
        const chatHistory = await MessageModel.find({
          $or: [
            { SenderID: user1Id, ReceiverID: user2Id },
            { SenderID: user2Id, ReceiverID: user1Id },
          ],
        })
          .sort({ Timestamp: 1 })
          .populate("SenderID", "status");

        // Mark messages as read
        //   await MessageModel.updateMany(
        //     { SenderID: user2Id, ReceiverID: user1Id, read: false },
        //     { $set: { read: true } }
        //   );

        // // Update the last message unread to false.
        //   await User.findByIdAndUpdate(user1Id, {
        //     $set: {
        //       [`lastMessages.${user2Id}.unread`]: false,
        //     },
        //   });
        let latestMessage = null;
        if (chatHistory.length > 0) {
          latestMessage = chatHistory[chatHistory.length - 1];
        }

        socket.emit("chatHistory", { chatHistory, latestMessage });
      } catch (error) {
        console.error("Error retrieving chat history:", error);
      }
    });

     // Handle user disconnect
     socket.on("disconnect", async () => {
      try {
        let userID: string | undefined;
        for (const [key, value] of users.entries()) {
          if (value === socket.id) {
            userID = key;
            break;
          }
        }
        if (userID) {
          users.delete(userID);
          const user = await User.findOne({ EID: userID }) as UserAuth;
          if (user) {
            user.status = "Offline";
            await User.updateOne({EID: userID},{status: "Offline"});
            io.emit("updateUserStatus", { userID, status: "Offline" });
          }
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });

    // Handle user offline.
    socket.on("userOffline", async (userID) => {
      try {
        console.log("userOffline event received:", userID);
        const user = await User.findOne({ EID: userID }) as UserAuth;
        if (user) {
          user.status = "Offline";
          await User.updateOne({EID: userID},{status: "Offline"});
          io.emit("updateUserStatus", { userID, status: "Offline" });
        }
      } catch (error) {
        console.error("Error setting user Offline:", error);
      }
    });
  });

  io.on("error", (err) => {
    console.error("Socket.IO error:", err);
  });
  return io;
};