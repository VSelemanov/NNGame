import { When, Then } from "cucumber";
import { server } from "../../src/server";
import { HTTPMethods, APIRoute } from "../../src/constants";
import { Authorization } from "./constants";
import { IAdminBase } from "../../src/helper/Admin/interfaces";
import { setResponse, getResponse, getSocketResponse } from "./lib/response";
import { routePath, paths } from "../../src/helper/Admin/constants/";
import { expect } from "chai";
import { getAdminLogin, getTeam, client } from "./default";
import { IGameStatus } from "../../src/helper/Room/interfaces";
import TeamMethods from "../../src/helper/Team";

When("я создаю нового администратора l={string} p={string}", async function(
  name,
  password
) {
  const res = await server.server.inject({
    method: HTTPMethods.post,
    url: `${APIRoute}/${routePath}`,
    headers: {
      Authorization
    },
    payload: {
      name,
      password
    } as IAdminBase
  });
  setResponse(res);
});

Then("в списке администраторов должен быть администратор", async function() {
  const res = await server.Admin.find({});
  expect(res).length.greaterThan(0);
});

When(
  "я делаю запрос авторизации администратора l={string} p={string}",
  async function(name, password) {
    const res = await server.server.inject({
      url: `${APIRoute}/${routePath}/${paths.login}`,
      method: HTTPMethods.post,
      headers: {
        Authorization
      },
      payload: {
        name,
        password
      } as IAdminBase
    });
    setResponse(res);
  }
);
Then("в ответе должен быть токен администратора", function() {
  const res = getResponse().result;

  expect(typeof res).to.eql("string");
});

When(
  "администратор l={string} p={string} делает запрос на перекрас зоны {string} в цвет команды {string}",
  async function(name, password, zoneKey, teamName) {
    const token = await getAdminLogin(name, password);
    const Team = await getTeam(teamName);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.zone}`,
      headers: {
        Authorization: token
      },
      payload: {
        _id: Team._id,
        zone: zoneKey
      }
    });

    setResponse(res);
  }
);

When(
  "администратор l={string} p={string} делает запрос на старт игры",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.startgame}`,
      headers: {
        Authorization: token
      }
    });

    setResponse(res);
  }
);

Then("в сокете должен быть статус игры с флагом", async function() {
  const res: IGameStatus = getSocketResponse();
  await client.disconnect();

  expect(res.currentPart).to.eql(1);
  expect(res.isStarted).to.eql(true);
});

Then("в счетчике команды {string} должно быть {int} зон", async function(
  teamName,
  zones
) {
  const res: IGameStatus = getSocketResponse();
  const Team = await getTeam(teamName);
  const teamKey = await TeamMethods.getTeamLinkInGame(Team._id);

  expect(res.teams[teamKey].zones).to.eql(zones);
});

When(
  "администратор l={string} p={string} делает запрос на следующий вопрос",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const res = await server.server.inject({
      method: HTTPMethods.get,
      url: `${APIRoute}/${routePath}/${paths.nextquestion}`,
      headers: {
        Authorization: token
      }
    });

    setResponse(res);
  }
);

Then(
  "в сокете в первом туре должен появиться новый вопрос и счетчик равен {int}",
  function(currentStep) {
    const res: IGameStatus = getSocketResponse();
    client.disconnect();
    expect(res.part1.steps).length.greaterThan(0, "Steps are empty");
    expect(res.part1.currentStep).to.eql(currentStep);
  }
);

When(
  "администратор l={string} p={string} делает запрос на старт таймера",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const res = await server.server.inject({
      method: HTTPMethods.post,
      url: `${APIRoute}/${routePath}/${paths.startquestion}`,
      headers: {
        Authorization: token
      }
    });

    setResponse(res);
  }
);

Then(
  "в сокете в первом туре на текущем шаге должен быть установлен флаг isStarted",
  async function() {
    const res: IGameStatus = getSocketResponse();
    await client.disconnect();

    expect(res.part1.steps[res.part1.currentStep || 0].isStarted).to.eql(true);
  }
);
