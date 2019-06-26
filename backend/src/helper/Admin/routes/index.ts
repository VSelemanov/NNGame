import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import AdminCtrl from "../controllers";
import { routePath, paths } from "../constants";
import { login, create } from "../docs";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: AdminCtrl.create,
    options: {
      ...create
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.login}`,
    method: HTTPMethods.post,
    handler: AdminCtrl.login,
    options: {
      ...login
    }
  }
];

export default routes;
