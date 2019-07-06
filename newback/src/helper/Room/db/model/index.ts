import { Schema, Model, model, Document } from "mongoose";
import { baseFlds, baseSchemaOptions } from "../../../../constants";
import { IRoom } from "../../interfaces";

import gameStatusSchema from "./gameStatus";

const RoomSchema = new Schema(
  {
    ...baseFlds,
    isStarted: {
      type: Boolean,
      required: true,
      default: false
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    theme: {
      type: String,
      default: null
      // required: true
    },
    gameStatus: gameStatusSchema
  },
  baseSchemaOptions
);
export default model<IRoom>("Room", RoomSchema);
