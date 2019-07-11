import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";
// import methods from "../helper/GameRoom";
// import { IGameRoom } from "../helper/GameRoom/interfaces";
// import GameRoomMethods from "../helper/GameRoom";

const Auth = {
  // Валидация запросов для системных событий
  AppAuth: async (request, token: string, h) => {
    return {
      isValid: token === process.env.APP_TOKEN,
      credentials: {}
    };
  },
  AdminAuth: async (request, token: string, h) => {
    try {
      const tokenData: any = jwt.verify(
        token,
        process.env.ADMIN_KEY || "nngame",
        {
          algorithms: ["HS256"]
        }
      );

      return {
        isValid: true,
        credentials: {
          ...tokenData,
          isAdmin: true
        }
      };
    } catch (error) {
      console.log("AdminAuth Error -----> ", error);
      return { isValid: false, credentials: {} };
    }
  },
  TeamAuth: async (request, token: string, h) => {
    try {
      const tokenData: any = jwt.verify(
        token,
        process.env.SECRET_KEY || "nngame",
        {
          algorithms: ["HS256"]
        }
      );

      return {
        isValid: true,
        credentials: { ...tokenData }
      };
    } catch (error) {
      console.log("TeamAuth Error -----> ", error);
      return {
        isValid: false,
        credentials: {}
      };
    }
  }
};

export default Auth;
