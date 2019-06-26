import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import TeamCtrl from "../controllers";
import { routePath, paths } from "../constants";

import { login, create } from "../docs";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.create,
    options: {
      ...create
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.login}`,
    method: HTTPMethods.get,
    handler: TeamCtrl.login,
    options: {
      ...login
    }
  }
];

export default routes;
