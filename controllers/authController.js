const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authController = {
  register: async (req, res) => {
    const { username, password, role } = req.body;

    try {
      const userRole = role && ["admin", "user"].includes(role) ? role : "user";
      const result = await User.createUser(username, password, userRole);
      res.status(201).json({
        message: "User registered",
        username: result.username,
        role: result.role,
      });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        return res.status(400).json({ message: err.errors[0].message }); // Trả về msg từ validation
      }
      res
        .status(500)
        .json({ message: "Error registering user: " + err.message });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      res.status(200).json({ auth: true, token, role: user.role });
    } catch (err) {
      if (err.message === "Username is required") {
        return res.status(400).json({ message: "Username is required" });
      }
      res.status(500).json({ message: "Error logging in: " + err.message });
    }
  },

  getAlluser: async (req, res) => {
    try {
      const results = await User.getAll();
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users: " + err.message });
    }
  },
};

module.exports = authController;
