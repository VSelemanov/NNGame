import { Schema, Model, model, Document } from "mongoose";
import { baseFlds, GameMap } from "../../../../constants";
import { IGameRoom } from "../../interfaces";
import { QuestionSchema } from "../../../Question/db/model";
import { TeamSchema } from "../../../Team/db/model";
import uuid from "uuid";
import { strict, string } from "joi";

const MapZoneSchema = new Schema({
  nearby: {
    type: Array,
    required: true,
    default: []
  },
  isStartBase: {
    type: Boolean,
    required: true,
    default: false
  },
  teamId: {
    type: String,
    required: true,
    default: ""
  }
});

const Part1StepSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  question: QuestionSchema,
  isTimerStarted: {
    type: Boolean,
    required: true,
    default: false
  },
  teamQueue: {
    type: Array,
    default: []
  },
  results: [
    {
      _id: {
        type: String,
        default: uuid.v4
      },
      teamId: {
        type: String,
        required: true
      },
      response: {
        type: Number,
        required: true
      },
      timer: {
        type: Number
        // required: true
      },
      allowZones: {
        type: Number,
        // required: true,
        default: 0
      }
    }
  ]
});

const Part2StepSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v4
  },
  isTimerStarted: {
    type: Boolean,
    required: true,
    default: false
  },
  attackingZone: {
    type: String,
    required: true
  },
  deffenderZone: {
    type: String,
    required: true
  },
  attacking: TeamSchema,
  deffender: TeamSchema,
  question: QuestionSchema,
  numericQuestion: QuestionSchema,
  attackingResponse: {
    type: String
    // required: true
  },
  deffenderResponse: {
    type: String
    // required: true
  },
  attackingNumericResponse: {
    timer: {
      type: Number
      // required: true
    },
    reponse: {
      type: Number
      // required: true
    }
  },
  deffenderNumericResponse: {
    timer: {
      type: Number
      // required: true
    },
    reponse: {
      type: Number
      // required: true
    }
  }
});

const GameRoomSchema = new Schema(
  {
    ...baseFlds,
    theme: {
      type: String
    },
    adminId: {
      type: String,
      required: true
    },
    roomNumber: {
      type: Number,
      required: true,
      unique: true
    },
    gameStatus: {
      isActive: {
        type: Boolean,
        default: true
      },
      isStarted: {
        type: Boolean,
        default: false
      },
      gameMap: {
        type: Object,
        required: true,
        ["test"]: {},
        default: GameMap
      },
      currentPart: {
        type: Number,
        default: 1,
        required: true
      },
      part1: [Part1StepSchema],
      part2: {
        steps: [Part2StepSchema],
        teamQueue: {
          type: Array,
          required: true
        }
      },
      teams: {
        team1: TeamSchema,
        team2: TeamSchema,
        team3: TeamSchema
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export default model<IGameRoom>("GameRoom", GameRoomSchema);
