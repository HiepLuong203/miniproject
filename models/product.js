const { Sequelize, DataTypes, FLOAT, INTEGER } = require("sequelize");

const sequelize = require("../config/connectdb");

class Product {
  static model = sequelize.define(
    "Product",
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
        validate: {
          notEmpty: { msg: "Product name cannot empty" },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isNumeric: { msg: "Price must is number" },
          check(value) {
            if (value < 0) {
              throw new Error("Price cannot be negative");
            }
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        notEmpty: true,
        allowNull: true,
      },
      name_category: {
        type: DataTypes.STRING(250),
        allowNull: false,
        references: {
          model: "category",
          key: "name",
        },
        validate: {
          notEmpty: { msg: "Category_name cannot be empty" },
          // len: [1, 250],
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        notEmpty: true,
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
    { tableName: "product", timestamps: true }
  );
  //hien thi du lieu
  static async getAllProducts() {
    return await this.model.findAll();
  }
  //them moi 1 product
  static async addProduct(name, price, description, name_category, image) {
    return await this.model.create({
      name,
      price,
      description,
      name_category,
      image,
    });
  }
  //cap nhat 1 product
  static async updateProduct(name, price, description, name_category, image) {
    const idNum = Number(id);
    if (isNaN(idNum)) throw new Error("Invalid ID");
    const pUpdate = await this.model.findByPk(idNum);
    if (!pUpdate) throw new Error("Product not found");
    return await pUpdate.update({
      name,
      price,
      description,
      name_category,
      image,
    });
  }
  //xoa product theo id
  static async deleteProduct(id) {
    const idNum = Number(id);
    if (isNaN(idNum)) throw new Error("Invalid ID");
    const pDelete = await this.model.findByPk(idNum);
    if (!pDelete) throw new Error("Product not found");
    await pDelete.destroy();
    return pDelete;
  }
}
module.exports = Product;
