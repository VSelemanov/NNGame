import { Given, BeforeAll, AfterAll, Then } from "cucumber";
import { server } from "../../src/server";
import { expect } from "chai";
import utils from "../../src/utils";
import { getResponse } from "./lib/response";
import { APIRoute, HTTPMethods } from "../../src/constants";
import { routePath as TeamRoutePath } from "../../src/helper/Team/constants";
import { routePath as AdminRoutePath } from "../../src/helper/Admin/constants";
import { routePath as GameRoomRoutePath } from "../../src/helper/GameRoom/constants";
import { paths as TeamPaths } from "../../src/helper/Team/constants";
import { paths as AdminPaths } from "../../src/helper/Admin/constants";
import {
  paths as GameRoomPaths,
  ErrorMessages
} from "../../src/helper/GameRoom/constants";
import { Authorization } from "./constants";
import { IAdminBase } from "../../src/helper/Admin/interfaces";

let ServerStarted = false;

export async function getLogin(name: string): Promise<string> {
  const res = await server.server.inject({
    url: `${APIRoute}/${TeamRoutePath}/${TeamPaths.login}`,
    method: HTTPMethods.post,
    payload: { name },
    headers: { Authorization }
  });
  return res.result as any;
}

export async function getAdminLogin(
  name: string,
  password: string
): Promise<string> {
  const res = await server.server.inject({
    url: `${APIRoute}/${AdminRoutePath}/${AdminPaths.login}`,
    method: HTTPMethods.post,
    headers: {
      Authorization
    },
    payload: {
      name,
      password
    } as IAdminBase
  });
  return res.result as any;
}

export async function getGameToken(teamName: string): Promise<string> {
  const GameRoom = await server.GameRoom.findOne();
  if (!GameRoom) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  const token = await getLogin(teamName);

  const res = await server.server.inject({
    url: `${APIRoute}/${GameRoomRoutePath}/${GameRoom._id}/${
      GameRoomPaths.connect
    }`,
    method: HTTPMethods.get,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return (res.result as any).gameToken;
}

BeforeAll(async () => {
  await server.start();
  ServerStarted = true;
});

AfterAll(async () => {
  await server.stop();
});

Given("сервер стартовал", function() {
  expect(ServerStarted).to.eql(true);
});

Given("база данных пуста", async function() {
  await utils.truncateCollection(server.Admin.collection);
  await utils.truncateCollection(server.GameRoom.collection);
  await utils.truncateCollection(server.Team.collection);
  await utils.truncateCollection(server.Question.collection);
});

Then("сервер должен вернуть статус {int}", function(code) {
  const res = getResponse();
  expect(res.statusCode).to.eql(code);
});
