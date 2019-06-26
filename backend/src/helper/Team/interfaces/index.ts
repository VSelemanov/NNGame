import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";

export interface ITeamBase {
  name: string;
}

export interface ITeam extends ITeamBase, Document {}
