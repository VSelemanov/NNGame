import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import TeamCtrl from "../controllers";
import { routePath, paths } from "../constants";

import { create, login, colorZone } from "../docs";
import Joi from "@hapi/joi";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.create,
    options: {
      ...create,
      validate: {
        payload: Joi.object().keys({
          name: Joi.string().required()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.login}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.login,
    options: {
      ...login,
      validate: {
        payload: Joi.object({
          inviteCode: Joi.string().required()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.zone}/{zoneKey}`,
    method: HTTPMethods.get,
    handler: TeamCtrl.zone,
    options: {
      ...colorZone,
      auth: "team-auth"
    }
  }
];

export default routes;
