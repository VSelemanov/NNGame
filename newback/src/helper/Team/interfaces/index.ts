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
  isLoggedIn: boolean;
}

export interface ITeamsInRoom {
  [teams.team1]: ITeamInRoom | null;
  [teams.team2]: ITeamInRoom | null;
  [teams.team3]: ITeamInRoom | null;
}

export interface ITeamResponsePart1 {
  timer: number;
  response: number;
  allowZones: number;
}

export interface ITeamCredentials {
  _id: string;
  teamKey: string;
  isAdmin: false;
  iat: number;
}
