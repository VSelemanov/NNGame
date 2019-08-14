import { When, Then, Given } from "cucumber";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods, teams } from "../../src/constants";
import { routePath, paths } from "../../src/helper/Team/constants";
import { Authorization } from "./constants";
import {
  ITeamBase,
  ITeamResponsePart1
} from "../../src/helper/Team/interfaces";
import {
  setResponse,
  getResponse,
  setSocketResponse,
  getSocketResponse
} from "./lib/response";
import { expect } from "chai";

import {
  routePath as RoomPath,
  paths as RoomPaths,
  subscriptionGameStatuspath
} from "../../src/helper/Room/constants";
import { getGameToken, getActiveRoom, getTeam, getAdminLogin } from "./default";
import { IGameStatus } from "../../src/helper/Room/interfaces";
import TeamMethods from "../../src/helper/Team";
import { client } from "./default";

When("я делаю запрос на создание новой команды {string}", async function(name) {
  const token = await getAdminLogin("admin", "admin");
  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}`,
    method: HTTPMethods.post,
    headers: {
      Authorization: token
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

When("я делаю запрос на получения списка команд", async function() {
  const token = await getAdminLogin("admin", "admin");
  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}`,
    method: HTTPMethods.get,
    headers: {
      Authorization: token
    }
  });

  setResponse(res);
});

Then("в ответе должен быть массив команд с комнадой {string}", async function(
  teamName
) {
  const res = getResponse().result;

  expect(res).length.greaterThan(0);
  expect(res[0].name).to.eql(teamName);
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
      setSocketResponse(message);
    });
  }
);

When("отправляю сервером событие", async function() {
  const Room = await getActiveRoom();
  await server._server.publish(subscriptionGameStatuspath, Room.gameStatus);
});

Then("команда {string} получит сообщение из сокета", async function(TeamName) {
  const res: IGameStatus = getSocketResponse();
  await client.disconnect();

  expect(res).have.property("teams");
  expect(res).have.property("gameMap");
  expect(res).have.property("part1");
  expect(res).have.property("part2");
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
  "в сокете должно быть новое состояние игры с занятой зоной {string} командой {string} и увеличенным счетчиком",
  async function(zoneKey, teamName) {
    const res: IGameStatus = getSocketResponse();
    await client.disconnect();

    const Team = await getTeam(teamName);

    const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

    expect(res).have.property("teams");
    expect(res).have.property("part1");
    expect(res).have.property("part2");
    expect(res).have.property("currentPart");
    expect(res).have.property("gameMap");

    expect(res.gameMap[zoneKey].team).to.eql(teamKey);
    expect(res.teams[teamKey].zones).to.eql(1);
  }
);

When(
  "команда {string} отвечает на числовой вопрос ответ = {int} таймер = {int}",
  async function(teamName: string, response: number, timer: number) {
    const token = await getGameToken(teamName);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.response}`,
      headers: {
        Authorization: token
      },
      payload: {
        timer: response !== 111 ? timer : 60,
        response: response !== 111 ? response : null
      }
    });

    setResponse(res);
  }
);

Then("в сокете состояние игры с ответом от команды {string}", async function(
  teamName: string
) {
  const res: IGameStatus = getSocketResponse();

  await client.disconnect();
  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);
  const teamResponse: ITeamResponsePart1 =
    res.part1.steps[res.part1.currentStep || 0].responses[teamKey];
  expect(teamResponse.response).not.null;
  expect(teamResponse.timer).not.null;
});

Then(
  "в сокете состояние игры со следующими результатами по выбору доступных зон:",
  async function(dataTable) {
    const res: IGameStatus = getSocketResponse();

    const allowZones = res.part1.steps[res.part1.currentStep || 0].allowZones;

    for (const row of dataTable.hashes() as IAllowZoneForTeam[]) {
      expect(allowZones[row.teamKey]).to.eql(+row.allowZones);
    }

    const queueLength =
      res.part1.steps[res.part1.currentStep || 0].teamQueue.length;

    if (queueLength === 2) {
      expect(res.part1.steps[res.part1.currentStep || 0].teamQueue[0]).to.eql(
        "team2"
      );
      expect(res.part1.steps[res.part1.currentStep || 0].teamQueue[1]).to.eql(
        "team1"
      );
    } else if (queueLength === 1) {
      expect(res.part1.steps[res.part1.currentStep || 0].teamQueue[0]).to.eql(
        "team2"
      );
    }
  }
);

When(
  "команда {string} делает атаку из зоны {string} на зону {string}",
  async function(teamName, attackingZone, defenderZone) {
    const token = await getGameToken(teamName);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.attack}`,
      headers: {
        Authorization: token
      },
      payload: {
        attackingZone,
        defenderZone
      }
    });

    setResponse(res);
  }
);

