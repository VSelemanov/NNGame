import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "../../../interfaces";
import {
  ITeamBase,
  ITeam,
  ITeamCredentials,
  ITeamResponse
} from "../interfaces";
import methods from "../";
import { EntityName } from "../constants";

const ctrl = {
  read: trycatcher(
    async (req: IDecoratedRequest<{}>, h) => {
      return await methods.read();
    },
    {
      logMessage: `${EntityName} read request`,
      isRequest: true
    }
  ),
  create: trycatcher(
    async (req: IDecoratedRequest<ITeamBase>, h) => {
      const TeamData: ITeamBase = req.payload;
      return await methods.create(TeamData);
    },
    {
      logMessage: `${EntityName} create request`,
      isRequest: true
    }
  ),
  login: trycatcher(
    async (req: IDecoratedRequest<{ inviteCode: string }>, h) => {
      const { inviteCode } = req.payload;
      return await methods.login(inviteCode);
    },
    {
      logMessage: `${EntityName} login request`,
      isRequest: true
    }
  ),
  colorZone: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, { zoneKey: string }, ITeamCredentials>,
      h
    ) => {
      const { zoneKey } = req.params;
      const { teamKey } = req.auth.credentials;
      return await methods.colorZone(zoneKey, teamKey);
    },
    {
      logMessage: `${EntityName} color zone request`,
      isRequest: true
    }
  ),
  response: trycatcher(
    async (
      req: IDecoratedRequest<ITeamResponse, {}, {}, ITeamCredentials>,
      h
    ) => {
      const { response, timer } = req.payload;
      const { teamKey } = req.auth.credentials;
      return await methods.response(response, timer, teamKey);
    },
    {
      logMessage: `${EntityName} response request`,
      isRequest: true
    }
  ),
  attack: trycatcher(
    async (
      req: IDecoratedRequest<
        { attackingZone: string; defenderZone: string },
        {},
        {},
        ITeamCredentials
      >,
      h
    ) => {
      const { attackingZone, defenderZone } = req.payload;
      const { teamKey } = req.auth.credentials;
      return await methods.attack(attackingZone, defenderZone, teamKey);
    },
    {
      logMessage: `${EntityName} attack request`,
      isRequest: true
    }
  )
};

export default ctrl;
