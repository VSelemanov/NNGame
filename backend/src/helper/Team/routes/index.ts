import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import TeamCtrl from "../controllers";
import { routePath, paths } from "../constants";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: TeamCtrl.create
  },
  {
    path: `${APIRoute}/${routePath}/${paths.login}`,
    method: HTTPMethods.get,
    handler: TeamCtrl.login
  }
];

export default routes;
