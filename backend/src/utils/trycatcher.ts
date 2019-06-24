import { server } from "../server";
import Boom from "boom";

interface ITrycatcherOptions {
  logMessage?: string;
  isRequest?: boolean;
  logFunction?: any;
}

export default function trycatcher(
  f: (...params) => void,
  options: ITrycatcherOptions = {
    logMessage: "Undescripted message error",
    isRequest: false
  }
) {
  return async function(...params): Promise<any | Boom> {
    try {
      const res = await f(...params);
      return res;
    } catch (error) {
      console.log(error);
      if (options.isRequest) {
        return server.generateHttpError({
          code: error.code,
          message: error.message
        });
      } else {
        return error;
      }
    }
  };
}
