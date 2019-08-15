import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "../../../interfaces";
import { IQuestionBase, IQuestion } from "../interfaces";
import methods from "../";
import { EntityName } from "../constants";

const ctrl = {
  create: trycatcher(
    async (req: IDecoratedRequest<IQuestionBase>, h) => {
      const QuestionData: IQuestionBase = req.payload;
      return await methods.create(QuestionData);
    },
    {
      logMessage: `${EntityName} create request`,
      isRequest: true
    }
  )
};

export default ctrl;
