import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import GameRoomCtrl from "../controllers";
import { routePath, paths } from "../constants";

import { create, read, connect, gameStatus, start } from "../docs";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: GameRoomCtrl.create,
    options: {
      ...create
    }
  },
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.read,
    options: {
      ...read
    }
  },
  {
    path: `${APIRoute}/${routePath}/{roomId}/${paths.connect}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.connect,
    options: {
      ...connect,
      auth: {
        strategies: ["team-auth", "admin-auth"]
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.gameStatus}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.getGameStatus,
    options: {
      ...gameStatus,
      auth: "game-room-auth"
    }
  },
  {
    path: `${APIRoute}/${routePath}/{roomId}/${paths.start}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.start,
    options: {
      ...start,
      auth: "admin-auth"
    }
  }
];

export default routes;
