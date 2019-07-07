import { When, Then, Given } from "cucumber";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods, teams } from "../../src/constants";
import { routePath, paths } from "../../src/helper/Team/constants";
import { Authorization } from "./constants";
import { ITeamBase } from "../../src/helper/Team/interfaces";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import { string } from "joi";

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

  console.log({ jwt });

  expect(typeof jwt).to.eql("string");
});
