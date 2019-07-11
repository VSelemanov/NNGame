import trycatcher from "../../utils/trycatcher";
import { IRoomBase, IRoomCreateRequest, IRoom } from "./interfaces";
import { server } from "../../server";
import {
  EntityName,
  ErrorMessages,
  allowZonesDefault,
  resultsDefault
} from "./constants";
import { roomDefault } from "./constants";
import { teams } from "../../constants";
import { ITeam, ITeamInRoom } from "../Team/interfaces";
import QuestionMethods from "../Question";

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
  ),
  getActiveRoom: trycatcher(
    async (): Promise<IRoom> => {
      const Room = await server.Room.findOne({ isActive: true });

      if (!Room) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      return Room;
    },
    {
      logMessage: `get active ${EntityName} method`
    }
  ),
  colorZone: trycatcher(
    async (zoneKey: string, teamKey: string): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      if (Room.gameStatus.gameMap[zoneKey].team) {
        methods.incDecZones(Room.gameStatus.gameMap[zoneKey].team, Room, -1);
      }

      Room.gameStatus.gameMap[zoneKey].team = teamKey;
      methods.incDecZones(teamKey, Room);

      await Room.save();

      return Room;
    },
    {
      logMessage: `color zone ${EntityName} method`
    }
  ),
  incDecZones: trycatcher(
    (teamKey: string, Room: IRoom, direction: number = 1) => {
      Room.gameStatus.teams[teamKey].zones += direction;
    },
    {
      logMessage: "increment/decrement zone methods"
    }
  ),
  startgame: trycatcher(
    async (): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      Room.gameStatus.currentPart = 1;
      Room.gameStatus.isStarted = true;
      await Room.save();

      return Room;
    },
    {
      logMessage: `game start ${EntityName} method`
    }
  ),
  nextquestion: trycatcher(
    async (): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      const Question = await QuestionMethods.random({ isNumeric: true });

      const part = Room.gameStatus.part1;

      part.steps.push({
        question: Question,
        allowZones: allowZonesDefault,
        isStarted: false,
        results: resultsDefault
      });

      part.currentStep = part.currentStep !== null ? part.currentStep + 1 : 0;

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} start game method`
    }
  )
};

export default methods;
