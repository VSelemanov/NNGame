import { IBaseFlds, IMapZone } from "../../../interfaces";
import { Document } from "mongoose";
import { IQuestion } from "../../Question/interfaces";
import { ITeam } from "../../Team/interfaces";

export interface ITeamResponsePart1 {
  teamId: string;
  response: number;
  timer: number;
  allowZones: number;
}

export interface IStepPart1 {
  question: IQuestion;
  isTimerStarted: boolean;
  results: ITeamResponsePart1[];
}

export interface IGameStatus {
  isActive: boolean;
  isStarted: boolean;
  teams: {
    team1: ITeam | null;
    team2: ITeam | null;
    team3: ITeam | null;
  };
  part1: IStepPart1[];
  part2: any[];
  gameMap: {
    [key: string]: IMapZone;
  };
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
