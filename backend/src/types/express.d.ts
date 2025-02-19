import type { UserRole } from "../models/userAuth";

declare global {
  namespace Express {
    interface User {
      EID: string;
      role: UserRole;
    }
  }
}
