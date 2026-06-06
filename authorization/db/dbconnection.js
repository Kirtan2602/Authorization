import { Sequelize } from "sequelize";
import CreateUserModel from "../model/userModel.js";

let sequelize;
let user = null;

export const dbconnection = async (database, username, password) => {
  const sequelize = new Sequelize("postgres", "postgres", "kdios8pro", {
  host: "localhost",
  dialect: "postgres",
    port: 4484,
  });

  try {
    await sequelize.authenticate();

    user = CreateUserModel(sequelize);

    await sequelize.sync({ alter: true });

    console.log("Database connected ");
  } catch (error) {
    console.error("Error ", error);
  }
};

export { sequelize, user };