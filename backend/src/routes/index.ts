import { APIRoute } from "../constants/index";
import Boom from "boom";
// routes
import AdminRoutes from "../helper/Admin/routes";
import GameRoomRoutes from "../helper/GameRoom/routes";
// interfaces
import { ServerRoute } from "hapi";
// controllers
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${APIRoute}/testSystem`,
    handler: () => {
      return "ok";
    },
    options: {
      auth: false
    }
  },
  ...AdminRoutes,
  ...GameRoomRoutes
];

export default Routes;
