import { Model } from "mongoose";
import { PositionTypeEnum } from "../models/position.model";

export type PositionType = keyof typeof PositionTypeEnum;
export interface Position {
  PID: string;
  title: string;
  description: string;
  type: PositionType;
  salary: number;
  DID: string;
}

export type PositonModelType = Model<Position>;
