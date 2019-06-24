import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";

export interface IGameRoomBase {
  theme: string | null;
  adminId: string;
  teams: string[];
  roomNumber: number;
  gameStatus: any;
}

export interface IGameRoom extends IGameRoomBase, Document {}
