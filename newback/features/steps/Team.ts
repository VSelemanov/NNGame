import { When, Then, Given } from "cucumber";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods, teams } from "../../src/constants";
import { routePath, paths } from "../../src/helper/Team/constants";
import { Authorization } from "./constants";
import { ITeamBase } from "../../src/helper/Team/interfaces";
import {
  setResponse,
  getResponse,
  setStreamResponse,
  getStreamResponse
} from "./lib/response";
import { expect } from "chai";
import Nes from "@hapi/nes";
import { Client } from "nes";

import {
  routePath as RoomPath,
  paths as RoomPaths,
  subscriptionGameStatuspath
} from "../../src/helper/Room/constants";
import { getGameToken, getActiveRoom, getTeam } from "./default";
import { IGameStatus } from "../../src/helper/Room/interfaces";
import TeamMethods from "../../src/helper/Team";

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
  const Room = await getActiveRoom();

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
    await client.subscribe(subscriptionGameStatuspath, (message, flags) => {
      setStreamResponse(message);
    });
  }
);

When("отправляю сервером событие", async function() {
  const Room = await getActiveRoom();
  await server._server.publish(subscriptionGameStatuspath, Room.gameStatus);
});

Then("команда {string} получит сообщение из сокета", async function(TeamName) {
  const res: IGameStatus = getStreamResponse();

  expect(res).have.property("teams");
  expect(res).have.property("gameMap");
  expect(res).have.property("part1");
  expect(res).have.property("part2");

  await client.disconnect();
});

When(
  "команда {string} делает запрос на выбор стартовой зоны {string}",
  async function(teamName: string, zoneKey: string) {
    const Team = await getTeam(teamName);
    const token = await getGameToken(teamName);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.zone}/${zoneKey}`,
      headers: {
        Authorization: token
      }
    });

    setResponse(res);
  }
);

Then(
  "в сокете должно быть новое состояние игры с занятой зоной {string} командой {string}",
  async function(zoneKey, teamName) {
    const res: IGameStatus = getStreamResponse();

    const Team = await getTeam(teamName);

    expect(res).have.property("teams");
    expect(res).have.property("part1");
    expect(res).have.property("part2");
    expect(res).have.property("currentPart");
    expect(res).have.property("gameMap");

    expect(res.gameMap[zoneKey].team).to.eql(
      await TeamMethods.getTeamLinkInGame(Team._id)
    );

    await client.disconnect();
  }
);
