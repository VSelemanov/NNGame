import { When, Then } from "cucumber";
import { getAdmin } from "./lib";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods } from "../../src/constants";
import { routePath } from "../../src/helper/GameRoom/constants";
import { Authorization } from "./constants";
import { IGameRoomBase } from "../../src/helper/GameRoom/interfaces";
import { ErrorMessages } from "../../src/helper/Admin/constants";
import { setResponse } from "./lib/response";
import { expect } from "chai";

When("я администратор создает новую игровую комнату", async function() {
  const admin = await getAdmin("admin");
  if (!admin) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  const res = await server.server.inject({
    url: `${APIRoute}/${routePath}`,
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

Then("в списке комнат должна появиться новая комната", async function() {
  const res = await server.GameRoom.find({});
  expect(res).length.greaterThan(0);
});
