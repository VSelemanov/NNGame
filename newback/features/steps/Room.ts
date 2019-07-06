import { When, Then } from "cucumber";
import { getAdminLogin } from "./default";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods, teams } from "../../src/constants";
import { setResponse } from "./lib/response";
import { routePath, ErrorMessages } from "../../src/helper/Room/constants";
import { expect } from "chai";

When(
  "администратор l={string} p={string} делает запрос на создание новой комнаты",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const team = await server.Team.find();

    const res = await server.server.inject({
      url: `${APIRoute}/${routePath}`,
      method: HTTPMethods.post,
      headers: {
        Authorization: token
      },
      payload: {
        theme: null,
        [teams.team1]: team[0]._id,
        [teams.team2]: team[1]._id,
        [teams.team3]: team[2]._id
      }
    });

    setResponse(res);
  }
);

Then(
  "в списке комнат должна появиться новая активная комната с тремя командами и инвайт кодами",
  async function() {
    const Room = await server.Room.findOne({
      isStarted: false,
      isActive: true
    });

    if (!Room) {
      throw new Error(ErrorMessages.NOT_FOUND);
    }

    expect(Room.isActive).to.eql(true);
    expect(Room).have.property("gameStatus");
    expect(Room.gameStatus).have.property("teams");

    const teamsObject = Room.gameStatus.teams;

    if (!teamsObject) {
      throw new Error("Teams not found");
    }

    expect(teamsObject[teams.team1]).not.empty;
    expect(teamsObject[teams.team2]).not.empty;
    expect(teamsObject[teams.team3]).not.empty;
  }
);
