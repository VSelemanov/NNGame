import { Schema } from "mongoose";
import { baseFlds, teams } from "../../../../constants";
import { QuestionSchema } from "../../../Question/db/model/index";

const Part3TeamResponse = new Schema({
  ...baseFlds,
  response: {
    type: Number,
    default: null
  },
  timer: {
    type: Number,
    default: null
  },
  result: {
    type: Number,
    default: null
  }
});

const Part1ResponsesSchema = new Schema({
  ...baseFlds,
  [teams.team1]: Part3TeamResponse,
  [teams.team2]: Part3TeamResponse,
  [teams.team3]: Part3TeamResponse
});

const Part3 = new Schema({
  ...baseFlds,
  teams: {
    type: Array
  },
  question: QuestionSchema,
  responses: Part1ResponsesSchema,
  isStarted: {
    type: Boolean,
    default: false
  }
});

export default Part3;
