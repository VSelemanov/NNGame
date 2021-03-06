import * as Hapi from "hapi";
import * as AuthBearer from "hapi-auth-bearer-token";
import Handlebars from "handlebars";
import Inert from "inert";
import Boom from "boom";
import HapiSwagger from "hapi-swagger";
import Vision from "vision";
// db
import AdminModel from "./helper/Admin/db/model";
import RoomModel from "./helper/Room/db/model";
import TeamModel from "./helper/Team/db/model";
import QuestionModel from "./helper/Question/db/model";
// import db from "./database";
import dbConnect from "./database/connect";
// routes
import Routes from "./routes/index";
// strategies
import Auth from "./strategies/Auth";
import { APIRoute, dotenvConfig } from "./constants";
import { Connection, Model, Document, MongooseDocument } from "mongoose";
import { IAdmin } from "./helper/Admin/interfaces";
import { ITeam } from "./helper/Team/interfaces";
import { IQuestion } from "./helper/Question/interfaces";
import { IRoom } from "./helper/Room/interfaces";
import Nes from "@hapi/nes";
import Logger from "./utils/Logger";
import {
  routePath,
  paths,
  subscriptionGameStatuspath
} from "./helper/Room/constants";
import methods from "./helper/Room";
// utils
// interfaces

class Server {
  private _httpServerPort: number;
  private _dbConnect: Connection;
  private swaggerOptions = {
    info: {
      title: "REST API NNGame",
      version: dotenvConfig.VERSION
    },

    jsonPath: `${APIRoute}/swagger.json`,
    swaggerUIPath: `${APIRoute}/swaggerui/`,
    documentationPath: `${APIRoute}/documentation`,
    cors: true,
    grouping: "tags",
    tagsGroupingFilter: (tag: string) => tag !== "api"
  };

  private _Admin: Model<IAdmin> = AdminModel;
  private _Room: Model<IRoom> = RoomModel;
  private _Team: Model<ITeam> = TeamModel;
  private _Question: Model<IQuestion> = QuestionModel;

  public _server: Hapi.Server;

  constructor(props: { port: number /*dbConnect: Connection*/ }) {
    this._httpServerPort = props.port;
    // this._dbConnect = props.dbConnect;
  }

  public async createServer() {
    try {
      process.on("unhandledRejection", error => {
        Logger.error("unhandledRejection --> ", error);
        process.exit(1);
      });

      this._server = new Hapi.Server({
        port: this._httpServerPort,
        routes: {
          cors: true
        }
      });

      await this._server.register([
        AuthBearer,
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: this.swaggerOptions
        }
      ]);

      await this._server.register(Nes);

      (<any>this._server).views({
        engines: { html: Handlebars },
        path: `${__dirname}`,
        allowInsecureAccess: true,
        allowAbsolutePaths: true
      });

      this._server.auth.strategy("app-auth", "bearer-access-token", {
        validate: Auth.AppAuth,
        allowChaining: true
      });

      this._server.auth.strategy("admin-auth", "bearer-access-token", {
        validate: Auth.AdminAuth,
        allowChaining: true
      });

      this._server.auth.strategy("team-auth", "bearer-access-token", {
        validate: Auth.TeamAuth,
        allowChaining: true
      });

      this._server.auth.default("app-auth");

      this._server.route(Routes);
    } catch (error) {
      Logger.log(error);
    }
  }

  private async connectToDb() {
    const db = await dbConnect();
    this._dbConnect = db;
  }

  private async dbStop() {
    try {
      await this._dbConnect.close();
    } catch (error) {
      Logger.error("DB Stop error", error);
    }
  }

  private async serverSubscriptions() {
    this._server.subscription(subscriptionGameStatuspath, {
      auth: false,
      onSubscribe: async (socket, path, params) => {
        const Room: IRoom = await methods.getActiveRoom();
        await socket.publish(subscriptionGameStatuspath, Room.gameStatus);
      }
    });
  }

  public generateHttpError(data) {
    const { code, message } = data;
    switch (code) {
      case 11000:
      case 400:
        return Boom.badRequest(message);
      case 404:
        return Boom.notFound(message);
      case 403:
        return Boom.forbidden(message);
      case 401:
        return Boom.unauthorized(message);
      default:
        return Boom.badImplementation();
    }
  }

  public async startServer() {
    await this._server.start();
    Logger.info("Server running on: ", this._server.info.uri);
  }

  public async start() {
    await this.createServer();
    await this.startServer();
    this.serverSubscriptions();
    await this.connectToDb();
  }

  private async serverStop() {
    await this._server.stop();
  }

  public async stop() {
    await this.serverStop();
    await this.dbStop();
  }

  public async reload() {
    await this.stop();
    await this.start();
  }
  get server() {
    return this._server;
  }
  get Admin() {
    return this._Admin;
  }
  get Room() {
    return this._Room;
  }
  get Team() {
    return this._Team;
  }
  get Question() {
    return this._Question;
  }
}

export const server = new Server({
  port: dotenvConfig.PORT
  // dbConnect: dbConnect()
});
