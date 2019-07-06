import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";
import { teams } from "../../../constants";

export interface ITeamBase {
  name: string;
  zones: number;
}

export interface ITeam extends ITeamBase, Document {}

export interface ITeamsInRoom {
  [teams.team1]: ITeam;
  [teams.team2]: ITeam;
  [teams.team3]: ITeam;
}

export interface ITeamResponsePart1 {
  timer: number;
  response: number;
  allowZones: number;
}
