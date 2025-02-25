import { Response } from "express";
import { HttpStatusCodes } from "./httpsStatusCodes.util";

export const error = (err: Error | unknown, res: Response) => {
  if (err instanceof Error) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: err.message });
  } else
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: "Something went wrong" });
};
