import { When, Then } from "cucumber";
import { getAdminLogin } from "./default";
import { server } from "../../src/server";
import { APIRoute, HTTPMethods } from "../../src/constants";
import { routePath } from "../../src/helper/Question/constants";
import { IQuestionBase, IQuestion } from "../../src/helper/Question/interfaces";
import { setResponse } from "./lib/response";
import { expect } from "chai";
import QuestionMethods from "../../src/helper/Question";

When(
  "я делаю запрос создания цифрового вопроса от лица админа l={string} p={string}",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const Questions = await server.Question.find();

    const res = await server.server.inject({
      url: `${APIRoute}/${routePath}`,
      method: HTTPMethods.post,
      headers: {
        Authorization: token
      },
      payload: {
        isNumeric: true,
        title: `вопрос${Questions.length}`,
        numericAnswer: 100
      } as IQuestionBase
    });

    setResponse(res);
  }
);

Then("в списке вопросов появился цифровой вопрос", async function() {
  const Question = await server.Question.find();

  expect(Question).length.greaterThan(0, "Question array is empty");

  expect(Question[0].isNumeric).to.eql(true);
  expect(Question[0].numericAnswer).to.eql(100);
});

When(
  "я делаю запрос создания вариантивного вопроса от лица админа l={string} p={string}",
  async function(name, password) {
    const token = await getAdminLogin(name, password);

    const res = await server.server.inject({
      url: `${APIRoute}/${routePath}`,
      method: HTTPMethods.post,
      headers: {
        Authorization: token
      },
      payload: {
        isNumeric: false,
        title: "вопрос",
        answers: [
          {
            isRight: true,
            title: "1"
          },
          {
            isRight: false,
            title: "2"
          },
          {
            isRight: false,
            title: "3"
          },
          {
            isRight: false,
            title: "4"
          }
        ]
      } as IQuestionBase
    });

    setResponse(res);
  }
);

Then("в списке вопросов появился вариативный вопрос", async function() {
  const Question = await server.Question.find();

  expect(Question).length.greaterThan(0, "Question array is empty");

  expect(Question[0].isNumeric).to.eql(false);
  expect((Question[0].answers || []).length).to.eql(4);
});

const randomQuestions: IQuestion[] = [];
When("я запрашиваю случайный числовой вопрос", async function() {
  const res = await QuestionMethods.random({ isNumeric: true });
  randomQuestions.push(res);
});

Then("это должны быть два разных вопроса", async function() {
  expect(randomQuestions[0]._id === randomQuestions[1]._id).to.eql(false);
});
