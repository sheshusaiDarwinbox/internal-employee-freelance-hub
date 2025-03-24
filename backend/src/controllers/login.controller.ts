import { Request, Response, Router } from "express";
import passport from "passport";

export const loginControlRouter = Router();

export const login = (req: Request, res: Response) => {
  res.json({
    message: "Login successful",
    user: req.user,
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
