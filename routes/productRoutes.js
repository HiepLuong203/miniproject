const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require("../middlewares/auth");
const roleUser = require("../middlewares/role");
const upload = require("../middlewares/uploads");

router.get("/", productController.getAllProducts);
router.post(
  "/",
  authenticateToken,
  roleUser("admin"),
  upload.single("image"),
  productController.addProduct
);
router.put(
  "/:id",
  authenticateToken,
  roleUser("admin"),
  upload.single("image"),
  productController.updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  roleUser("admin"),
  productController.deleteProduct
);
module.exports = router;
