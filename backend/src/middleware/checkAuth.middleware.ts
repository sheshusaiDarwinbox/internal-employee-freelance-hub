import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/userAuth.model";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";

export const checkAuth = (roles: Array<keyof typeof UserRole> | undefined) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    if (roles === undefined || roles?.length === 0) return next();
    for (let role of roles) {
      if (req.user?.role !== role)
        res.status(HttpStatusCodes.FORBIDDEN).json({ message: "Forbidden" });
    }
    next();
  };
};
