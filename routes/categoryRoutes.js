const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticateToken = require("../middleware/auth");
const roleUser = require("../middleware/role");

router.get("/", authenticateToken, categoryController.getAllCategories);
router.post(
  "/",
  authenticateToken,
  roleUser("admin"),
  categoryController.createCategory
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
router.get(
  "/:category_name",
  authenticateToken,
  categoryController.getProductsByCategory
);
module.exports = router;
