import { APIRoute } from "../constants/index";
import Boom from "boom";
// routes
import AdminRoutes from "../helper/Admin/routes";
import RoomRoutes from "../helper/Room/routes";
import TeamRoutes from "../helper/Team/routes";
import QuestionRoutes from "../helper/Question/routes";
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
  {
    method: "GET",
    path: `${APIRoute}/socket`,
    handler: () => {
      return "ok";
    },
    options: {
      auth: false
    }
  },
  ...AdminRoutes,
  ...RoomRoutes,
  ...TeamRoutes,
  ...QuestionRoutes
];

export default Routes;
