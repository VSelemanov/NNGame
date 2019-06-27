import trycatcher from "../../utils/trycatcher";
import { IGameRoomBase, IGameRoom } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import jwt from "jsonwebtoken";

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

  connect: trycatcher(
    async (roomId: string, teamId: string | undefined, isAdmin: boolean) => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      if (
        !isAdmin &&
        teamId &&
        !GameRoom.gameStatus.teams.includes(teamId) &&
        GameRoom.gameStatus.teams.length < 3
      ) {
        GameRoom.gameStatus.teams.push(teamId);
        await GameRoom.save();
      }

      const result: any = {
        gameStatus: GameRoom.gameStatus
      };
      if (!isAdmin) {
        result.gameToken = jwt.sign(
          {
            gameRoomId: GameRoom._id,
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
      return { gameStatus: GameRoom.gameStatus };
    },
    {
      logMessage: `${EntityName} get status`
    }
  ),

  start: trycatcher(
    async (roomId: string) => {
      const GameRoom = await server.GameRoom.findOne({ _id: roomId });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      let response: any = ErrorMessages.NOT_FULL;
      if (GameRoom.gameStatus.teams.length === 3) {
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
