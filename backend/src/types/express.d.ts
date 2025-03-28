import { UserRole } from "../models/userAuth.model";

declare global {
  namespace Express {
    interface User {
      EID: string;
      role: keyof typeof UserRole;
    }
  }
}
