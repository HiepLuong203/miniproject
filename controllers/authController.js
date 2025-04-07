const jwt = require("jsonwebtoken");
const User = require("../models/user");

class authController {
  // static #instance = null;
  // static getInstance() {
  //   if (!authController.#instance) {
  //     authController.#instance = new authController();
  //   }
  //   return authController.#instance;
  // }
  async register(req, res) {
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
      res
        .status(500)
        .json({ message: "Error registering user: " + err.message });
    }
  }

  async login(req, res) {
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
  }
}

module.exports = new authController();
