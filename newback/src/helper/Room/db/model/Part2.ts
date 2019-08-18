import { Schema } from "mongoose";
import { baseFlds } from "../../../../constants";

const Part2 = new Schema({
  ...baseFlds,
  teamQueue: {
    type: Array,
    required: true
  },
  steps: {
    type: Array,
    required: true
  }
});

export default Part2;
