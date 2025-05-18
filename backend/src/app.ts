import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./strategies/local.strategy";
import { indexRouter } from "./routes/index.router";
import cors from "cors";

export const createSessionStore = () => {
  return MongoStore.create({
    client: mongoose.connection.getClient(),
    collectionName: "sessions",
  });
};

export const createApp = () => {
  const app = express();
  const sessionMiddleware = session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: createSessionStore(),
  });
  app.use(
    cors({
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  );
  app.use(express.static("./public"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/api", indexRouter);

  return { app, sessionMiddleware };
};
