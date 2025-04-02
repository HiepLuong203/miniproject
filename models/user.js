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
        // len: [1, 255],
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        // len: [1, 255],
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
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

// Phương thức static với validation
// tạo tạo khoản
User.createUser = async (username, password, role) => {
  return await User.create({ username, password, role });
};
// tìm kiếm theo username
User.findByUsername = async (username) => {
  // if (!username) throw new Error("Username is required");
  return await User.findOne({ where: { username } });
};
// hiển thị thông tin users
User.getAll = async () => {
  return await User.findAll();
};

module.exports = User;
