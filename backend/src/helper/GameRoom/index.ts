import trycatcher from "../../utils/trycatcher";
import { IGameRoomBase, IGameRoom } from "./interfaces";
import { server } from "../../server";
import { EntityName } from "./constants";

const methods = {
  create: trycatcher(
    async (GameRoomData: IGameRoomBase): Promise<IGameRoom> => {
      const GameRoom = await server.GameRoom.create(GameRoomData);
      const res = await GameRoom.save();
      return res;
    },
    {
      logMessage: `${EntityName} method error`
    }
  )
};

export default methods;
