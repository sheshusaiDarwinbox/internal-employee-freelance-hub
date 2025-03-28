import { Request, Response, Router } from "express";
import passport from "passport";
import { User } from "../models/userAuth.model";

export const loginControlRouter = Router();

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ EID: req.user.EID });
  res.json({
    message: "Login successful",
    user: user,
  });
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
};
loginControlRouter.get("/status", (req, res) => {
  res.send(req.user);
});

loginControlRouter.post("/login", passport.authenticate("local"), login);
loginControlRouter.get("/logout", logout);
