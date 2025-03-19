// express-session.d.ts

import { UserAuth } from "./userAuth.types";

declare module "http" {
  interface IncomingMessage {
    session?: {
      passport?: {
        user?: UserAuth;
      };
    };
    user: UserAuth;
    sessionID: string;
    EID: string;
  }
}

declare module "express-session" {
  interface SessionData {
    passport?: {
      user?: UserAuth;
    };
  }
}
