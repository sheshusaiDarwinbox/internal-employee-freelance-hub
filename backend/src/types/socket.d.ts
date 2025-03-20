import { Socket } from "socket.io";
import { UserAuth } from "./userAuth.types";

declare module "socket.io" {
  interface Socket {
    request: Express.Request & {
      session: Express.Session & {
        passport?: {
          user?: UserAuth;
        };
      };
      user?: UserAuth;
    };
  }
}

export {};
