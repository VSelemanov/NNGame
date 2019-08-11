import { Schema } from "mongoose";
import teamsInRoom from "../../../Team/db/model/teamsInRoom";
import gameMapSchema from "./gameMap";
import Part1Schema from "./Part1";
import Part2Schema from "./Part2";
import Part3Schema from "./Part3";
import { baseFlds } from "../../../../constants";

const RoomSchema = new Schema({
  ...baseFlds,
  teams: teamsInRoom,
  gameMap: gameMapSchema,
  currentPart: {
    type: Number,
    required: true,
    default: 0
  },
  part1: Part1Schema,
  part2: Part2Schema,
  part3: Part3Schema,
  isStarted: {
    type: Boolean,
    required: true,
    default: false
  },
  gameWinner: {
    type: String
  }
});

export default RoomSchema;
