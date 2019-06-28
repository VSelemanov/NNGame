import trycatcher from "../../utils/trycatcher";
import {
  IGameRoomBase,
  IGameRoom,
  IGameStatus,
  ITeamResponse,
  IMap
} from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import jwt from "jsonwebtoken";
import QuestionMethods from "../Question";
import { IQuestionGetRandom } from "../Question/interfaces";
import { ErrorMessages as TeamErrorMessages } from "../Team/constants";

const methods = {
  create: trycatcher(
    async (GameRoomData: IGameRoomBase): Promise<IGameRoom> => {
      const roomNumber = await methods.getNextRoomNumber();
      const GameRoom = await server.GameRoom.create({
        ...GameRoomData,
        roomNumber
      });
      const res = await GameRoom.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method`
    }
  ),
  read: trycatcher(
    async (isActive: boolean | null): Promise<IGameRoom[]> => {
      let where: any = {};
      if (isActive !== null) {
        where = { "gameStatus.isActive": isActive };
      }

      const res = await server.GameRoom.find(where);
      return res;
    },
    {
      logMessage: `${EntityName} read method`
    }
  ),

  fillcheck: (gameStatus: IGameStatus): string[] => {
    const result: string[] = [];
    for (const teamKey of Object.keys(gameStatus.teams)) {
      if (gameStatus.teams[teamKey] === undefined && teamKey !== "$init") {
        result.push(teamKey);
      }
    }
    return result;
  },

  connect: trycatcher(
    async (roomId: string, teamId: string | undefined, isAdmin: boolean) => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      const fillChecked = methods.fillcheck(GameRoom.gameStatus);

      if (
        !isAdmin &&
        teamId &&
        fillChecked.length > 0
        // GameRoom.gameStatus.teams.filter(r => r._id === teamId).length === 0 &&
        // GameRoom.gameStatus.teams.length < 3
      ) {
        const Team = await server.Team.findOne({ _id: teamId });
        if (!Team) {
          throw new Error(TeamErrorMessages.NOT_FOUND);
        }
        GameRoom.gameStatus.teams[fillChecked[0]] = Team;
        await GameRoom.save();
      }

      const result: any = {
        gameStatus: GameRoom.gameStatus
      };
      if (!isAdmin) {
        result.gameToken = jwt.sign(
          {
            gameRoomId: GameRoom._id,
            isAdmin,
            teamId
          },
          process.env.SECRET_KEY || "nngame",
          { algorithm: "HS256" }
        );
      }

      return result;
    },
    {
      logMessage: `${EntityName} connect method`
    }
  ),
  getGameStatus: trycatcher(
    async (roomId: string) => {
      const GameRoom = await server.GameRoom.findById(roomId);
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      return GameRoom.gameStatus;
    },
    {
      logMessage: `${EntityName} get status`
    }
  ),
  showQuestion: trycatcher(
    async (roomId: string, isNumeric: boolean): Promise<IGameStatus> => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      const Question = await QuestionMethods.random({
        isNumeric
      } as IQuestionGetRandom);
      GameRoom.gameStatus.part1.push({
        question: Question,
        results: [],
        isTimerStarted: false
      });
      await GameRoom.save();
      return GameRoom.gameStatus;
    },
    {
      logMessage: `${EntityName} show question`
    }
  ),
  startQuestion: trycatcher(
    async (roomId: string) => {
      const GameRoom = await server.GameRoom.findById(roomId);
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      GameRoom.gameStatus.part1[
        GameRoom.gameStatus.part1.length - 1
      ].isTimerStarted = true;
      await GameRoom.save();
      return GameRoom.gameStatus;
    },
    {
      logMessage: `${EntityName} start question`
    }
  ),

  start: trycatcher(
    async (roomId: string) => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      let response: any = ErrorMessages.NOT_FULL;
      if (methods.fillcheck(GameRoom.gameStatus).length === 0) {
        GameRoom.gameStatus.isStarted = true;
        await GameRoom.save();
        response = { gameStatus: GameRoom.gameStatus };
      }
      return response;
    },
    {
      logMessage: `${EntityName} get status`
    }
  ),

  teamResponse: trycatcher(
    async (roomId: string, teamResponse: ITeamResponse) => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      const partElement =
        GameRoom.gameStatus.part1[GameRoom.gameStatus.part1.length - 1];

      const resultsIncludes = partElement.results.filter(
        result => result.teamId === teamResponse.teamId
      );

      if (resultsIncludes.length === 0) {
        partElement.results.push(teamResponse);
      }

      await GameRoom.save();

      return GameRoom.gameStatus;
    },
    {
      logMessage: `${EntityName} get status`
    }
  ),

  zoneCapture: trycatcher(
    async (roomId: string, teamId: string, zoneName: string) => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      const gameMap = GameRoom.gameStatus.gameMap;
      const hasBase = methods.findBaseOnMap(gameMap, teamId);

      gameMap[zoneName].isStartBase = !hasBase;
      GameRoom.markModified(`gameStatus.gameMap.${zoneName}.isStartBase`);
      gameMap[zoneName].teamId = teamId;
      GameRoom.markModified(`gameStatus.gameMap.${zoneName}.teamId`);

      await GameRoom.save();

      return GameRoom.gameStatus;
    },
    {
      logMessage: `${EntityName} get status`
    }
  ),
  findBaseOnMap: (gameMap: IMap, teamId: string): boolean => {
    for (const zoneName of Object.keys(gameMap)) {
      if (gameMap[zoneName].teamId === teamId) return true;
    }
    return false;
  },

  getNextRoomNumber: trycatcher(
    async (): Promise<number> => {
      const LastGameRoom = await server.GameRoom.findOne()
        .sort({ createdAt: -1 })
        .limit(1)
        .exec();
      if (!LastGameRoom) {
        return 1;
      }
      return +LastGameRoom.roomNumber + 1;
    }
  )
};

export default methods;
