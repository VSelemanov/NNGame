import trycatcher from "../../utils/trycatcher";
import { IRoomBase, IRoomCreateRequest } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import { roomDefault } from "./constants";
import jwt from "jsonwebtoken";
import { teams } from "../../constants";
import { ITeam } from "../Team/interfaces";

import TeamMethods from "../Team";

const methods = {
  create: trycatcher(
    async (RoomData: IRoomCreateRequest): Promise<any> => {
      const { theme, ...teamsId } = RoomData;
      const teamsObject = await server.Team.find({
        _id: {
          $in: [
            teamsId[teams.team1],
            teamsId[teams.team2],
            teamsId[teams.team3]
          ]
        }
      });

      const Room = await server.Room.create({
        ...roomDefault,
        theme: RoomData.theme,
        gameStatus: {
          ...roomDefault.gameStatus,
          teams: {
            [teams.team1]: {
              ...(teamsObject.find(
                r => r._id === teamsId[teams.team1]
              ) as ITeam).toJSON(),
              inviteCode: TeamMethods.generateInviteCode()
            },
            [teams.team2]: {
              ...(teamsObject.find(
                r => r._id === teamsId[teams.team2]
              ) as ITeam).toJSON(),
              inviteCode: TeamMethods.generateInviteCode()
            },
            [teams.team3]: {
              ...(teamsObject.find(
                r => r._id === teamsId[teams.team3]
              ) as ITeam).toJSON(),
              inviteCode: TeamMethods.generateInviteCode()
            }
          }
        }
      } as IRoomBase);
      // Room.markModified("gameStatus.teams.team1");
      // Room.markModified("gameStatus.teams.team2");
      // Room.markModified("gameStatus.teams.team3");
      const res = await Room.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method`
    }
  )
};

export default methods;
