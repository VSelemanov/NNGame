import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";

const Auth = {
  // Валидация запросов для системных событий
  AppAuth: async (request, token: string, h) => {
    const credentials = {};
    const isValid = token === process.env.APP_TOKEN;
    return { isValid, credentials };
  }
};

export default Auth;
