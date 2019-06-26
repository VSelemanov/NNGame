import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";
import methods from "../helper/GameRoom";
import { IGameRoom } from "../helper/GameRoom/interfaces";

const Auth = {
  // Валидация запросов для системных событий
  AppAuth: async (request, token: string, h) => {
    return {
      isValid: token === process.env.APP_TOKEN,
      credentials: {}
    };
  },
  AdminAuth: async (request, token: string, h) => {
    return { isValid: true, credentials: {} };
  },
  TeamAuth: async (request, token: string, h) => {
    const tokenData: any = jwt.verify(
      token,
      process.env.SECRET_KEY || "nngame",
      {
        algorithms: ["HS256"]
      }
    );

    return { isValid: true, credentials: { teamId: tokenData._id } };
  },
  GameRoomAuth: async (request, token: string, h) => {
    const tokenData: any = jwt.verify(
      token,
      process.env.SECRET_KEY || "nngame",
      {
        algorithms: ["HS256"]
      }
    );
    const { gameRoomId, teamId } = tokenData;

    const GameRoom: IGameRoom | undefined = ((await methods.read(
      true
    )) as IGameRoom[]).filter(row => row._id === tokenData.gameRoomId)[0];

    if (!GameRoom) {
      return { isValid: false, credentials: {} };
    }

    return { isValid: true, credentials: { gameRoomId, teamId } };
  }
};

export default Auth;
