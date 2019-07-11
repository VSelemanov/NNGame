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
      logMessage: `${EntityName} create request`
    }
  ),
  colorZone: trycatcher(
    async (req: IDecoratedRequest<{ _id: string; zone: string }>, h) => {
      const { _id, zone } = req.payload;
      return await methods.colorZone(_id, zone);
    },
    {
      logMessage: `${EntityName} create request`
    }
  )
};

export default ctrl;
