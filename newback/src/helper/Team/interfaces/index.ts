import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";
import { teams } from "../../../constants";

export interface ITeamBase {
  name: string;
  zones: number;
}

export interface ITeam extends ITeamBase, Document {}

export interface ITeamInRoom extends ITeam {
  inviteCode: number;
}

export interface ITeamsInRoom {
  [teams.team1]: ITeamInRoom;
  [teams.team2]: ITeamInRoom;
  [teams.team3]: ITeamInRoom;
}

export interface ITeamResponsePart1 {
  timer: number;
  response: number;
  allowZones: number;
}
