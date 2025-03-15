// express-session.d.ts
import { IncomingMessage } from "http";
import { Session } from "express-session";

declare module "http" {
  interface IncomingMessage {
    session?: {
      passport?: {
        user?: any; // You can replace 'any' with your user type
      };
    };
    user: any;
    sessionID: string;
  }
}
