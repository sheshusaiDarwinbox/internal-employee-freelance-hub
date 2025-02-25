import { Router } from "express";
import passport from "passport";

export const loginControlRouter = Router();

loginControlRouter.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    res.send(req.user);
  }
);

loginControlRouter.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});
loginControlRouter.get("/status", (req, res) => {
  res.send(req.user);
});
