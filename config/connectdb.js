const { Sequelize } = require("sequelize");

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
    console.log("Connected MySQL");
  })
  .catch((err) => {
    console.log("Error connect MySQL", err);
    throw err;
  });
module.exports = sequelize;
