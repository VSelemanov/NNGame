import { IBaseFlds, IMapZone } from "../../../interfaces";
import { Document } from "mongoose";
import { ITeamsInRoom, ITeamResponsePart1 } from "../../Team/interfaces";
import { mapZones, teams } from "../../../constants";
import { IQuestion } from "../../Question/interfaces";

export interface IRoomBase {
  // isStarted: boolean;
  isActive: boolean;
  theme: string | null;
  gameStatus: IGameStatus;
}

export interface IGameMap {
  [mapZones.moscow]: IMapZone;
  [mapZones.moscowroad]: IMapZone;
  [mapZones.kuznec]: IMapZone;
  [mapZones.lenin]: IMapZone;
  [mapZones.miza]: IMapZone;
  [mapZones.pecheri]: IMapZone;
  [mapZones.scherbinki]: IMapZone;
  [mapZones.sormovo]: IMapZone;
  [mapZones.sort]: IMapZone;
  [mapZones.sport]: IMapZone;
  [mapZones.varya]: IMapZone;
  [mapZones.yarmarka]: IMapZone;
  [mapZones.avtoz]: IMapZone;
  [mapZones.karpovka]: IMapZone;
  [mapZones.kremlin]: IMapZone;
}

export interface IGamePart1 {
  currentStep: number | null;
  steps: IGamePart1Step[];
}

export interface IGamePart1Step {
  question: IQuestion;
  responses: {
    [teams.team1]: ITeamResponsePart1;
    [teams.team2]: ITeamResponsePart1;
    [teams.team3]: ITeamResponsePart1;
  };
  allowZones: {
    [teams.team1]: number | null;
    [teams.team2]: number | null;
    [teams.team3]: number | null;
  };
  isStarted: boolean;
}

export interface IGamePart2Step {
  question: IQuestion;
}

export interface IGamePart2 {
  teamQueue: teams[];
  steps: IGamePart2Step[];
}

export interface IGameStatus {
  teams: ITeamsInRoom;
  gameMap: IGameMap;
  currentPart: number;
  part1: IGamePart1;
  part2: IGamePart2;
  isStarted: boolean;
}

export interface IRoomCreateRequest {
  theme: string | null;
  [teams.team1]: string;
  [teams.team2]: string;
  [teams.team3]: string;
}

export interface IRoom extends IRoomBase, Document {}
