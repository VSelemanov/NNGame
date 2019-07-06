import { Schema } from "mongoose";
import { baseFlds } from "../../../../constants";

const mapZone = new Schema({
  ...baseFlds,
  nearby: {
    type: Array,
    required: true
  },
  isStartBase: {
    type: Boolean,
    required: true,
    default: false
  },
  team: {
    type: String,
    // required: true,
    default: null
  }
});

export default mapZone;
