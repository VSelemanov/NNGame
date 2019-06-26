import trycatcher from "../../utils/trycatcher";
import { ITeamBase, ITeam } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import jwt from "jsonwebtoken";

const methods = {
  create: trycatcher(
    async (TeamData: ITeamBase): Promise<ITeam> => {
      const Team = await server.Team.create(TeamData);
      const res = await Team.save();
      return res;
    },
    {
      logMessage: `${EntityName} method error`
    }
  ),
  login: trycatcher(
    async (name: string): Promise<string> => {
      const Team = await server.Team.findOne({ name });
      if (!Team) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      const token = jwt.sign(
        { _id: Team.id },
        process.env.SECRET_KEY || "nngame",
        {
          algorithm: "HS256"
        }
      );
      return token;
    },
    {
      logMessage: `${EntityName} method error`
    }
  )
};

export default methods;
