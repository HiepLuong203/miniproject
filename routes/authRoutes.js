const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middlewares/auth");
const roleUser = require("../middlewares/role");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
