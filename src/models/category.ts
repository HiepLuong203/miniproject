import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connectdb";
import Product from "../models/product";
class Category extends Model {
  public id!: number;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static async getAllCategories() {
    return this.findAll();
  }

  static async getCategoryById(id: number) {
    return this.findByPk(id);
  }

  static async addCategory(name: string) {
    return this.create({ name });
  }

  static async updateCategory(id: number, name: string) {
    const category = await this.findByPk(id);
    if (!category) throw new Error("Category not found");
    const oldName: string = category.name;
    await category.update({ name });
    // update product có name_category liên quan
    await Product.update(
      { name_category: name },
      { where: { name_category: oldName } }
    );
    return category;
  }

  static async deleteCategory(id: number) {
    const category = await this.findByPk(id);
    if (!category) throw new Error("Category not found");
    // Kiểm tra xem có sản phẩm nào đang sử dụng category này không
    const products = await Product.findAll({
      where: { name_category: category.name },
    });
    if (products.length > 0) {
      throw new Error(
        `Cannot delete category ${category.name} because it is still associated with ${products.length} products`
      );
    }
    await category.destroy();
    return category;
  }

  static async findByName(name: string) {
    return this.findOne({ where: { name } });
  }
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    sequelize,
    modelName: "Category",
    tableName: "category",
  }
);

export default Category;
