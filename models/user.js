const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectdb");

const User = sequelize.define(
  "User",
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
    tableName: "users",
    timestamps: true,
  }
);

//tao tai khoan
User.createUser = async (username, password, role = "user") => {
  try {
    const user = await User.create({ username, password, role });
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

//check username
User.findByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    return user;
  } catch (error) {
    throw new Error(`Username not exist: ${error.message}`);
  }
};

module.exports = User;
