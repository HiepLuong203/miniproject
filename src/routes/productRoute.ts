import express, { Router } from "express";
import productController from "../controllers/productController";
import upload from "../middlewares/uploads";
import authenticateToken from "../middlewares/auth";
import roleUser from "../middlewares/role";

const router: Router = express.Router();

router.get("/", authenticateToken, productController.getAllProducts);
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

export default router;
