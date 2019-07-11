import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "../../../interfaces";
import { ITeamBase, ITeam, ITeamCredentials } from "../interfaces";
import methods from "../";
import { EntityName } from "../constants";

const ctrl = {
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
      logMessage: `${EntityName} create request`,
      isRequest: true
    }
  ),
  zone: trycatcher(
    async (
      req: IDecoratedRequest<{}, {}, { zoneKey: string }, ITeamCredentials>,
      h
    ) => {
      const { zoneKey } = req.params;
      const { teamKey } = req.auth.credentials;
      return await methods.zone(zoneKey, teamKey);
    },
    {
      logMessage: `${EntityName} create request`,
      isRequest: true
    }
  )
};

export default ctrl;
