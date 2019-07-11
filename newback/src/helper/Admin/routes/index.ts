import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import AdminCtrl from "../controllers";
import { routePath, paths } from "../constants";
import { login, create } from "../docs";
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
  }
];

export default routes;
