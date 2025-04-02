const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Conntected MySQL with Sequelize");
  })
  .catch((err) => {
    console.log("Error connect database", err);
    throw err;
  });
module.exports = sequelize;
