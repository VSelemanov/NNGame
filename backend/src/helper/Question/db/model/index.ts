import { Schema, Model, model, Document } from "mongoose";
import { baseFlds } from "../../../../constants";
import { IQuestion } from "../../interfaces";
import uuid = require("uuid");

export const QuestionSchema = new Schema(
  {
    ...baseFlds,
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true,
      default: 0
    },
    isNumeric: {
      type: Boolean,
      required: true
    },
    numericAnswer: {
      type: Number
    },
    answers: [
      {
        // _id: {
        //   type: String,
        //   default: uuid.v4,
        //   unique: true,
        //   required: true
        // },
        title: {
          type: String,
          required: true
        },
        isRight: {
          type: Boolean,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);
export default model<IQuestion>("Question", QuestionSchema);
