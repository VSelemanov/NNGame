import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "../../../interfaces";
import { IGameRoomBase, IGameRoom, IGameRoomGetParams } from "../interfaces";
import methods from "../";
import { EntityName } from "../constants";

const ctrl = {
  create: trycatcher(
    async (req: IDecoratedRequest<IGameRoomBase>, h): Promise<IGameRoom> => {
      const AdminData: IGameRoomBase = req.payload;
      return await methods.create(AdminData);
    },
    {
      logMessage: `${EntityName} create request`
    }
  ),
  read: trycatcher(
    async (
      req: IDecoratedRequest<{}, IGameRoomGetParams>,
      h
    ): Promise<IGameRoom> => {
      const { isActive } = req.query;
      return await methods.read(
        isActive === "undefined" ? null : isActive === "true"
      );
    },
    {
      logMessage: `${EntityName} create request`
    }
  ),
  connect: trycatcher(
    async (
      req: IDecoratedRequest<
        {},
        {},
        { roomNumber: number },
        { teamId: string }
      >,
      h
    ): Promise<IGameRoom> => {
      const { roomNumber } = req.params;
      const { teamId } = req.auth.credentials;
      return await methods.connect(roomNumber, teamId);
    },
    {
      logMessage: `${EntityName} connect request`
    }
  )
};

export default ctrl;
