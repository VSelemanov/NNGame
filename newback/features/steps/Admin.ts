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

  expect(res.currentPart).to.eql(1);
  expect(res.isStarted).to.eql(true);

  await client.disconnect();
});
