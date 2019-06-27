import trycatcher from "../utils/trycatcher";
import jwt from "jsonwebtoken";
import methods from "../helper/GameRoom";
import { IGameRoom } from "../helper/GameRoom/interfaces";
import GameRoomMethods from "../helper/GameRoom";

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

      const GameRoom: IGameRoom[] = await GameRoomMethods.read(true);

      return {
        isValid: true,
        credentials: {
          ...tokenData,
          isAdmin: true,
          gameRoomId: GameRoom[0]._id
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
        credentials: { teamId: tokenData._id, isAdmin: false }
      };
    } catch (error) {
      console.log("TeamAuth Error -----> ", error);
      return {
        isValid: false,
        credentials: {}
      };
    }
  },
  GameRoomAuth: async (request, token: string, h) => {
    try {
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
    } catch (error) {
      console.log("GameRoomAuth Error -----> ", error);
      return { isValid: false, credentials: {} };
    }
  }
};

export default Auth;
