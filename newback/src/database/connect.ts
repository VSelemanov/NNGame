import { connection } from "mongoose";
import mongoose from "mongoose";
const db = connection;

export default async function() {
  mongoose.connect(process.env.DB_HOST || "mongodb://localhost:27017", {
    useNewUrlParser: true,
    dbName: "nngame"
  });

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    // создать коллекции и т.п.
    console.log("Success connection");
  });
  return db;
}
