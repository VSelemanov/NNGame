import { Schema } from "mongoose";
import { teams } from "../../../../constants";
import { TeamSchema } from "./";
import { baseFlds } from "../../../../constants";
import methods from "../../";

const TeamInRoomSchema = TeamSchema.clone();

TeamInRoomSchema.add({
  inviteCode: {
    type: String,
    required: true
  }
});

export const teamsInRoom = new Schema({
  ...baseFlds,
  [teams.team1]: TeamInRoomSchema,
  [teams.team2]: TeamInRoomSchema,
  [teams.team3]: TeamInRoomSchema
});

export default teamsInRoom;
