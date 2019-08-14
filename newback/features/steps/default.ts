import {
  Given,
  BeforeAll,
  AfterAll,
  Then,
  setDefaultTimeout,
  When
} from "cucumber";
import { server } from "../../src/server";
import { expect } from "chai";
import utils from "../../src/utils";
import { getResponse, getSocketResponse } from "./lib/response";
import { APIRoute, HTTPMethods, teams } from "../../src/constants";
// import { routePath as TeamRoutePath } from "../../src/helper/Team/constants";
import {
  routePath as AdminRoutePath,
  ErrorMessages as AdminErrorMessages
} from "../../src/helper/Admin/constants";

import {
  paths as TeamPaths,
  ErrorMessages as TeamErrorMessages
} from "../../src/helper/Team/constants";
import { paths as AdminPaths } from "../../src/helper/Admin/constants";

import { Authorization } from "./constants";
import { IAdminBase } from "../../src/helper/Admin/interfaces";

import TeamMethods from "../../src/helper/Team";
import { IRoom, IGameStatus } from "../../src/helper/Room/interfaces";
import { ITeam } from "../../src/helper/Team/interfaces";
import RoomMethods from "../../src/helper/Room";
import { Client } from "@hapi/nes";
import Nes from "@hapi/nes";
import methods from "../../src/helper/Room";
import { ErrorMessages as QuestionErrorMessages } from "../../src/helper/Question/constants";
import { ErrorMessages } from "../../src/helper/Room/constants";

// setDefaultTimeout(10 * 1000);

let ServerStarted = false;

export const client: Client = new Nes.Client("ws://localhost:3000");

export async function getActiveRoom(): Promise<IRoom> {
  return await RoomMethods.getActiveRoom();
}

export async function getTeam(teamName: string): Promise<ITeam> {
  const Team = await server.Team.findOne({ name: teamName });

  if (!Team) {
    throw new Error(TeamErrorMessages.NOT_FOUND);
  }

  return Team;
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
  return `Bearer ${res.result as any}`;
}

export async function getGameToken(teamName: string): Promise<string> {
  const Room = await getActiveRoom();
  const Team = await getTeam(teamName);

  if (!Room.gameStatus.teams) {
    throw new Error(TeamErrorMessages.NOT_FOUND);
  }

  let inviteCode = "000000";
  for (const key of Object.keys(teams)) {
    if (Room.gameStatus.teams[key]._id === Team._id) {
      inviteCode = Room.gameStatus.teams[key].inviteCode;
    }
  }

  return `Bearer ${await TeamMethods.login(inviteCode)}`;
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
  await utils.truncateCollection(server.Room.collection);
  await utils.truncateCollection(server.Team.collection);
  await utils.truncateCollection(server.Question.collection);
});

Then("сервер должен вернуть статус {int}", function(code) {
  const res = getResponse();
  expect(res.statusCode).to.eql(code);
});

Given("команды владеют следующими зонами:", async function(dataTable) {
  for (const row of dataTable.hashes() as ITeamZone[]) {
    await methods.colorZone(row.zone, row.teamKey);
  }
});

interface ITeamZone {
  teamKey: string;
  zone: string;
}

Given("активен тур номер {int}", async function(partNumber) {
  const Room: IRoom = await RoomMethods.getActiveRoom();

  Room.gameStatus.currentPart = 1;

  await Room.save();
});

const randomResults: number[] = [];

When("я запускаю генератор случайных чисел с сохранением ответа", function() {
  randomResults.push(utils.getRandomInt(0, 100));
});

Then("эти ответы не должны быть равны", function() {
  expect(randomResults[0] === randomResults[1]).to.eql(false);
});

Given("команда {string} имеет во владении {int} зоны", async function(
  teamName: string,
  zones: number
) {
  const Room: IRoom = await RoomMethods.getActiveRoom();
  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  Room.gameStatus.teams[teamKey].zones = zones;

  await Room.save();
});

Given("во втором туре уже есть шаг", async function() {
  const Room: IRoom = await RoomMethods.getActiveRoom();
  const Question = await server.Question.findOne({ isNumeric: false });
  if (!Question) {
    throw new Error();
  }

  Room.gameStatus.part2.steps.push({
    attacking: "team1",
    attackingZone: "moscow",
    defender: "team2",
    defenderZone: "yarmarka",
    isStarted: true,
    question: Question,
    winner: "team1",
    isFinished: false
  });

  Room.save();
});

Then("победителем игры должна стать команда {string}", async function(
  teamName: string
) {
  const Team = await getTeam(teamName);
  const Room = await server.Room.findOne();
  if (!Room) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  let teamKey: string | null = null;
  for (const key of Object.keys(teams)) {
    if (Room.gameStatus.teams[key]._id === Team._id) {
      teamKey = key;
    }
  }

  if (!teamKey) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  expect(Room.gameStatus.gameWinner).to.eql(teamKey);
});

Then("комната стала неактивной", async function() {
  const Room = await server.Room.findOne();

  if (!Room) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  expect(Room.isActive).to.eql(false);
});

Given("в очереди второго тура осталась только команда {string}", async function(
  teamName
) {
  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);
  const Room: IRoom = await RoomMethods.getActiveRoom();

  Room.gameStatus.part2.teamQueue = [teamKey];

  await Room.save();
});

Then("запускается тур номер {int} с командами {string}", async function(
  partNumber: number,
  teamsString: string
) {
  const res: IGameStatus = getSocketResponse();
  const Team1 = await getTeam(teamsString.split(",")[0]);
  const Team1Key = await TeamMethods.getTeamLinkInGame(Team1._id);
  const Team2 = await getTeam(teamsString.split(",")[1]);
  const Team2Key = await TeamMethods.getTeamLinkInGame(Team2._id);

  expect(res.currentPart).to.eql(partNumber);
  expect(res.part3.teams[0]).to.eql(Team1Key);
  expect(res.part3.teams[1]).to.eql(Team2Key);
});

Then("победителя игры нет", function() {
  const res: IGameStatus = getSocketResponse();

  expect(res.gameWinner).to.eql(null);
});
