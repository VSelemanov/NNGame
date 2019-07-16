import { server } from "../server";
import Boom from "boom";

interface ITrycatcherOptions {
  logMessage?: string;
  isRequest?: boolean;
  isThrow?: boolean;
  logFunction?: any;
}

export default function trycatcher(
  f: (...params) => void,
  optionsTC: ITrycatcherOptions
) {
  const options = {
    logMessage: "Undescripted message error",
    isRequest: false,
    isThrow: true,
    ...optionsTC
  };
  return async function(...params): Promise<any | Boom> {
    try {
      const res = await f(...params);
      return res;
    } catch (error) {
      console.log(error);
      if (options.isRequest) {
        return server.generateHttpError({
          code: error.code || 400,
          message: error.message
        });
      } else {
        if (options.isThrow) {
          throw error;
        } else {
          return error;
        }
      }
    }
  };
}
