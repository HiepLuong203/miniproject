const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");
const roleUser = require("../middleware/role");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/userslist",
  authenticateToken,
  roleUser("admin"),
  authController.getAlluser
);

module.exports = router;
