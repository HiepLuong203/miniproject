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
        isInt: { msg: "ID must be an interger" },
      },
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Category name cannot empty" },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "category",
    timestamps: true,
  }
);
//Lấy tất cả dữ liệu
Category.getAllCategory = async () => {
  return await Category.findAll();
};
//Lất data theo id category
Category.getCategoryById = async (id) => {
  const idNum = Number(id);
  if (isNaN(idNum)) {
    throw new Error("Invalid ID");
  }
  return await Category.findOne({ where: { id: idNum } });
};
//Thêm 1 category
Category.addCategory = async (name) => {
  return await Category.create({ name });
};
//Sửa 1 category theo id
Category.updateCategory = async (id, name) => {
  const idNum = Number(id);
  if (isNaN(idNum)) throw new Error("Invalid ID");

  const category = await Category.findByPk(idNum);
  if (!category) throw new Error("Category not found");

  const oldName = category.name;
  await category.update({ name });

  // Cập nhật tất cả sản phẩm có name_category cũ sang tên mới
  await Product.update(
    { name_category: name },
    { where: { name_category: oldName } }
  );

  return category;
};

Category.deleteCategory = async (id) => {
  const idNum = Number(id);
  if (isNaN(idNum)) throw new Error("Invalid ID");
  const category = await Category.findByPk(idNum);
  if (!category) throw new Error("Category not found");
  // Check product nào có name_category cùng không
  const products = await Product.findAll({
    where: { name_category: category.name },
  });
  if (products.length > 0) {
    throw new Error(
      `Cannot delete category '${category.name}' because it is still associated with ${products.length} product(s)`
    );
  }
  await category.destroy();
  return category;
};
Category.findByName = async (name) => {
  if (!name) throw new Error("Category name is required");
  return await Category.findOne({ where: { name } });
};
module.exports = Category;
