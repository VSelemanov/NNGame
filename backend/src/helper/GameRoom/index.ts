import trycatcher from "../../utils/trycatcher";
import {
  IGameRoomBase,
  IGameRoom,
  IGameStatus,
  ITeamResponse,
  IMap,
  IStepPart1
} from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import jwt from "jsonwebtoken";
import QuestionMethods from "../Question";
import { IQuestionGetRandom } from "../Question/interfaces";
import { ErrorMessages as TeamErrorMessages } from "../Team/constants";
import { ITeam } from "../Team/interfaces";

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
        const Team = await server.Team.findOne({ _id: teamId });
        if (!Team) {
          throw new Error(TeamErrorMessages.NOT_FOUND);
        }
        result.gameToken = methods.generateGameToken(
          GameRoom._id,
          isAdmin,
          Team._id
        );
      }

      return result;
    },
    {
      logMessage: `${EntityName} connect method`
    }
  ),
  generateGameToken: (gameRoomId: string, isAdmin: boolean, teamId) => {
    return jwt.sign(
      {
        gameRoomId,
        isAdmin,
        teamId
      },
      process.env.SECRET_KEY || "nngame",
      { algorithm: "HS256" }
    );
  },
  checkFillMap: (gameMap): boolean => {
    for (const key of Object.keys(gameMap)) {
      if (gameMap[key].teamId === "") {
        return false;
      }
    }
    return true;
  },
  prepareTeamQueue: (gameStatus: IGameStatus) => {
    const res: ITeam[] = [];
    for (const key of Object.keys(gameStatus.teams)) {
      if (key !== "$init") {
        res.push(gameStatus.teams[key]);
      }
    }
    res.sort((a, b) => {
      if (a.zones < b.zones) {
        return -1;
      } else if (a.zones > b.zones) {
        return 1;
      } else {
        return 0;
      }
    });
    return res;
  },
  getGameStatus: trycatcher(
    async (roomId: string) => {
      const GameRoom = await server.GameRoom.findById(roomId);
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      const gameStatus = GameRoom.gameStatus;

      const mapIsFull = methods.checkFillMap(GameRoom.gameStatus.gameMap);
      if (mapIsFull && gameStatus.currentPart === 1) {
        gameStatus.currentPart = 2;
        gameStatus.part2.teamQueue = methods.prepareTeamQueue(gameStatus);
      }

      GameRoom.save();

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
        isTimerStarted: false,
        teamQueue: []
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

      const stepElement =
        GameRoom.gameStatus.part1[GameRoom.gameStatus.part1.length - 1];

      const resultsIncludes = stepElement.results.filter(
        result => result.teamId === teamResponse.teamId
      );

      if (resultsIncludes.length === 0) {
        stepElement.results.push(teamResponse);
      }
      if (stepElement.results.length === 3) {
        methods.calcQuestionWinner(stepElement);
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

      const teams = GameRoom.gameStatus.teams;
      for (const key of Object.keys(teams)) {
        if (key !== "$init" && teams[key] && teams[key]._id === teamId) {
          teams[key].zones += 1;
        }
      }

      await GameRoom.save();

      return GameRoom.gameStatus;
    },
    {
      logMessage: `${EntityName} get status`
    }
  ),
  attack: trycatcher(
    async (
      roomId: string,
      teamId: string,
      attackingZone: string,
      deffenderZone: string
    ) => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      const attacking = await server.Team.findOne({
        _id: teamId
      });

      if (!attacking) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      const deffender = await server.Team.findOne({
        _id: GameRoom.gameStatus.gameMap[deffenderZone].teamId
      });

      if (!deffender) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }

      const question = await QuestionMethods.random({
        isNumeric: false
      } as IQuestionGetRandom);

      GameRoom.gameStatus.part2.steps.push({
        deffenderZone,
        attackingZone,
        attacking,
        deffender,
        question
      });

      await GameRoom.save();

      return GameRoom.gameStatus;
    },
    {
      logMessage: `${EntityName} get status`
    }
  ),
  findBaseOnMap: (gameMap: IMap, teamId: string): boolean => {
    for (const zoneName of Object.keys(gameMap)) {
      if (gameMap[zoneName].teamId === teamId) {
        return true;
      }
    }
    return false;
  },

  calcQuestionWinner: (stepElement: IStepPart1) => {
    interface IResultDifTimer {
      dif: number;
      timer: number;
      teamId: string;
      allowZones?: number;
    }
    const semiRes: IResultDifTimer[] = stepElement.results.map(
      (r): IResultDifTimer => ({
        timer: r.timer || 15,
        teamId: r.teamId,
        dif: (stepElement.question.numericAnswer || 0) - r.response
      })
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

    for (const row of stepElement.results) {
      for (let i = 0; i < semiRes.length; i++) {
        if (semiRes[i].teamId === row.teamId) {
          row.allowZones = 2 - i;
          semiRes[i].allowZones = 2 - i;
        }
      }
    }

    stepElement.teamQueue = semiRes;
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
