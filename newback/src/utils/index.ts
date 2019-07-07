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

  getRandomInt: (min, max) => {
    const arr: number[] = [];
    const res: number[] = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    for (let i = 0; i < 1; i++) {
      res.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }

    return res[0];
  }
};

export default utils;
