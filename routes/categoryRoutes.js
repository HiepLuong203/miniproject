const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticateToken = require("../middlewares/auth");
const roleUser = require("../middlewares/role");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post(
  "/",
  authenticateToken,
  roleUser("admin"),
  categoryController.addCategory
);
router.put(
  "/:id",
  authenticateToken,
  roleUser("admin"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authenticateToken,
  roleUser("admin"),
  categoryController.deleteCategory
);

module.exports = router;
