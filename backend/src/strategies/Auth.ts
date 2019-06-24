import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";

const Auth = {
  // Валидация запросов для системных событий
  AppAuth: async (request, token: string, h) => {
    // console.log(process.env.APP_TOKEN);
    // if (process.env.APP_STATUS === "dev") {
    //   return { isValid: true, credentials: {} };
    // }
    // const credentials = {};
    // const isValid = token === process.env.APP_TOKEN;
    // return { isValid, credentials };
    return { isValid: true, credentials: {} };
  }
};

export default Auth;
