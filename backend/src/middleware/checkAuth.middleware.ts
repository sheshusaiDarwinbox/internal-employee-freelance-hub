import { UserRole } from "../types/userAuth.types";
import { HttpStatusCodes } from "../utils/httpsStatusCodes.util";

export const checkAuth = (role: UserRole | undefined) => {
  return (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    if (role && req.user.role !== role) {
      return res
        .status(HttpStatusCodes.FORBIDDEN)
        .json({ message: "Forbidden" });
    }
    next();
  };
};
