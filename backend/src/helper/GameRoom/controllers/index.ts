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
        isActive === undefined || isActive === "" ? null : isActive
      );
    },
    {
      logMessage: `${EntityName} read request`,
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
      logMessage: `${EntityName} game status request`,
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
      logMessage: `${EntityName} show question request`,
      isRequest: true
    }
  ),
  startQuestion: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, {}, { gameRoomId: string }>,
      h
    ): Promise<IGameRoom> => {
      const { gameRoomId } = req.auth.credentials;
      return await methods.startQuestion(gameRoomId);
    },
    {
      logMessage: `${EntityName} start question request`,
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
      logMessage: `${EntityName} start request`,
      isRequest: true
    }
  ),
  teamResponse: trycatcher(
    async (
      req: IDecoratedRequest<
        { response: number; timer: number },
        {},
        {},
        { gameRoomId: string; teamId: string }
      >,
      h
    ): Promise<IGameRoom> => {
      const { gameRoomId, teamId } = req.auth.credentials;
      const { response, timer } = req.payload;
      return await methods.teamResponse(gameRoomId, {
        teamId,
        response,
        timer
      });
    },
    {
      logMessage: `${EntityName} team response request`,
      isRequest: true
    }
  ),
  zoneCapture: trycatcher(
    async (
      req: IDecoratedRequest<
        { zoneName: string },
        {},
        {},
        { gameRoomId: string; teamId: string }
      >,
      h
    ): Promise<IGameRoom> => {
      const { gameRoomId, teamId } = req.auth.credentials;
      const { zoneName } = req.payload;
      return await methods.zoneCapture(gameRoomId, teamId, zoneName);
    },
    {
      logMessage: `${EntityName} team response request`,
      isRequest: true
    }
  ),
  attack: trycatcher(
    async (
      req: IDecoratedRequest<
        { attackingZone: string; deffenderZone: string },
        {},
        {},
        { gameRoomId: string; teamId: string }
      >,
      h
    ): Promise<IGameRoom> => {
      const { gameRoomId, teamId } = req.auth.credentials;
      const { attackingZone, deffenderZone } = req.payload;
      return await methods.attack(
        gameRoomId,
        teamId,
        attackingZone,
        deffenderZone
      );
    },
    {
      logMessage: `${EntityName} team response request`,
      isRequest: true
    }
  )
};

export default ctrl;
