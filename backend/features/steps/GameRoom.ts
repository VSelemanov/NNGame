import { When, Then, Given } from "cucumber";
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
import { ErrorMessages as TeamErrorMessages } from "../../src/helper/Team/constants";
import { setResponse, getResponse } from "./lib/response";
import { expect } from "chai";
import methods from "../../src/helper/GameRoom";
import { getLogin, getGameToken, getAdminLogin } from "./default";
import { gameStatus } from "../../src/helper/GameRoom/docs";
import { ITeam } from "../../src/helper/Team/interfaces";

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
  "я делаю запрос на присваивание зоны {string} командой {string}",
  async function(zoneName, teamName) {
    const token = await getGameToken(teamName);

    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${GameRoomPaths.map}/${
        GameRoomPaths.zone
      }`,
      method: HTTPMethods.post,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        zoneName
      }
    });

    setResponse(res);
  }
);

Then(
  "в состоянии игры на карте зона {string} закрашивается цветом команды {string}",
  async function(zoneName: string, teamName: string) {
    const gameStatus: IGameStatus = getResponse().result;
    const Team = await server.Team.findOne({ name: teamName });
    if (!Team) {
      throw new Error(TeamErrorMessages.NOT_FOUND);
    }

    expect(gameStatus).have.property("gameMap");
    expect(gameStatus.gameMap).have.property(zoneName);
    expect(gameStatus.gameMap[zoneName].teamId).to.eql(Team._id);
  }
);

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

When(
  "команда {string} делает запрос на отправку ответа r={int} t={int}",
  async function(teamName, response, timer) {
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
        response,
        timer
      }
    });

    setResponse(res);
  }
);

Then("в ответе состояние игры с ответом на первый вопрос", function() {
  const res: IGameStatus = getResponse().result;

  expect(res).have.property("part1");
  expect(res.part1).length.greaterThan(0);
  expect(res.part1[0]).have.property("results");
  expect(res.part1[0].results).length.greaterThan(0);
});

Then(
  "в состоянии игры проставлены следующие количества возможных зон:",
  async function(dataTable) {
    const res: IGameStatus = getResponse().result;
    for (const row of dataTable.hashes()) {
      const Team = await server.Team.findOne({ name: row.TeamName });
      if (!Team) {
        throw new Error(ErrorMessages.NOT_FOUND);
      }
      const TeamResult = res.part1[0].results.filter(
        r => r.teamId === Team._id
      );
      if (TeamResult.length === 0) {
        throw new Error("У команды нет результата");
      }

      expect(TeamResult[0].allowZones).to.eql(+row.allowZones);
    }
  }
);

Given("все зоны закрашены командами в следующем количестве:", async function(
  dataTable
) {
  const GameRoom = await server.GameRoom.findOne();
  let offset = 0;
  if (!GameRoom) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  for (const row of dataTable.hashes()) {
    const Team = await server.Team.findOne({ name: row.TeamName });
    if (!Team) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }
    const zones = Object.keys(GameRoom.gameStatus.gameMap);
    for (let i = offset; i < +row.Zones + offset; i++) {
      await methods.zoneCapture(GameRoom._id, Team._id, zones[i]);
    }
    offset += +row.Zones;
  }
});

When(
  "происходит запрос статуса при полностью закрашенной карте",
  async function() {
    const token = await getGameToken("команда1");
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

Then("в ответе счетчик туров изменяется на {int}", function(currentPart) {
  const res: IGameStatus = getResponse().result;

  expect(res.currentPart).to.eql(currentPart);
});

Then(
  "в ответе сформирована очередь ходов в порядке {string} {string} {string}",
  async function(team1: string, team3: string, team2: string) {
    const res: IGameStatus = getResponse().result;
    const teamNames: string[] = [team1, team3, team2];

    expect(res).have.property("part2");

    expect(res.part2).have.property("teamQueue");
    expect(res.part2.teamQueue).length.greaterThan(
      0,
      "teamQueue array is empty"
    );

    for (let i = 0; i < 3; i++) {
      expect(res.part2.teamQueue[i].name).to.eql(teamNames[i]);
    }
  }
);

When("{string} нападает из {string} на {string}", async function(
  TeamName: string,
  attackingZone: string,
  deffenderZone: string
) {
  const token = await getGameToken(TeamName);

  const res = await server.server.inject({
    url: `${APIRoute}/${GameRoomPath}/${GameRoomPaths.attack}`,
    method: HTTPMethods.post,
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: {
      attackingZone,
      deffenderZone
    }
  });

  setResponse(res);
});

Then("в ответе должен быть новый шаг во втором туре", async function() {
  const res: IGameStatus = getResponse().result;

  expect(res).have.property("part2");
  expect(res.part2).have.property("steps");
  expect(res.part2.steps).length.greaterThan(0);
});

Then(
  "в шаге установлены все поля атакующегося и защищающегося",
  async function() {
    const res: IGameStatus = getResponse().result;
    const step = res.part2.steps[0];

    expect(step.attacking).not.empty;
    expect(step.deffender).not.empty;
    expect(step.attackingZone).not.empty;
    expect(step.deffenderZone).not.empty;
    expect(step.question).not.empty;
  }
);

When("команда {string} дает ответ {int}", async function(type, response) {
  const GameRoom = await server.GameRoom.findOne();
  if (!GameRoom) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  const Team: ITeam =
    GameRoom.gameStatus.part2.steps[GameRoom.gameStatus.part2.steps.length - 1][
      type
    ];

  const token = await getGameToken(Team.name);

  const res = await server.server.inject({
    url: `${APIRoute}/${GameRoomPath}/${GameRoomPaths.attack}/${
      GameRoomPaths.response
    }`,
    method: HTTPMethods.post,
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: {
      response
    }
  });

  setResponse(res);
});

Then(
  "в ответе новый статус игры с ответами защитника и нападающего",
  async function() {
    const res: IGameStatus = getResponse().result;

    expect(res).have.property("part2");
    expect(res.part2).have.property("steps");
    expect(res.part2.steps).length.greaterThan(0, "step are empty");
    expect(res.part2.steps[res.part2.steps.length - 1]).have.property(
      "attackingResponse"
    );
    expect(res.part2.steps[res.part2.steps.length - 1]).have.property(
      "deffenderResponse"
    );
    expect(res.part2.steps[res.part2.steps.length - 1].attackingResponse).not
      .empty;
    expect(res.part2.steps[res.part2.steps.length - 1].deffenderResponse).not
      .empty;
  }
);

Then("победит команда {string}", async function(type) {
  const GameRoom = await server.GameRoom.findOne();
  if (!GameRoom) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  expect(
    GameRoom.gameStatus.part2.steps[GameRoom.gameStatus.part2.steps.length - 1]
      .winner
  ).to.eql(type);
});

Then("зона {string} станет принадлежать команде {string}", async function(
  zone,
  type
) {
  const res: IGameStatus = getResponse().result;
  expect(res.gameMap[zone].teamId).to.eql(
    res.part2.steps[res.part2.steps.length - 1][type]._id
  );
});

Then("победителя нет", async function() {
  const res: IGameStatus = getResponse().result;
  expect(res.part2.steps[res.part2.steps.length - 1].winner).to.eql("none");
});

Then("правильная ничья", function() {
  const res: IGameStatus = getResponse().result;

  expect(res.part2.steps[res.part2.steps.length - 1].winner).to.eql("draw");
});

Then("задается числовой вопрос", function() {
  const res: IGameStatus = getResponse().result;

  expect(res.part2.steps[res.part2.steps.length - 1]).have.property(
    "numericQuestion"
  );

  expect(res.part2.steps[res.part2.steps.length - 1].numericQuestion).not.empty;
});

When(
  "{string} делает запрос на отправку ответа r={int} t={int}",
  async function(type, response, timer) {
    const GameRoom = await server.GameRoom.findOne();
    if (!GameRoom) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }
    const Team: ITeam =
      GameRoom.gameStatus.part2.steps[
        GameRoom.gameStatus.part2.steps.length - 1
      ][type];

    const token = await getGameToken(Team.name);

    const res = await server.server.inject({
      url: `${APIRoute}/${GameRoomPath}/${GameRoomPaths.showQuestion}/${
        GameRoomPaths.response
      }`,
      method: HTTPMethods.post,
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        response,
        timer
      }
    });

    setResponse(res);
  }
);
