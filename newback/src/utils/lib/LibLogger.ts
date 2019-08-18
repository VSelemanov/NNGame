import Logger from "pino";

export enum LogLevel {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace"
}

export interface ILoggerProps {
  logLevel?: LogLevel;
  name?: string;
}

export default class Log {
  private _logger: Logger.Logger | null = null;
  private _logLevel: LogLevel;
  private _name: string | undefined;
  constructor(props: ILoggerProps) {
    this._logLevel = props.logLevel || LogLevel.DEBUG;
    this._name = props.name;
  }

  public get logger() {
    if (this._logger === null) {
      this._logger = Logger({
        name: this._name,
        level: this._logLevel,
        prettyPrint: true
      });
    }
    return this._logger;
  }
}
