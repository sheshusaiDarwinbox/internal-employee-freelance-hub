import { Router } from "express";
import passport from "passport";

export const loginControlRouter = Router();

loginControlRouter.post(
  "/login",
  passport.authenticate("local"),
  (req, res) => {
    res.json({ 
      message: "Login successful",
      user: req.user 
    });
  }
);

loginControlRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});
loginControlRouter.get("/status", (req, res) => {
  res.json({
    message: "User status retrieved successfully",
    user: req.user,
  });
});
