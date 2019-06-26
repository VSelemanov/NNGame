import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import GameRoomCtrl from "../controllers";
import { routePath, paths } from "../constants";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: GameRoomCtrl.create
  },
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.read
  },
  {
    path: `${APIRoute}/${routePath}/{roomNumber}/${paths.connect}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.connect,
    options: {
      auth: "team-auth"
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.gameStatus}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.getGameStatus,
    options: {
      auth: "game-room-auth"
    }
  }
];

export default routes;
