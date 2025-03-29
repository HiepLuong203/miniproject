const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authController = {
  register(req, res) {
    const { username, password, role } = req.body;

    // Validation cơ bản
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    // Nếu không có role, mặc định là user
    const userRole = role && ["admin", "user"].includes(role) ? role : "user";

    User.create(username, password, userRole, (err, result) => {
      if (err) return res.status(500).send("Error registering user");
      res
        .status(201)
        .json({ message: "User registered", username, password, userRole });
    });
  },

  login(req, res) {
    const { username, password } = req.body;

    User.findByUsername(username, (err, user) => {
      if (err || !user) return res.status(404).send("User not found");

      if (password !== user.password)
        return res.status(401).send("Invalid password");

      // Thêm role vào payload của token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).send({ auth: true, token, role: user.role });
    });
  },
  getAlluser(req, res) {
    User.getAll((err, results) => {
      if (err) return res.status(500).send("Error fetching users");
      res.status(200).json(results);
    });
  },
};

module.exports = authController;
