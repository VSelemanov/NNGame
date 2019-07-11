import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import AdminCtrl from "../controllers";
import { routePath, paths } from "../constants";
import { login, create, colorZone, startGame } from "../docs";
import Joi from "@hapi/joi";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: AdminCtrl.create,
    options: {
      ...create,
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          password: Joi.string().required()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.login}`,
    method: HTTPMethods.post,
    handler: AdminCtrl.login,
    options: {
      ...login,
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          password: Joi.string().required()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.zone}`,
    method: HTTPMethods.post,
    handler: AdminCtrl.colorZone,
    options: {
      ...colorZone,
      validate: {
        payload: Joi.object({
          _id: Joi.string().required(),
          zone: Joi.string().required()
        })
      },
      auth: "admin-auth"
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.startgame}`,
    method: HTTPMethods.post,
    handler: AdminCtrl.startgame,
    options: {
      ...startGame,
      auth: "admin-auth"
    }
  }
];

export default routes;
