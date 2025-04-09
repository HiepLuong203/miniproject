import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connectdb";

class Product extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public description!: string;
  public name_category!: string;
  public image!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  //hien thi du lieu
  static async getAllProducts() {
    return await this.findAll();
  }
  //them moi 1 product
  static async addProduct(
    name: string,
    price: number,
    description: string,
    name_category: string,
    image: string
  ) {
    return await this.create({
      name,
      price,
      description,
      name_category,
      image,
    });
  }
  //cap nhat 1 product
  static async updateProduct(
    id: number,
    name: string,
    price: number,
    description: string,
    name_category: string,
    image: string
  ) {
    const product = await this.findByPk(id);
    if (!product) throw new Error("Product not found");
    await product.update({
      name,
      price,
      description,
      name_category,
      image,
    });
    return product;
  }
  //xoa product theo id
  static async deleteProduct(id: number) {
    const product = await this.findByPk(id);
    if (!product) throw new Error("Product not found");
    await product.destroy();
    return product;
  }
}
Product.init(
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
        check(value: number) {
          if (value < 0) {
            throw new Error("Price cannot be negative");
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
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
      type: DataTypes.STRING,
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
    modelName: "Product",
    tableName: "product",
  }
);
export default Product;
