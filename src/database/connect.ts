import * as Sequelize from "sequelize";
const seq = new Sequelize.Sequelize(
  process.env.DB || "esb",
  process.env.DBUSERNAME || "postgres",
  process.env.DBPASSWORD || "postgres",
  {
    host: process.env.DBHOST || "localhost",
    port: parseInt(process.env.DBPORT || "5432", 10),
    dialect: "postgres",
    logging: false
  }
);

export default seq;
