import { Schema } from "mongoose";
import { teams } from "github/NNGame/newback/src/constants";
import { TeamSchema } from ".";
import { baseFlds } from "github/NNGame/newback/src/constants";

export const teamsInRoom = new Schema({
  ...baseFlds,
  [teams.team1]: TeamSchema,
  [teams.team2]: TeamSchema,
  [teams.team3]: TeamSchema
});

export default teamsInRoom;
