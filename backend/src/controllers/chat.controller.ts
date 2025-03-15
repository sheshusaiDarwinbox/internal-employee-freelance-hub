import { Request, Response, Router } from "express";
import { MessageModel } from "../models/messages.model";
import { sessionHandler } from "../utils/session.util"; // Importing sessionHandler
import { checkAuth } from "../middleware/checkAuth.middleware"; // Importing checkAuth middleware
import { UserRole } from "../models/userAuth.model"; 
import { Server } from "socket.io"; // Importing Server for socket integration
import { User } from "../models/userAuth.model";

// Fetch chat history between two users
export const getChatHistory = sessionHandler(
  async (req: Request, res: Response) => {
    const { user1Id, user2Id } = req.params;
    try {
      const chatHistory = await MessageModel.find({
        $or: [
          { SenderID: user1Id, ReceiverID: user2Id },
          { SenderID: user2Id, ReceiverID: user1Id },
        ],
      })
        .sort({ Timestamp: 1 })
        .populate({
          path: "SenderID",
          select: "fullName status",
        });

      // Get the latest message for each chat
      let latestMessage = null;
      if (chatHistory.length > 0) {
        latestMessage = chatHistory[chatHistory.length - 1];
      }

      res.status(200).json({ chatHistory, latestMessage });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Error fetching chat history", error });
    }
  }
);

export const sendMessage = sessionHandler(
  async (req: Request, res: Response) => {
    const { MsgID, ReceiverID, Content } = req.body;
    const SenderID = req.user?.EID; // Set SenderID from the user's EID
    console.log("sendMessage called"); // Add this line
    console.log("Request body:", req.body); // Add this line
    try {
      const message = await MessageModel.create({
        MsgID,
        SenderID,
        ReceiverID,
        Content,
        Timestamp: Date.now(),
        Status: "Sent",
      });
      // Emit the message through socket to the intended receiver
      const receiverSocket = req.app.get("users").get(ReceiverID);
      if (receiverSocket) {
        req.app.get("io").to(receiverSocket).emit("receiveMessage", message);
      }

      // Update last messages
      await User.findByIdAndUpdate(SenderID, {
        $set: {
          [`lastMessages.${ReceiverID}`]: {
            message: Content,
            timestamp: Date.now(),
            unread: false,
          },
        },
      });

      await User.findByIdAndUpdate(ReceiverID, {
        $set: {
          [`lastMessages.${SenderID}`]: {
            message: Content,
            timestamp: Date.now(),
            unread: true,
          },
        },
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error sending message", error });
    }
  }
);

// Define the router for chat
export const ChatControlRouter = Router();

// Route for getting chat history
ChatControlRouter.get("/chats/:user1Id/:user2Id", checkAuth([]), getChatHistory);

// Route for sending a message
ChatControlRouter.post("/send", checkAuth([]), sendMessage);
