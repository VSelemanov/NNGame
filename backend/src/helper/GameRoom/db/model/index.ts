import { Schema, Model, model, Document } from "mongoose";
import { baseFlds, GameMap } from "../../../../constants";
import { IGameRoom } from "../../interfaces";
import { QuestionSchema } from "../../../Question/db/model";
import { TeamSchema } from "../../../Team/db/model";
import uuid = require("uuid");

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
      part1: [
        {
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
        }
      ],
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
