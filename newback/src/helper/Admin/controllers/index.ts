import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "../../../interfaces";
import { IAdminBase, IAdmin } from "../interfaces";
import methods from "../";
import { EntityName } from "../constants";

const ctrl = {
  create: trycatcher(
    async (req: IDecoratedRequest<IAdminBase>, h) => {
      const AdminData: IAdminBase = req.payload;
      return await methods.create(AdminData);
    },
    {
      logMessage: `${EntityName} create request`
    }
  ),
  login: trycatcher(
    async (req: IDecoratedRequest<IAdminBase>, h) => {
      const AdminData: IAdminBase = req.payload;
      return await methods.login(AdminData);
    },
    {
      logMessage: `${EntityName} login request`
    }
  ),
  colorZone: trycatcher(
    async (req: IDecoratedRequest<{ _id: string | null; zone: string }>, h) => {
      const { _id, zone } = req.payload;
      return await methods.colorZone(_id, zone);
    },
    {
      logMessage: `${EntityName} color zone request`
    }
  ),
  startgame: trycatcher(
    async (req, h) => {
      return await methods.startgame();
    },
    {
      logMessage: `${EntityName} start game request`
    }
  ),
  nextquestion: trycatcher(
    async (req, h) => {
      return await methods.nextquestion();
    },
    {
      logMessage: `${EntityName} next question request`
    }
  ),
  startquestion: trycatcher(
    async (req, h) => {
      return await methods.startquestion();
    },
    {
      logMessage: `${EntityName} start question request`
    }
  ),
  stopstep: trycatcher(
    async (req: IDecoratedRequest<IAdminBase>, h) => {
      return await methods.stopstep();
    },
    {
      logMessage: `${EntityName} stop step request`
    }
  )
};

export default ctrl;
