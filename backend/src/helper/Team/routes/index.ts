import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import TeamCtrl from "../controllers";
import { routePath, paths } from "../constants";

import { login, create } from "../docs";
import Joi from "joi";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.create,
    options: {
      ...create,
      validate: {
        payload: Joi.object({
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
          name: Joi.string().required()
        })
      }
    }
  }
];

export default routes;
