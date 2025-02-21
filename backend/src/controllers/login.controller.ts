import { Router } from "express";
import passport from "passport";

export const loginControlRouter = Router();

loginControlRouter.post("", passport.authenticate("local"), (req, res) => {
  res.send(req.user);
});

loginControlRouter.get("/status", (req, res) => {
  res.send(req.user);
});
