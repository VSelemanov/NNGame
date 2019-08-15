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
      logMessage: `${EntityName} create request`,
      isRequest: true
    }
  ),
  login: trycatcher(
    async (req: IDecoratedRequest<IAdminBase>, h) => {
      const AdminData: IAdminBase = req.payload;
      return await methods.login(AdminData);
    },
    {
      logMessage: `${EntityName} login request`,
      isRequest: true
    }
  ),
  colorZone: trycatcher(
    async (req: IDecoratedRequest<{ _id: string | null; zone: string }>, h) => {
      const { _id, zone } = req.payload;
      return await methods.colorZone(_id, zone);
    },
    {
      logMessage: `${EntityName} color zone request`,
      isRequest: true
    }
  ),
  startgame: trycatcher(
    async (req, h) => {
      return await methods.startgame();
    },
    {
      logMessage: `${EntityName} start game request`,
      isRequest: true
    }
  ),
  nextquestion: trycatcher(
    async (req, h) => {
      return await methods.nextquestion();
    },
    {
      logMessage: `${EntityName} next question request`,
      isRequest: true
    }
  ),
  startquestion: trycatcher(
    async (req, h) => {
      return await methods.startquestion();
    },
    {
      logMessage: `${EntityName} start question request`,
      isRequest: true
    }
  ),
  stopstep: trycatcher(
    async (req: IDecoratedRequest<IAdminBase>, h) => {
      return await methods.stopstep();
    },
    {
      logMessage: `${EntityName} stop step request`,
      isRequest: true
    }
  )
};

export default ctrl;
