import { Given, BeforeAll, AfterAll, Then } from "cucumber";
import { server } from "../../src/server";
import { expect } from "chai";
import utils from "../../src/utils";
import { getResponse } from "./lib/response";
import { APIRoute, HTTPMethods } from "../../src/constants";
import { routePath } from "../../src/helper/Team/constants";
import { paths as TeamPaths } from "../../src/helper/Team/constants";
import { Authorization } from "./constants";

let ServerStarted = false;

export async function getLogin(name: string): Promise<string> {
  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}/${TeamPaths.login}?name=${name}`,
    method: HTTPMethods.get,
    headers: {
      Authorization
    }
  });
  return res.result as any;
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
  await utils.truncateCollection(server.GameRoom.collection);
  await utils.truncateCollection(server.Team.collection);
});

Then("сервер должен вернуть статус {int}", function(code) {
  const res = getResponse();
  expect(res.statusCode).to.eql(code);
});
