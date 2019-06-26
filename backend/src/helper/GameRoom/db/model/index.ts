import { Schema, Model, model, Document } from "mongoose";
import { baseFlds } from "../../../../constants";
import { IGameRoom } from "../../interfaces";

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
      teams: {
        type: Array,
        default: []
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export default model<IGameRoom>("GameRoom", GameRoomSchema);