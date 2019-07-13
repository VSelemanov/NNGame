import trycatcher from "../../utils/trycatcher";
import {
  IRoomBase,
  IRoomCreateRequest,
  IRoom,
  IGamePart1,
  IGamePart1Step
} from "./interfaces";
import { server } from "../../server";
import {
  EntityName,
  ErrorMessages,
  allowZonesDefault,
  responsesDefault
} from "./constants";
import { roomDefault } from "./constants";
import { teams } from "../../constants";
import { ITeam, ITeamInRoom, ITeamResponsePart1 } from "../Team/interfaces";
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

      const index =
        part.steps.push({
          question: Question,
          allowZones: allowZonesDefault,
          isStarted: false,
          responses: responsesDefault
        }) - 1;

      part.currentStep = part.currentStep !== null ? part.currentStep + 1 : 0;

      Room.markModified(`gameStatus.part1.steps[${index}].results.team1`);

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} next question method`
    }
  ),
  startquestion: trycatcher(
    async (): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      Room.gameStatus.part1.steps[
        Room.gameStatus.part1.currentStep || 0
      ].isStarted = true;

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} start question method`
    }
  ),
  teamResponse: trycatcher(
    async (
      response: number,
      timer: number,
      teamKey: string
    ): Promise<IRoom> => {
      const Room: IRoom = await methods.getActiveRoom();
      const part = Room.gameStatus[`part${Room.gameStatus.currentPart}`];
      if (Room.gameStatus.currentPart === 1) {
        const step = (part as IGamePart1).steps[part.currentStep];
        const teamResponse: ITeamResponsePart1 = step.responses[teamKey];

        teamResponse.response = response;
        teamResponse.timer = timer;

        if (methods.checkTeamResponses(step)) {
          methods.calcQuestionWinner(step);
        }
      }

      await Room.save();

      return Room;
    },
    {
      logMessage: `${EntityName} start question method`
    }
  ),
  checkTeamResponses: (step: IGamePart1Step): boolean => {
    for (const teamKey of Object.keys(teams)) {
      if (step.responses[teamKey] === null) {
        return false;
      }
    }
    return true;
  },
  calcQuestionWinner: (stepElement: IGamePart1Step) => {
    interface IResultDifTimer {
      dif: number;
      timer: number;
      teamKey: string;
    }

    const semiRes: IResultDifTimer[] = Object.keys(teams).map(
      (teamKey): IResultDifTimer => {
        return {
          timer: stepElement.responses[teamKey].timer || 100,
          dif: Math.abs(
            (stepElement.question.numericAnswer || 0) -
              stepElement.responses[teamKey].response
          ),
          teamKey
        };
      }
    );

    semiRes.sort((a, b) => {
      if (a.dif < b.dif) {
        return -1;
      } else if (a.dif > b.dif) {
        return 1;
      } else {
        if (a.timer < b.timer) {
          return -1;
        } else if (a.timer > b.timer) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    for (let i = 0; i < semiRes.length; i++) {
      const zones = 2 - i;
      stepElement.allowZones[semiRes[i].teamKey] = zones;
      stepElement.responses[semiRes[i].teamKey].result = zones;
    }
  }
};

export default methods;
