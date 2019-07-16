import trycatcher from "../../utils/trycatcher";
import { ITeamBase, ITeam } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import {
  ErrorMessages as RoomErrorMessages,
  subscriptionGameStatuspath
} from "../Room/constants";
import jwt from "jsonwebtoken";
import utils from "../../../src/utils";
import { teams } from "../../constants";
import RoomMethods from "../Room";
import { IRoom, IGamePart1Step, IGamePart1 } from "../Room/interfaces";

const methods = {
  read: trycatcher(
    async (): Promise<ITeam[]> => {
      return await server.Team.find({});
    },
    {
      logMessage: `${EntityName} read method error`
    }
  ),
  create: trycatcher(
    async (TeamData: ITeamBase): Promise<ITeam> => {
      const Team = await server.Team.create(TeamData);
      const res = await Team.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method error`
    }
  ),
  generateInviteCode: (): string => {
    return `${utils.getRandomInt(0, 999999)}`.padStart(6, "0");
  },
  login: trycatcher(
    async (inviteCode: string): Promise<string> => {
      const Room: IRoom = await RoomMethods.getActiveRoom();

      const teamsInGame = Room.gameStatus.teams;

      // console.log({ teamsInGame });

      if (!teamsInGame) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      let Team: ITeam | null = null;
      let teamKey: string | null = null;
      for (const key of Object.keys(teams)) {
        // console.log({ tic: teamsInGame[key].inviteCode });
        // console.log({ inviteCode });
        if (teamsInGame[key].inviteCode === inviteCode) {
          Team = teamsInGame[key];
          teamKey = key;
          teamsInGame[key].isLoggedIn = true;
        }
      }

      // console.log({ Team });
      // console.log({ teamKey });

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

      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);

      return token;
    },
    {
      logMessage: `${EntityName} login method error`
    }
  ),
  getTeamLinkInGame: trycatcher(
    async (id: string): Promise<string> => {
      const Room = await RoomMethods.getActiveRoom();
      if (!Room.gameStatus.teams) {
        throw new Error(RoomErrorMessages.NOT_FOUND);
      }
      let teamKey: string | null = null;
      for (const key of Object.keys(teams)) {
        if (Room.gameStatus.teams[key]._id === id) {
          teamKey = key;
        }
      }

      if (!teamKey) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      return teamKey;
    },
    {
      logMessage: `${EntityName} get teamlink method error`
    }
  ),
  colorZone: trycatcher(
    async (zoneKey: string, teamKey: string) => {
      const Room: IRoom = await RoomMethods.colorZone(zoneKey, teamKey);
      const currentPart = Room.gameStatus.currentPart;
      if (currentPart === 1) {
        const part: IGamePart1 = Room.gameStatus.part1;
        const step = part.steps[part.currentStep || 0];
        step.allowZones[teamKey] = step.allowZones[teamKey] - 1;
        if (step.allowZones[teamKey] === 0) {
          step.teamQueue.shift();
        }
        Room.markModified("gameStatus.part1.steps");
        await Room.save();
      }
      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    { logMessage: `${EntityName} colorZone method error` }
  ),
  response: trycatcher(
    async (response: number, timer: number | undefined, teamKey: string) => {
      const Room: IRoom = await RoomMethods.teamResponse(
        response,
        timer,
        teamKey
      );
      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    { logMessage: `${EntityName} response method error` }
  ),
  attack: trycatcher(
    async (attackingZone: string, defenderZone: string, teamKey: string) => {
      const Room: IRoom = await RoomMethods.teamAttack(
        attackingZone,
        defenderZone,
        teamKey
      );

      await server.server.publish(subscriptionGameStatuspath, Room.gameStatus);
      return "ok";
    },
    { logMessage: `${EntityName} attack method error` }
  )
};

export default methods;
