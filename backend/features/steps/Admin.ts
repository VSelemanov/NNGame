import { When, Then } from "cucumber";
import { server } from "../../src/server";
import { HTTPMethods, APIRoute } from "../../src/constants";
import { Authorization } from "./constants";
import { IAdminBase } from "../../src/helper/Admin/interfaces";
import { setResponse } from "./lib/response";
import { routePath } from "../../src/helper/Admin/constants/";
import { expect } from "chai";

When("я создаю нового администратора", async function() {
  const res = await server.server.inject({
    method: HTTPMethods.post,
    url: `${APIRoute}/${routePath}`,
    headers: {
      Authorization
    },
    payload: {
      name: "admin",
      password: "admin"
    } as IAdminBase
  });
  setResponse(res);
});

Then("в списке администраторов должен быть администратор", async function() {
  const res = await server.Admin.find({});
  expect(res).length.greaterThan(0);
});
