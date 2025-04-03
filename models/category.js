const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectdb");
const Product = require("./product");

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

  const oldName = category.name;
  await category.update({ name });

  // Cập nhật tất cả sản phẩm có category_name cũ sang tên mới
  await Product.update(
    { category_name: name },
    { where: { category_name: oldName } }
  );

  return category;
};
// xóa category theo id
Category.deleteCategory = async (id) => {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) throw new Error("Invalid ID");

  const category = await Category.findByPk(idNum);
  if (!category) throw new Error("Category not found");
  // Check product nào có category_name cùng không
  const products = await Product.findAll({
    where: { category_name: category.name },
  });
  if (products.length > 0) {
    throw new Error(
      `Cannot delete category '${category.name}' because it is still associated with ${products.length} product(s)`
    );
  }
  await category.destroy();
  return { id: idNum };
};
// tìm kiếm category theo name
Category.findByName = async (name) => {
  if (!name) throw new Error("Category name is required");
  return await Category.findOne({ where: { name } });
};

module.exports = Category;
