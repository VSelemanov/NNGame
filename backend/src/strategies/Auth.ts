import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";

const Auth = {
  // Валидация запросов для системных событий
  AppAuth: async (request, token: string, h) => {
    return { isValid: true, credentials: {} };
  },
  TeamAuth: async (request, token: string, h) => {
    return { isValid: true, credentials: { teamId: "test" } };
  },
  GameRoomAuth: async (request, token: string, h) => {
    return { isValid: true, credentials: {} };
  }
};

export default Auth;
