import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import AdminCtrl from "../controllers";
import { routePath, paths } from "../constants";
import { login, create } from "../docs";
import Joi from "joi";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: AdminCtrl.create,
    options: {
      ...create,
      auth: "admin-auth",
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          isNumeric: Joi.boolean().required(),
          numericAnswer: Joi.number(),
          answers: Joi.array().items(
            Joi.object({
              title: Joi.string().required(),
              isRight: Joi.boolean().required()
            })
          )
        })
      }
    }
  }
];

export default routes;
