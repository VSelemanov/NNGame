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
import {
  IGameRoomBase,
  IGameStatus,
  IGameRoom,
  ITeamResponse
} from "../../src/helper/GameRoom/interfaces";
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
    expect(res[0].gameStatus).have.property("part1");
    expect(res[0].gameStatus).have.property("gameMap");
    expect(Object.keys(res[0].gameStatus.gameMap).length).to.eql(15);
  }
);

When("я делаю запрос получения списка комнат", async function() {
  const res = await server.server.inject({
    url: `${APIRoute}/${GameRoomPath}?isActive=true`,
    method: HTTPMethods.get,
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then("в ответе должна быть комната", async function() {
  const res: IGameRoom[] = getResponse().result;

  expect(res).length.greaterThan(0, "GameRooms are empty");
});

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
  const response: IGameRoom = getResponse().result;
  expect(response.gameStatus.teams.team1).have.property("_id");
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

  expect(res).have.property("gameMap");
  expect(res).have.property("isActive");
  expect(res).have.property("isStarted");
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

When(
  "я делаю запрос на получение статуса комнаты от лица администратора l={string} p={string}",
  async function(name: string, password: string) {
    const token = await getAdminLogin(name, password);

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

When(
  "администратор l={string} p={string} делает запрос на показ вопроса",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${
        GameRoomPaths.showQuestion
      }?isNumeric=true`,
      method: HTTPMethods.get,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setResponse(res);
  }
);

Then(
  "в ответе состояние игры с первым вопросом и флагом скрыть ответы",
  async function() {
    const gameStatus: IGameStatus = getResponse().result;

    expect(gameStatus).have.property("part1");
    expect(gameStatus.part1).length.greaterThan(0);
    expect(gameStatus.part1[0]).have.property("question");
    expect(gameStatus.part1[0].question).have.property("_id");
    expect(gameStatus.part1[0]).have.property("isTimerStarted");
    expect(gameStatus.part1[0].isTimerStarted).to.eql(false);
    expect(gameStatus.part1[0].results.length).to.eql(0);
  }
);

When(
  "администратор l={string} p={string} дает возможность ответить на вопрос",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${GameRoomPaths.showQuestion}/${
        GameRoomPaths.start
      }`,
      method: HTTPMethods.get,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setResponse(res);
  }
);

Then(
  "в ответе состояние игры с первым вопросом и флагом показать ответы",
  async function() {
    const gameStatus: IGameStatus = getResponse().result;

    expect(gameStatus).have.property("part1");
    expect(gameStatus.part1).length.greaterThan(0);
    expect(gameStatus.part1[0]).have.property("question");
    expect(gameStatus.part1[0].question).have.property("_id");
    expect(gameStatus.part1[0]).have.property("isTimerStarted");
    expect(gameStatus.part1[0].isTimerStarted).to.eql(true);
    expect(gameStatus.part1[0].results.length).to.eql(0);
  }
);

When("команда {string} делает запрос на отправку ответа", async function(
  teamName
) {
  const token = await getGameToken(teamName);

  const res = await server.server.inject({
    url: `${APIRoute}/${GameRoomPath}/${GameRoomPaths.showQuestion}/${
      GameRoomPaths.response
    }`,
    method: HTTPMethods.post,
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: {
      response: 70,
      timer: 6
    }
  });

  setResponse(res);
});

Then("в ответе состояние игры с ответом на первый вопрос", function() {
  const res: IGameStatus = getResponse().result;

  expect(res).have.property("part1");
  expect(res.part1).length.greaterThan(0);
  expect(res.part1[0]).have.property("results");
  expect(res.part1[0].results).length.greaterThan(0);
});
