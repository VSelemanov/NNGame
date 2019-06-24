import trycatcher from "../../utils/trycatcher";
import { IAdminBase, IAdmin } from "./interfaces";
import { server } from "../../server";
import { EntityName } from "./constants";

const methods = {
  create: trycatcher(
    async (AdminData: IAdminBase): Promise<IAdmin> => {
      const Admin = await server.Admin.create(AdminData);
      const res = await Admin.save();
      return res;
    },
    {
      logMessage: `${EntityName} method error`
    }
  )
};

export default methods;
