import { When, Then } from "cucumber";
import { getAdmin } from "./lib";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods } from "../../src/constants";
import { routePath, paths } from "../../src/helper/GameRoom/constants";
import { Authorization } from "./constants";
import { IGameRoomBase } from "../../src/helper/GameRoom/interfaces";
import { ErrorMessages } from "../../src/helper/GameRoom/constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import methods from "../../src/helper/GameRoom";

let roomNumber;

When("администратор создает новую игровую комнату", async function() {
  const admin = await getAdmin("admin");
  if (!admin) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}`,
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
    const res = await server.GameRoom.find({ gameStatus: { isActive: true } });
    expect(res).length.greaterThan(0);
  }
);

When("я хочу получить номер следующей комнаты", async function() {
  roomNumber = await methods.getNextRoomNumber();
});

Then("в ответе должен быть {int}", function(expRoomNumber) {
  expect(roomNumber).to.eql(expRoomNumber);
});

When("я отправляю запрос на вход в комнату", async function() {
  const GameRoom = await server.GameRoom.findOne();
  if (!GameRoom) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}/${GameRoom.roomNumber}/${paths.connect}?`,
    method: HTTPMethods.get,
    headers: {
      Authorization
    }
  });

  setResponse(res);
});

Then("в ответе есть текущее состояние игры с игровым токеном", function() {
  const response = getResponse().result;
  expect(response).have.property("gameToken");
  expect(response).have.property("gameStatus");
});

Then("в текущем состоянии игры появилась команда", function() {
  const response = getResponse().result;
  expect(response.gameStatus.teams).length.greaterThan(0);
});
