import { Schema, Model, model, Document } from "mongoose";
import { baseFlds } from "../../../../constants";
import { ITeam } from "../../interfaces";

export const TeamSchema = new Schema(
  {
    ...baseFlds,
    name: {
      type: String,
      required: true,
      unique: true
    },
    zones: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<ITeam>("Team", TeamSchema);
