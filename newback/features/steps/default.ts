import { Given, BeforeAll, AfterAll, Then, setDefaultTimeout } from "cucumber";
import { server } from "../../src/server";
import { expect } from "chai";
import utils from "../../src/utils";
import { getResponse } from "./lib/response";
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
import { IRoom } from "../../src/helper/Room/interfaces";
import { ITeam } from "../../src/helper/Team/interfaces";
import RoomMethods from "../../src/helper/Room";
import { Client } from "@hapi/nes";
import Nes from "@hapi/nes";
import methods from "../../src/helper/Room";

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
