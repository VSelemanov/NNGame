import { Schema } from "mongoose";
import { baseFlds, teams } from "../../../../constants";
import { QuestionSchema } from "../../../Question/db/model/index";

const Part1TeamResponse = new Schema({
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
  [teams.team1]: Part1TeamResponse,
  [teams.team2]: Part1TeamResponse,
  [teams.team3]: Part1TeamResponse
});

const Part1AllowZonesSchema = new Schema({
  ...baseFlds,
  [teams.team1]: {
    type: Number,
    default: null
  },
  [teams.team2]: {
    type: Number,
    default: null
  },
  [teams.team3]: {
    type: Number,
    default: null
  }
});

const Part1 = new Schema({
  ...baseFlds,
  currentStep: {
    type: Number,
    default: null
  },
  steps: [
    {
      ...baseFlds,
      question: QuestionSchema,
      responses: Part1ResponsesSchema,
      allowZones: Part1AllowZonesSchema,
      isStarted: {
        type: Boolean,
        default: false
      }
    }
  ]
});

export default Part1;
