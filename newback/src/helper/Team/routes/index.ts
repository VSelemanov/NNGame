import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import TeamCtrl from "../controllers";
import { routePath, paths } from "../constants";

import { create, login, colorZone, response, attack, read } from "../docs";
import Joi from "@hapi/joi";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.get,
    handler: TeamCtrl.read,
    options: {
      ...read,
      auth: "admin-auth"
    }
  },
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.create,
    options: {
      ...create,
      auth: "admin-auth",
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
          response: Joi.number()
            .required()
            .allow(null),
          timer: Joi.number()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.attack}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.attack,
    options: {
      ...attack,
      auth: "team-auth",
      validate: {
        payload: Joi.object({
          attackingZone: Joi.string().required(),
          defenderZone: Joi.string().required()
        })
      }
    }
  }
];

export default routes;
