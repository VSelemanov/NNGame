import { When, Then, Given } from "cucumber";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods, teams } from "../../src/constants";
import { routePath, paths } from "../../src/helper/Team/constants";
import { Authorization } from "./constants";
import { ITeamBase } from "../../src/helper/Team/interfaces";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import Nes from "@hapi/nes";
import { Client } from "nes";

import {
  routePath as RoomPath,
  paths as RoomPaths
} from "../../src/helper/Room/constants";
import { getGameToken } from "./default";

const client: Client = new Nes.Client("ws://localhost:3000");

When("я делаю запрос на создание новой команды {string}", async function(name) {
  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    headers: {
      Authorization
    },
    payload: {
      name
    } as ITeamBase
  });

  setResponse(res);
});

Then("в списке команд должна быть команда {string}", async function(name) {
  const Teams = await server.Team.find({});

  expect(Teams).length.greaterThan(0, "Teams are empty");
  expect(Teams[0].name).to.eql(name);
});

When("я делаю запрос на авторизацию команды {string}", async function(name) {
  const Room = (await server.Room.find({
    isActive: true,
    isStarted: false
  }))[0];
  const teamsInGame = Room.gameStatus.teams;
  if (!teamsInGame) {
    throw new Error("Teams is null");
  }
  let inviteCode = "000000";
  for (const key of Object.keys(teams)) {
    if (teamsInGame[key].name === name) {
      inviteCode = teamsInGame[key].inviteCode;
    }
  }

  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}/${paths.login}`,
    method: HTTPMethods.post,
    payload: { inviteCode },
    headers: { Authorization }
  });

  setResponse(res);
});

Then("в ответе должен быть jwt токен команды", async function() {
  const jwt = getResponse().result;

  expect(typeof jwt).to.eql("string");
});

When(
  "я подписываюсь на обновление состояния игры командой {string}",
  async function(TeamName) {
    // const token = await getGameToken(TeamName);

    await client.connect({
      auth: { headers: { Authorization: `Bearer ${process.env.APP_TOKEN}` } }
    });
    await client.subscribe(
      `${APIRoute}/${RoomPath}/${RoomPaths.gameStatus}`,
      (message, flags) => {
        setResponse({ message, TeamName });
      }
    );
  }
);

When("отправляю сервером событие", async function() {
  await server._server.publish(
    `${APIRoute}/${RoomPath}/${RoomPaths.gameStatus}`,
    "hello"
  );
});

Then("команда {string} получит сообщение из сокета", async function(TeamName) {
  const res = getResponse();

  expect(res).have.property("message");
  expect(res).have.property("TeamName");
  expect(res.message).to.eql("hello");
  expect(res.TeamName).to.eql(TeamName);

  await client.disconnect();
});
