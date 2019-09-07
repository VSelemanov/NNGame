import { ServerRoute } from "@hapi/hapi";
import { APIRoute, HTTPMethods, teams } from "../../../constants";
import RoomCtrl from "../controllers";
import { routePath, paths } from "../constants";
import { create } from "../docs";
import Joi from "@hapi/joi";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: RoomCtrl.create,
    options: {
      ...create,
      auth: "admin-auth",
      validate: {
        payload: Joi.object({
          theme: Joi.string()
            .required()
            .allow([null]),
          [teams.team1]: Joi.string().required(),
          [teams.team2]: Joi.string().required(),
          [teams.team3]: Joi.string().required()
        })
      }
    }
  }
];

export default routes;
