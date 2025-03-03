import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./strategies/local.strategy";
import { indexRouter } from "./routes/index.router";
import cors from "cors";
import { parseFile } from "./utils/fileParser.util";

export const createApp = () => {
  const app = express();
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
  app.use(
    session({
      secret: "secret",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60,
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/api", indexRouter);

  app.get("/", (req, res) => {
    res.send(`
    <h2>File Upload With <code>"Node.js"</code></h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Select a file: 
        <input name="file" type="file" />
      </div>
      <input type="submit" value="Upload" />
    </form>

  `);
  });

  app.post("/api/upload", async (req, res) => {
    await parseFile(req)
      .then((data) => {
        res.status(200).json({
          message: "Success",
          data,
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: "An error occurred.",
          error,
        });
      });
  });

  return app;
};
