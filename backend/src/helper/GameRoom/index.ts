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
      const where: any = {};
      if (isActive !== null) {
        where.gameStatus.isActive = isActive;
      }
      const res = await server.GameRoom.find(where);
      return res;
    },
    {
      logMessage: `${EntityName} read method`
    }
  ),

  connect: trycatcher(
    async (roomNumber: number, teamId: string) => {
      const GameRoom = await server.GameRoom.findOne({ roomNumber });
      if (!GameRoom) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      return {
        // _id: GameRoom._id,
        gameStatus: GameRoom.gameStatus,
        gameToken: jwt.sign(
          {
            gameRoomId: GameRoom._id,
            teamId
          },
          "123",
          { algorithm: "HS256" }
        )
      };
    },
    {
      logMessage: `${EntityName} connect method`
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
