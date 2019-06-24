import { mainURI } from "../constants/index";
import Boom from "boom";
// interfaces
import { ServerRoute } from "hapi";
// controllers
const Routes: ServerRoute[] = [
  {
    method: "GET",
    path: `${mainURI}/testSystem`,
    handler: () => {
      return "ok";
    },
    options: {
      auth: false
    }
  }
];

export default Routes;
