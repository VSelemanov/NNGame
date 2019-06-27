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
        isActive === undefined || isActive === "" ? null : isActive === "true"
      );
    },
    {
      logMessage: `${EntityName} create request`,
      isRequest: true
    }
  ),
  connect: trycatcher(
    async (
      req: IDecoratedRequest<
        {},
        {},
        { roomId: string },
        { teamId: string | undefined; isAdmin: boolean }
      >,
      h
    ): Promise<IGameRoom> => {
      const { roomId } = req.params;
      const { teamId, isAdmin } = req.auth.credentials;

      return await methods.connect(roomId, teamId, isAdmin);
    },
    {
      logMessage: `${EntityName} connect request`,
      isRequest: true
    }
  ),
  getGameStatus: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, {}, { gameRoomId: string }>,
      h
    ): Promise<IGameRoom> => {
      const { gameRoomId } = req.auth.credentials;
      return await methods.getGameStatus(gameRoomId);
    },
    {
      logMessage: `${EntityName} connect request`,
      isRequest: true
    }
  ),
  showQuestion: trycatcher(
    async (
      req: IDecoratedRequest<
        {},
        { isNumeric: boolean },
        {},
        { gameRoomId: string }
      >,
      h
    ): Promise<IGameRoom> => {
      const { gameRoomId } = req.auth.credentials;
      const { isNumeric } = req.query;
      return await methods.showQuestion(gameRoomId, isNumeric);
    },
    {
      logMessage: `${EntityName} connect request`,
      isRequest: true
    }
  ),
  start: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, { roomId: string }>,
      h
    ): Promise<IGameRoom> => {
      const { roomId } = req.params;
      return await methods.start(roomId);
    },
    {
      logMessage: `${EntityName} connect request`,
      isRequest: true
    }
  )
};

export default ctrl;
