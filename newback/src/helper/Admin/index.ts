import trycatcher from "../../utils/trycatcher";
import { IAdminBase, IAdmin } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import TeamMethods from "../Team";
import RoomMethods from "../Room";
import jwt from "jsonwebtoken";
import { subscriptionGameStatuspath } from "../Room/constants";
import { IRoom } from "../Room/interfaces";
import { dotenvConfig } from "../../constants";

const methods = {
  create: trycatcher(
    async (AdminData: IAdminBase): Promise<IAdmin> => {
      const Admin = await server.Admin.create(AdminData);
      const res = await Admin.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method`
    }
  ),
  login: trycatcher(
    async (AdminData: IAdminBase): Promise<string> => {
      const Admin = await server.Admin.findOne(AdminData);
      if (!Admin) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      return jwt.sign(
        { _id: Admin._id, isAdmin: true },
        dotenvConfig.ADMIN_KEY,
        {
          algorithm: "HS256"
        }
      );
    },
    {
      logMessage: `${EntityName} login method`
    }
  ),
  colorZone: trycatcher(
    async (_id: string | null, zoneKey: string): Promise<string> => {
      const teamKey = _id ? await TeamMethods.getTeamLinkInGame(_id) : null;
      const Room: IRoom = await RoomMethods.colorZone(zoneKey, teamKey);
      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    {
      logMessage: `${EntityName} color zone method`
    }
  ),
  startgame: trycatcher(
    async (): Promise<string> => {
      const Room: IRoom = await RoomMethods.startgame();
      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    {
      logMessage: `${EntityName} start game method`
    }
  ),
  nextquestion: trycatcher(
    async (): Promise<string> => {
      const Room: IRoom = await RoomMethods.nextquestion();
      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    {
      logMessage: `${EntityName} next question method`
    }
  ),
  startquestion: trycatcher(
    async (): Promise<string> => {
      const Room: IRoom = await RoomMethods.startquestion();
      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    {
      logMessage: `${EntityName} start question method`
    }
  ),
  stopstep: trycatcher(
    async (): Promise<string> => {
      const Room: IRoom = await RoomMethods.stopstep();
      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    {
      logMessage: `${EntityName} stop step method`
    }
  )
};

export default methods;
