import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import TeamCtrl from "../controllers";
import { routePath, paths } from "../constants";

import { create, login, colorZone, response } from "../docs";
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
    method: HTTPMethods.post,
    handler: TeamCtrl.colorZone,
    options: {
      ...colorZone,
      auth: "team-auth"
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.response}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.response,
    options: {
      ...response,
      auth: "team-auth",
      validate: {
        payload: Joi.object({
          response: Joi.number().required(),
          timer: Joi.number().required()
        })
      }
    }
  }
];

export default routes;
