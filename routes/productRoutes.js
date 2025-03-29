const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/auth");
const roleUser = require("../middleware/role");

router.get("/", authenticateToken, productController.getAllProducts);
router.post(
  "/",
  authenticateToken,
  roleUser("admin"),
  productController.createProduct
);
router.put(
  "/:id",
  authenticateToken,
  roleUser("admin"),
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  roleUser("admin"),
  productController.deleteProduct
);

module.exports = router;
