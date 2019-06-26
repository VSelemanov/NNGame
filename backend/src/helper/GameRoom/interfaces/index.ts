import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";

interface IGameStatus {
  isActive: boolean;
  isStarted: boolean;
  teams: string[];
  part1: any[];
  part2: any[];
  map: any[];
}

export interface IGameRoomBase {
  theme: string | null;
  adminId: string;
  roomNumber: number;
  gameStatus: IGameStatus;
}

export interface IGameRoom extends IGameRoomBase, Document {}

export interface IGameRoomGetParams {
  isActive: string | undefined;
}
