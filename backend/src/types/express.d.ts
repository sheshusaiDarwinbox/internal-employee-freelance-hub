import type { UserRole } from "../models/userAuth.model";

declare global {
  namespace Express {
    interface User {
      EID: string;
      role: UserRole;
    }
  }
}
