const express = require("express");
require("dotenv").config();
const sequelize = require("./config/connectdb");
const categoryRoute = require("./routes/categoryRoutes");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/authRoutes");

const app = express();

app.use(express.json());
// Middleware để cho phép truy cập ảnh trong thư mục 'uploads'
app.use("/uploads", express.static("uploads"));

app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api", userRoute);

const PORT = process.env.PORT;
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database: ", err);
  });
