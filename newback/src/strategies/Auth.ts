import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";
import Logger from "../utils/Logger";
import { dotenvConfig } from "../constants";

const Auth = {
  // Валидация запросов для системных событий
  AppAuth: async (request, token: string, h) => {
    return {
      isValid: token === dotenvConfig.APP_TOKEN,
      credentials: {}
    };
  },
  AdminAuth: async (request, token: string, h) => {
    try {
      const tokenData: any = jwt.verify(token, dotenvConfig.ADMIN_KEY, {
        algorithms: ["HS256"]
      });

      return {
        isValid: true,
        credentials: {
          ...tokenData,
          isAdmin: true
        }
      };
    } catch (error) {
      Logger.error("AdminAuth Error -----> ", error);
      return { isValid: false, credentials: {} };
    }
  },
  TeamAuth: async (request, token: string, h) => {
    try {
      const tokenData: any = jwt.verify(token, dotenvConfig.SECRET_KEY, {
        algorithms: ["HS256"]
      });

      return {
        isValid: true,
        credentials: { ...tokenData, isAdmin: false }
      };
    } catch (error) {
      Logger.error("TeamAuth Error -----> ", error);
      return {
        isValid: false,
        credentials: {}
      };
    }
  }
};

export default Auth;
