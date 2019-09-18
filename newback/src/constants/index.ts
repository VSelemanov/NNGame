import { SchemaDefinition, SchemaOptions } from "mongoose";
import uuid = require("uuid");

export const dotenvConfig = {
  APP_TOKEN: process.env.APP_TOKEN || "",
  DB_HOST: process.env.DB_HOST || "mongodb://localhost:27017",
  ADMIN_KEY: process.env.ADMIN_KEY || "nngame",
  SECRET_KEY: process.env.SECRET_KEY || "nngame",
  VERSION: process.env.VERSION || "v1",
  PORT: Number(process.env.PORT || "3000")
};

export const APIRoute = `/api`;

export const adminPath = `admin`;

export const baseFlds: SchemaDefinition = {
  _id: {
    type: String,
    default: uuid.v4
    // required: true,
    // unique: true
  }
};

export const baseSchemaOptions: SchemaOptions = {
  timestamps: {
    createdAt: "cAt",
    updatedAt: "uAt"
  },
  versionKey: false
};

export enum HTTPMethods {
  get = "GET",
  post = "POST",
  del = "DELETE",
  put = "PUT"
}

export enum mapZones {
  moscowroad = "moscowroad",
  sormovo = "sormovo",
  varya = "varya",
  moscow = "moscow",
  sort = "sort",
  yarmarka = "yarmarka",
  avtoz = "avtoz",
  karpovka = "karpovka",
  lenin = "lenin",
  kremlin = "kremlin",
  scherbinki = "scherbinki",
  miza = "miza",
  sport = "sport",
  kuznec = "kuznec",
  pecheri = "pecheri"
}

export const zoneFlds = {
  isStartBase: false,
  team: null
};

export const GameMap = {
  [mapZones.moscowroad]: {
    nearby: [mapZones.sormovo, mapZones.moscow],
    ...zoneFlds
  },
  [mapZones.sormovo]: {
    nearby: [mapZones.moscowroad, mapZones.moscow, mapZones.varya],
    ...zoneFlds
  },
  [mapZones.varya]: {
    nearby: [mapZones.sormovo, mapZones.moscow],
    ...zoneFlds
  },
  [mapZones.moscow]: {
    nearby: [
      mapZones.sormovo,
      mapZones.varya,
      mapZones.sort,
      mapZones.yarmarka,
      mapZones.moscowroad
    ],
    ...zoneFlds
  },
  [mapZones.sort]: {
    nearby: [
      mapZones.moscow,
      mapZones.yarmarka,
      mapZones.avtoz,
      mapZones.karpovka,
      mapZones.lenin
    ],
    ...zoneFlds
  },
  [mapZones.yarmarka]: {
    nearby: [mapZones.moscow, mapZones.sort, mapZones.lenin, mapZones.kremlin],
    ...zoneFlds
  },
  [mapZones.avtoz]: {
    nearby: [mapZones.sort, mapZones.karpovka],
    ...zoneFlds
  },
  [mapZones.karpovka]: {
    nearby: [
      mapZones.avtoz,
      mapZones.sort,
      mapZones.lenin,
      mapZones.scherbinki
    ],
    ...zoneFlds
  },
  [mapZones.lenin]: {
    nearby: [
      mapZones.sort,
      mapZones.karpovka,
      mapZones.yarmarka,
      mapZones.kremlin,
      mapZones.miza,
      mapZones.sport
    ],
    ...zoneFlds
  },
  [mapZones.kremlin]: {
    nearby: [
      mapZones.yarmarka,
      mapZones.lenin,
      mapZones.sport,
      mapZones.pecheri
    ],
    ...zoneFlds
  },
  [mapZones.scherbinki]: {
    nearby: [mapZones.karpovka, mapZones.miza],
    ...zoneFlds
  },
  [mapZones.miza]: {
    nearby: [
      mapZones.scherbinki,
      mapZones.lenin,
      mapZones.sport,
      mapZones.kuznec
    ],
    ...zoneFlds
  },
  [mapZones.sport]: {
    nearby: [
      mapZones.miza,
      mapZones.lenin,
      mapZones.kremlin,
      mapZones.pecheri,
      mapZones.kuznec
    ],
    ...zoneFlds
  },
  [mapZones.kuznec]: {
    nearby: [mapZones.miza, mapZones.sport, mapZones.pecheri],
    ...zoneFlds
  },
  [mapZones.pecheri]: {
    nearby: [mapZones.kremlin, mapZones.sport, mapZones.kuznec],
    ...zoneFlds
  }
};

export enum teams {
  team1 = "team1",
  team2 = "team2",
  team3 = "team3"
}
