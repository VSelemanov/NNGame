import { IBaseFlds } from "../../../interfaces";
import { Document } from "mongoose";

export interface IAnswer {
  title: string;
  isRight: boolean;
}

export interface IQuestionBase {
  title: string;
  count: number;
  isNumeric: boolean;
  numericAnswer?: number;
  answers?: IAnswer[];
}

export interface IQuestion extends IQuestionBase, Document {}
