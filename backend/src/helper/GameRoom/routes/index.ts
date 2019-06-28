import { ServerRoute } from "hapi";
import { APIRoute, HTTPMethods } from "../../../constants";
import GameRoomCtrl from "../controllers";
import { routePath, paths } from "../constants";

import {
  create,
  read,
  connect,
  gameStatus,
  start,
  showQuestion,
  startQuestion
} from "../docs";
import Joi, { validate } from "joi";

const routes: ServerRoute[] = [
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    handler: GameRoomCtrl.create,
    options: {
      ...create,
      validate: {
        payload: Joi.object({
          theme: Joi.string()
            .required()
            .allow(null),
          adminId: Joi.string().required()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.read,
    options: {
      ...read,
      validate: {
        query: Joi.object({
          isActive: Joi.bool()
        })
      }
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
      },
      validate: {
        params: Joi.object({
          roomId: Joi.string().required()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.gameStatus}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.getGameStatus,
    options: {
      ...gameStatus,
      auth: {
        strategies: ["game-room-auth", "admin-auth"]
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.showQuestion}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.showQuestion,
    options: {
      ...showQuestion,
      auth: "admin-auth",
      validate: {
        query: Joi.object({
          isNumeric: Joi.bool().required()
        })
      }
    }
  },
  {
    path: `${APIRoute}/${routePath}/${paths.showQuestion}/${paths.start}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.startQuestion,
    options: {
      ...startQuestion,
      auth: "admin-auth"
    }
  },
  {
    path: `${APIRoute}/${routePath}/{roomId}/${paths.start}`,
    method: HTTPMethods.get,
    handler: GameRoomCtrl.start,
    options: {
      ...start,
      auth: "admin-auth",
      validate: {
        params: Joi.object({
          roomId: Joi.string().required()
        })
      }
    }
  }
];

export default routes;
