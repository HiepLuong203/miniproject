const express = require("express");
require("dotenv").config();
const sequelize = require("./config/connectdb");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ force: false }) // Đồng bộ model với database
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
