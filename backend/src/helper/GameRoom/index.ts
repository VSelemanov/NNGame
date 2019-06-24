import trycatcher from "../../utils/trycatcher";
import { IGameRoomBase, IGameRoom } from "./interfaces";
import { server } from "../../server";
import { EntityName } from "./constants";

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
      logMessage: `${EntityName} method error`
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
