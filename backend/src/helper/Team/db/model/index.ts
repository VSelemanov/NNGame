import { Schema, Model, model, Document } from "mongoose";
import { baseFlds } from "../../../../constants";
import { ITeam } from "../../interfaces";

const TeamSchema = new Schema(
  {
    ...baseFlds,
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export default model<ITeam>("Team", TeamSchema);
