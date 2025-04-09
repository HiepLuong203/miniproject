import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "./config/connectdb";
import categoryRoute from "../src/routes/categoryRoute";
import productRoute from "../src/routes/productRoute";
import authRoute from "../src/routes/authRoute";

dotenv.config();

const app: Express = express();

app.use(express.json());
// app.use("/uploads", express.static("uploads"));

app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api", authRoute);

const PORT: number = Number(process.env.PORT);

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}...`);
    });
  })
  .catch((err: Error) => {
    console.error("Unable to sync database: ", err);
  });
