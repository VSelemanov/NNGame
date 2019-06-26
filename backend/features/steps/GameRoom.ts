import { When, Then } from "cucumber";
import { getAdmin } from "./lib";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods } from "../../src/constants";
import {
  routePath as GameRoomPath,
  paths as GameRoomPaths
} from "../../src/helper/GameRoom/constants";
import {
  routePath as AdminPath,
  paths as AdminPaths
} from "../../src/helper/Admin/constants";

import { Authorization } from "./constants";
import { IGameRoomBase } from "../../src/helper/GameRoom/interfaces";
import { ErrorMessages } from "../../src/helper/GameRoom/constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import methods from "../../src/helper/GameRoom";
import { getLogin, getGameToken, getAdminLogin } from "./default";

let roomNumber;

When("администратор создает новую игровую комнату", async function() {
  const admin = await getAdmin("admin");
  if (!admin) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  const res = await server.server.inject({
    url: `${APIRoute}/${GameRoomPath}`,
    method: HTTPMethods.post,
    headers: {
      Authorization
    },
    payload: {
      adminId: admin._id,
      theme: null
    } as IGameRoomBase
  });

  setResponse(res);
});

Then(
  "в списке комнат должна появиться новая активная комната",
  async function() {
    const res = await server.GameRoom.find({ "gameStatus.isActive": true });
    expect(res).length.greaterThan(0);
  }
);

When("я хочу получить номер следующей комнаты", async function() {
  roomNumber = await methods.getNextRoomNumber();
});

Then("в ответе должен быть {int}", function(expRoomNumber) {
  expect(roomNumber).to.eql(expRoomNumber);
});

When(
  "я отправляю запрос на вход в комнату от лица команды {string}",
  async function(TeamName) {
    const GameRoom = await server.GameRoom.findOne();
    if (!GameRoom) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }
    const token = await getLogin(TeamName);

    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${GameRoom._id}/${
        GameRoomPaths.connect
      }`,
      method: HTTPMethods.get,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setResponse(res);
  }
);

Then("в ответе есть текущее состояние игры с игровым токеном", function() {
  const response = getResponse().result;
  expect(response).have.property("gameToken");
  expect(response).have.property("gameStatus");
});

Then("в текущем состоянии игры появилась команда", function() {
  const response = getResponse().result;
  expect(response.gameStatus.teams).length.greaterThan(0);
});

When(
  "я делаю запрос на получение статуса комнаты от команды {string}",
  async function(teamName: string) {
    const token = await getGameToken(teamName);
    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${GameRoomPaths.gameStatus}`,
      method: HTTPMethods.get,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setResponse(res);
  }
);

Then("в ответе должен быть объект с полем состояния игры", async function() {
  const res = getResponse().result;

  expect(res).have.property("gameStatus");
});

When(
  "я отправляю запрос на вход в комнату от лица администратора l={string} p={string}",
  async function(name, password) {
    const GameRoom = await server.GameRoom.findOne();
    if (!GameRoom) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }
    const token = await getAdminLogin(name, password);
    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${GameRoom._id}/${
        GameRoomPaths.connect
      }`,
      method: HTTPMethods.get,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setResponse(res);
  }
);

Then("в ответе есть текущее состояние игры", function() {
  const res = getResponse().result;

  expect(res).have.property("gameStatus");
});

When(
  "администратор l={string} p={string} делает запрос на запуск игры",
  async function(name, password) {
    const GameRoom = await server.GameRoom.findOne();
    if (!GameRoom) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }

    const token = await getAdminLogin(name, password);

    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${GameRoom._id}/${GameRoomPaths.start}`,
      method: HTTPMethods.get,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setResponse(res);
  }
);

Then("в ответе состояние игры с флагом запущенной игры", async function() {
  const res = getResponse().result;

  expect(res).have.property("gameStatus");
  expect(res.gameStatus).have.property("isStarted");
  expect(res.gameStatus.isStarted).to.eql(true);
});
