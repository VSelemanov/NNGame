import trycatcher from "../../utils/trycatcher";
import { IQuestionBase, IQuestion } from "./interfaces";
import { server } from "../../server";
import { EntityName, ErrorMessages } from "./constants";

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
  )
};

export default methods;
