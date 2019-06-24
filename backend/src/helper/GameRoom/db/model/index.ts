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
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export default model<IGameRoom>("GameRoom", GameRoomSchema);
