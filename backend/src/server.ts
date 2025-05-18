import dotenv from "dotenv";
import path from "path";
import http from "http";
import { createApp } from "./app";
import { Express } from "express";
import { setAdmin } from "./utils/adminSetup.util";
import connect, { client } from "./database/connection";
import { initializeCounters } from "./utils/counterManager.util";
import { establishSocketConnection } from "./utils/socket.util";
import { Server as SocketServer, Socket } from "socket.io";


dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const user = process.env.NODEJS_GMAIL_APP_USER;
export const pass = process.env.NODEJS_GMAIL_APP_PASSWORD;

export const userSockets: { [key: string]: Socket} = {};
export const config = {
  service: "gmail",
  auth: {
    user: user,
    pass: pass,
  },
};

let app: Express;
let server: http.Server;



connect().then(() => {
  const { app: createdApp, sessionMiddleware } = createApp();
  app = createdApp;
  server = http.createServer(app);
  const io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST"],
    },
  });

  establishSocketConnection(io, sessionMiddleware);


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
    initializeCounters();
    setAdmin();
  });
});



export { app, server };
