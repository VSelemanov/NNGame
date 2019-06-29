import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";

export interface ITeamBase {
  name: string;
  zones: number;
}

export interface ITeam extends ITeamBase, Document {}
