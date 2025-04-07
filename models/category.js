const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectdb");
const Product = require("./product");

class Category {
  static model = sequelize.define(
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
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Category name cannot be empty" },
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
  static async getAllCategories() {
    return await this.model.findAll();
  }

  static async getCategoryById(id) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new Error("Invalid ID");
    }
    return await this.model.findOne({ where: { id: idNum } });
  }

  static async addCategory(name) {
    return await this.model.create({ name });
  }

  static async updateCategory(id, name) {
    const idNum = Number(id);
    if (isNaN(idNum)) throw new Error("Invalid ID");

    const category = await this.model.findByPk(idNum);
    if (!category) throw new Error("Category not found");

    const oldName = category.name;
    await category.update({ name });

    // Cập nhật tất cả sản phẩm có name_category cũ sang tên mới
    await Product.update(
      { name_category: name },
      { where: { name_category: oldName } }
    );

    return category;
  }

  static async deleteCategory(id) {
    const idNum = Number(id);
    if (isNaN(idNum)) throw new Error("Invalid ID");

    const category = await this.model.findByPk(idNum);
    if (!category) throw new Error("Category not found");

    // Kiểm tra xem có sản phẩm nào đang sử dụng category này không
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
  }

  static async findByName(name) {
    if (!name) throw new Error("Category name is required");
    return await this.model.findOne({ where: { name } });
  }
}

module.exports = Category;
