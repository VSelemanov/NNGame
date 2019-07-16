import { Schema, Model, model, Document } from "mongoose";
import { baseFlds } from "../../../../constants";
import { IAdmin } from "../../interfaces";

const AdminSchema = new Schema(
  {
    ...baseFlds,
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export default model<IAdmin>("Admin", AdminSchema);
