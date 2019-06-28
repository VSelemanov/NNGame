import { IBaseFlds, IMapZone } from "../../../interfaces";
import { Document } from "mongoose";
import { IQuestion } from "../../Question/interfaces";
import { ITeam } from "../../Team/interfaces";

export interface ITeamResponse {
  teamId: string;
  response: number;
  timer?: number;
  allowZones?: number;
}

export interface IStepPart1 {
  question: IQuestion;
  isTimerStarted: boolean;
  results: ITeamResponse[];
  teamQueue: any[];
}
export interface IStepPart2 {
  attackingZone: string;
  deffenderZone: string;
  attacking: ITeam;
  deffender: ITeam;
  question: IQuestion;
  numericQuestion?: IQuestion;
  attackingResponse?: string;
  deffenderResponse?: string;
  attackingNumericResponse?: {
    response: number;
    timer: number;
  };
  deffenderNumericResponse?: {
    response: number;
    timer: number;
  };
}

export interface IMap {
  [key: string]: IMapZone;
}

export interface IPart2 {
  steps: IStepPart2[];
  teamQueue: ITeam[];
}

export interface IGameStatus {
  isActive: boolean;
  isStarted: boolean;
  teams: {
    team1: ITeam & { zones: number } | null;
    team2: ITeam & { zones: number } | null;
    team3: ITeam & { zones: number } | null;
  };
  currentPart: number;
  part1: IStepPart1[];
  part2: IPart2;
  gameMap: IMap;
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
