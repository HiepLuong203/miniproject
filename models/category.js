const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectdb");

const Category = sequelize.define(
  "Category",
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
        notEmpty: { msg: "Category name cannot be empty" },
        // len: [1, 200],
      },
    },
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);

// Phương thức static với validation
// lấy tất cả dữ liệu
Category.getAll = async () => {
  return await Category.findAll();
};
// tạo 1 category mới
Category.createCategory = async (name) => {
  return await Category.create({ name });
};
// cập nhật category theo id
Category.updateCategory = async (id, name) => {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) throw new Error("Invalid ID");

  const category = await Category.findByPk(idNum);
  if (!category) throw new Error("Category not found");

  return await category.update({ name });
};
// xóa category theo id
Category.deleteCategory = async (id) => {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) throw new Error("Invalid ID");

  const category = await Category.findByPk(idNum);
  if (!category) throw new Error("Category not found");

  await category.destroy();
  return { id: idNum };
};
// tìm kiếm category theo name
Category.findByName = async (name) => {
  if (!name) throw new Error("Category name is required");
  return await Category.findOne({ where: { name } });
};

module.exports = Category;
