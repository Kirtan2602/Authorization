import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres", "postgres", "kdios8pro", {
  host: "localhost",
  dialect: "postgres",
  port: 4484,
});

export default sequelize;