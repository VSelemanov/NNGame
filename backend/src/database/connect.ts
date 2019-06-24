import { connection } from "mongoose";
import mongoose from "mongoose";
const db = connection;

export default async function() {
  mongoose.connect("mongodb://localhost:27017/GameNN", {
    useNewUrlParser: true
  });

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    // создать коллекции и т.п.
    console.log("Success connection");
  });
  return db;
}
