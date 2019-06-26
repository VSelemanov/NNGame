import trycatcher from "../../utils/trycatcher";
import { IAdminBase, IAdmin } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import jwt from "jsonwebtoken";

const methods = {
  create: trycatcher(
    async (AdminData: IAdminBase): Promise<IAdmin> => {
      const Admin = await server.Admin.create(AdminData);
      const res = await Admin.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method`
    }
  ),
  login: trycatcher(
    async (AdminData: IAdminBase): Promise<string> => {
      const Admin = await server.Admin.findOne(AdminData);
      if (!Admin) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      return jwt.sign({ _id: Admin._id }, process.env.ADMIN_KEY || "nngame", {
        algorithm: "HS256"
      });
    },
    {
      logMessage: `${EntityName} login method`
    }
  )
};

export default methods;
