import trycatcher from "../../utils/trycatcher";
import { IRoomBase, IRoomCreateRequest } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import { roomDefault } from "./constants";
import jwt from "jsonwebtoken";
import { teams } from "../../constants";
import { ITeam, ITeamInRoom } from "../Team/interfaces";

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

      const TeamsInRoom: any = new Map();

      for (const key of Object.keys(teams)) {
        TeamsInRoom[key] = {
          ...(teamsObject.find(
            r => r._id === teamsId[teams[key]]
          ) as ITeam).toJSON(),
          inviteCode: TeamMethods.generateInviteCode()
        };
      }

      const Room = await server.Room.create({
        ...roomDefault,
        theme: RoomData.theme,
        gameStatus: {
          ...roomDefault.gameStatus,
          teams: TeamsInRoom
        }
      } as IRoomBase);
      const res = await Room.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method`
    }
  )
};

export default methods;
