import trycatcher from "./trycatcher";
import { Collection } from "mongoose";

const utils = {
  dropCollection: trycatcher(
    async (collection: Collection) => {
      await collection.drop();
    },
    {
      logMessage: "dropCollection utils"
    }
  ),
  truncateCollection: trycatcher(
    async (collection: Collection) => {
      await collection.deleteMany({});
    },
    {
      logMessage: "truncateCollection utils"
    }
  ),
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
};

export default utils;
