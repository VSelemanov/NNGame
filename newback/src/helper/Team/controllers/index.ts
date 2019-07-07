import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "../../../interfaces";
import { ITeamBase, ITeam } from "../interfaces";
import methods from "../";
import { EntityName } from "../constants";

const ctrl = {
  create: trycatcher(
    async (req: IDecoratedRequest<ITeamBase>, h) => {
      const TeamData: ITeamBase = req.payload;
      return await methods.create(TeamData);
    },
    {
      logMessage: `${EntityName} create request`
    }
  ),
  login: trycatcher(
    async (req: IDecoratedRequest<{ inviteCode: string }>, h) => {
      const { inviteCode } = req.payload;
      return await methods.login(inviteCode);
    },
    {
      logMessage: `${EntityName} create request`
    }
  )
};

export default ctrl;
