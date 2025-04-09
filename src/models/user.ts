import { Model, DataTypes } from "sequelize";
import sequelize from "../config/connectdb";
class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: string;
  //tao tai khoan
  static async createUser(username: string, password: string, role = "user") {
    try {
      const user = await User.create({ username, password, role });
      return user;
    } catch (error: any) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  //check username
  static async findByUsername(username: string) {
    try {
      const user = await User.findOne({ where: { username } });
      return user;
    } catch (error: any) {
      throw new Error(`Username not exist: ${error.message}`);
    }
  }
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Username cannot be empty" },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: {
          args: [["admin", "user"]],
          msg: "Role must be either 'admin' or 'user'",
        },
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
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);
export default User;
