import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";

export interface IAdminBase {
  name: string;
  password: string;
}

export interface IAdmin extends IAdminBase, Document {}
