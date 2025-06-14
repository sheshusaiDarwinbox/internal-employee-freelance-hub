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
    for (const role of roles) {
      if (req.user?.role === role) return next();
    }

    res.status(HttpStatusCodes.FORBIDDEN).json({
      message: "Forbidden",
    });
  };
};
