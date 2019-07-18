import trycatcher from "../../utils/trycatcher";
import { IQuestionBase, IQuestion, IQuestionGetRandom } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";
import utils from "../../utils";

const methods = {
  create: trycatcher(
    async (QuestionData: IQuestionBase): Promise<IQuestion> => {
      const Question = await server.Question.create(QuestionData);
      const res = await Question.save();
      return res;
    },
    {
      logMessage: `${EntityName} create method`
    }
  ),
  random: trycatcher(
    async (params: IQuestionGetRandom = {}): Promise<IQuestion> => {
      const where: any = {};
      for (const key of Object.keys(params)) {
        where[key] = params[key];
      }
      const minCount = (await server.Question.find(where)
        .sort({ count: 1 })
        .limit(1))[0].count;

      const Questions = await server.Question.find({
        ...where,
        count: minCount
      });

      const index: number = utils.getRandomInt(0, Questions.length - 1);

      Questions[index].count += 1;
      await Questions[index].save();

      return Questions[index];
    },
    {
      logMessage: `${EntityName} create method`
    }
  )
};

export default methods;
