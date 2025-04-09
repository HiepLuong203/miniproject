import express, { Router } from "express";
import categoryController from "../controllers/categoryController";
import authenticateToken from "../middlewares/auth";
import roleUser from "../middlewares/role";

const router: Router = express.Router();

// Bind các phương thức để giữ context
router.get("/", authenticateToken, categoryController.getAllCategories);
router.get("/:id", authenticateToken, categoryController.getCategoryById);
router.get(
  "/products/:name",
  authenticateToken,
  categoryController.getProductsByCategory
);

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

export default router;
