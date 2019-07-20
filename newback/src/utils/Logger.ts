import Logger from "./lib/LibLogger";
import { LogLevel } from "./lib/LibLogger";

const nomenLogger = new Logger({
  name: "NNGame",
  logLevel: LogLevel.DEBUG
});

export default nomenLogger.logger;