Then(
  "в сокете установлены зоны атаки и обороны, атакующие и защищающиеся команды",
  async function() {
    const res: IGameStatus = getSocketResponse();
    await client.disconnect();

    const step = res.part2.steps[res.part2.steps.length - 1];

    expect(step.attacking).not.empty;
    expect(step.defender).not.empty;
    expect(step.attackingZone).not.empty;
    expect(step.defenderZone).not.empty;
    expect(step.question).not.empty;
  }
);

interface IAllowZoneForTeam {
  teamKey: string;
  allowZones: number;
}

When(
  "команда {string} отвечает на вариативный вопрос в дуэли и дает вариант ответа {int}",
  async function(teamName, response) {
    const token = await getGameToken(teamName);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.response}`,
      headers: {
        Authorization: token
      },
      payload: {
        response
      }
    });

    setResponse(res);
  }
);

Then(
  "в сокете в ответе атакующего должен появиться ответ {int}",
  async function(attackinResponse) {
    const res: IGameStatus = getSocketResponse();
    await client.disconnect();

    expect(
      res.part2.steps[res.part2.steps.length - 1].attackingResponse
    ).to.eql(attackinResponse);
  }
);

Then("в сокете в ответе победитель будет команда {string}", async function(
  teamName: string
) {
  const res: IGameStatus = getSocketResponse();
  // await client.disconnect();

  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  expect(res.part2.steps[res.part2.steps.length - 1].winner).to.eql(teamKey);
});

Then("зона {string} переходит во владения команды {string}", async function(
  zoneKey: string,
  teamName: string
) {
  const res: IGameStatus = getSocketResponse();
  // await client.disconnect();

  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  expect(res.gameMap[zoneKey].team).to.eql(teamKey);
});

Then("команда {string} удалена из очереди команд в дуэлях", async function(
  teamName
) {
  const res: IGameStatus = getSocketResponse();
  // await client.disconnect();

  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  expect(res.part2.teamQueue.includes(teamKey)).to.eql(false);
});

Then("в сокете в ответе победителя не будет", async function() {
  const res: IGameStatus = getSocketResponse();
  await client.disconnect();

  expect(res.part2.steps[res.part2.steps.length - 1].winner).to.eql("none");
});

Then("в сокете в ответе будет ничья", async function() {
  const res: IGameStatus = getSocketResponse();

  expect(res.part2.steps[res.part2.steps.length - 1].winner).to.eql("draw");
});

Then("в сокете во втором туре появился числовой вопрос", async function() {
  const res: IGameStatus = getSocketResponse();

  expect(res.part2.steps[res.part2.steps.length - 1].numericQuestion).not.eql(
    undefined
  );
});

Then(
  "команда {string} отвечает на числовой вопрос в дуэли r={int} и t={int}",
  async function(teamName: string, response: number, timer: number) {
    const token = await getGameToken(teamName);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.response}`,
      headers: {
        Authorization: token
      },
      payload: {
        timer: response !== 111 ? timer : 60,
        response: response !== 111 ? response : null
      }
    });

    setResponse(res);
  }
);

When("команда {string} делает запрос на захват зоны {string}", async function(
  teamName,
  zoneKey
) {
  const token = await getGameToken(teamName);

  const res = await server.server.inject({
    method: HTTPMethods.post,
    url: `${APIRoute}/${routePath}/${paths.zone}/${zoneKey}`,
    headers: {
      Authorization: token
    }
  });

  setResponse(res);
});

Then("в сокете зона {string} принадлежит команде {string}", async function(
  zoneKey,
  teamName
) {
  const res: IGameStatus = getSocketResponse();
  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  expect(res.gameMap[zoneKey].team).to.eql(teamKey);
});

Then("счетчик зон доступных для команды {string} равен {int}", async function(
  teamName: string,
  zones
) {
  const res: IGameStatus = getSocketResponse();
  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  expect(
    res.part1.steps[res.part1.currentStep || 0].allowZones[teamKey]
  ).to.eql(zones);
});

Then("команды {string} нет в очереди на текущем шаге", async function(
  teamName: string
) {
  const res: IGameStatus = getSocketResponse();
  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  expect(
    res.part1.steps[res.part1.currentStep || 0].teamQueue.includes(teamKey)
  ).to.eql(false);
});

Then("закрываем соединение по сокету", async function() {
  await client.disconnect();
});
