import { Schema } from "mongoose";
import teamsInRoom from "../../../Team/db/model/teamsInRoom";
import { mapZones, baseFlds } from "../../../../constants";
import mapZone from "./mapZone";

const gameMapSchema = new Schema({
  ...baseFlds,
  [mapZones.avtoz]: mapZone,
  [mapZones.karpovka]: mapZone,
  [mapZones.kremlin]: mapZone,
  [mapZones.kuznec]: mapZone,
  [mapZones.lenin]: mapZone,
  [mapZones.miza]: mapZone,
  [mapZones.moscow]: mapZone,
  [mapZones.moscowroad]: mapZone,
  [mapZones.pecheri]: mapZone,
  [mapZones.scherbinki]: mapZone,
  [mapZones.sormovo]: mapZone,
  [mapZones.sort]: mapZone,
  [mapZones.sport]: mapZone,
  [mapZones.varya]: mapZone,
  [mapZones.yarmarka]: mapZone
});

export default gameMapSchema;
