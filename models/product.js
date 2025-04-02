const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectdb");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        isInt: { msg: "ID must be an integer" },
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Product name cannot be empty" },
        // len: [1, 200],
      },
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isNumeric: { msg: "Price must be a number" },
        // min: { args: 0, msg: "Price cannot be negative" }, // Kiểm tra số âm
      },
    },
    category_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      references: {
        model: "categories",
        key: "name",
      },
      validate: {
        notEmpty: { msg: "Category_name cannot be empty" },
        // len: [1, 250],
      },
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);
// Phương thức static với validation
// lấy tất cả dữ liệu
Product.getAll = async () => {
  return await Product.findAll();
};
// tạo 1 category mới
Product.createProduct = async (name, price, category_name) => {
  const parsedPrice = parseFloat(price);
  return await Product.create({ name, parsedPrice, category_name });
};
// cập nhật Product theo id
Product.updateProduct = async (id, name, price, category_name) => {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) throw new Error("Invalid ID");
  const product = await Product.findByPk(idNum);
  if (!product) throw new Error("Product not found");

  return await product.update({ name, price, category_name });
};
// xóa Product theo id
Product.deleteProduct = async (id) => {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) throw new Error("Invalid ID");

  const product = await Product.findByPk(idNum);
  if (!product) throw new Error("Product not found");

  await product.destroy();
  return { id: idNum };
};
//lấy tất cả product theo name_category
Product.getByCategory = async (category_name) => {
  if (!category_name) throw new Error("Category name is required");
  return await Product.findAll({ where: { category_name } });
};
module.exports = Product;
