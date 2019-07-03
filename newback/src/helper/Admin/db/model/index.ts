import { Schema, Model, model, Document } from "mongoose";
import { baseFlds, baseSchemaOptions } from "../../../../constants";
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
  baseSchemaOptions
);
export default model<IAdmin>("Admin", AdminSchema);
