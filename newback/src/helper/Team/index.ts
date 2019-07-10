import trycatcher from "../../utils/trycatcher";
import { ITeamBase, ITeam } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import { ErrorMessages as RoomErrorMessages } from "../Room/constants";
import jwt from "jsonwebtoken";
import utils from "../../../src/utils";
import { teams } from "../../constants";
import RoomMethods from "../Room";

const methods = {
  create: trycatcher(
    async (TeamData: ITeamBase): Promise<ITeam> => {
      const Team = await server.Team.create(TeamData);
      const res = await Team.save();
      return res;
    },
    {
      logMessage: `${EntityName} method error`
    }
  ),
  generateInviteCode: (): string => {
    return `${utils.getRandomInt(0, 999999)}`.padStart(6, "0");
  },
  login: trycatcher(
    async (inviteCode: string): Promise<string> => {
      const Room = await RoomMethods.getActiveRoom();

      const teamsInGame = Room.gameStatus.teams;
      if (!teamsInGame) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      let Team: ITeam | null = null;
      let teamKey: string | null = null;
      for (const key of Object.keys(teams)) {
        if (teamsInGame[key].inviteCode === inviteCode) {
          Team = teamsInGame[key];
          teamKey = key;
          teamsInGame[key].isLoggedIn = true;
        }
      }

      if (!Team || !teamKey) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      const token = jwt.sign(
        { _id: Team.id, teamKey, isAdmin: false },
        process.env.SECRET_KEY || "nngame",
        {
          algorithm: "HS256"
        }
      );

      await Room.save();

      return token;
    },
    {
      logMessage: `${EntityName} login method error`
    }
  )
};

export default methods;
