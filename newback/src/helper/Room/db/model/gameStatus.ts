import { Schema } from "mongoose";
import teamsInRoom from "../../../Team/db/model/teamsInRoom";
import gameMap from "./gameMap";
import Part2Schema from "./Part2";
import { baseFlds } from "../../../../constants";

const RoomSchema = new Schema({
  ...baseFlds,
  teams: teamsInRoom,
  gameMap: gameMap,
  currentPart: {
    type: Number,
    required: true,
    default: 0
  },
  part1: {
    type: Array
  },
  part2: Part2Schema
});

export default RoomSchema;
