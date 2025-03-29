const Product = require("../models/product");
const Category = require("../models/category");

const productController = {
  getAllProducts(req, res) {
    Product.getAll((err, results) => {
      if (err) return res.status(500).send("Error fetching products");
      res.status(200).json(results);
    });
  },

  createProduct(req, res) {
    const { name, price, category_name } = req.body;

    // Validation cơ bản
    if (!name || !price || !category_name) {
      return res
        .status(400)
        .send("Name, price, and category_name are required");
    }

    // Kiểm tra category_name có tồn tại không
    Category.findByName(category_name, (err, category) => {
      if (err) return res.status(500).send("Error checking category");

      if (!category) {
        // Lấy danh sách tất cả category_name để gợi ý
        Category.getAll((err, categories) => {
          if (err) return res.status(500).send("Error fetching categories");
          const availableCategories = categories.map((cat) => cat.name);
          return res.status(400).json({
            message: "Category does not exist",
            availableCategories: availableCategories,
          });
        });
        return;
      }

      // Nếu danh mục tồn tại, tạo sản phẩm
      Product.create(name, price, category_name, (err) => {
        if (err) {
          // Nếu lỗi do ràng buộc khóa ngoại, trả về thông báo chi tiết
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res
              .status(400)
              .send("Category does not exist in the database");
          }
          return res
            .status(500)
            .json({ message: "Error creating product", error: err.message });
        }
        res.status(201).json({
          message: "Product created",

          name,
          price,
          category_name,
        });
      });
    });
  },

  updateProduct(req, res) {
    const { id } = req.params;
    const { name, price, category_name } = req.body;

    // Validation cơ bản
    if (!name || !price || !category_name) {
      return res
        .status(400)
        .send("Name, price, and category_name are required");
    }

    // Kiểm tra category_name có tồn tại không
    Category.findByName(category_name, (err, category) => {
      if (err) return res.status(500).send("Error checking category");

      if (!category) {
        // Lấy danh sách tất cả category_name để gợi ý
        Category.getAll((err, categories) => {
          if (err) return res.status(500).send("Error fetching categories");
          const availableCategories = categories.map((cat) => cat.name);
          return res.status(400).json({
            message: "Category does not exist",
            availableCategories: availableCategories,
          });
        });
        return;
      }

      // Nếu danh mục tồn tại, cập nhật sản phẩm
      Product.update(name, price, category_name, id, (err) => {
        if (err) {
          if (
            err.code === "ER_NO_REFERENCED_ROW_2" ||
            err.message === "Product not found"
          ) {
            return res
              .status(400)
              .send("Product does not exist in the database");
          }

          return res
            .status(500)
            .json({ message: "Error updating product", error: err.message });
        }
        res
          .status(200)
          .json({ message: "Product updated", id, name, price, category_name });
      });
    });
  },

  deleteProduct(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("ID is required");
    }
    Product.delete(id, (err) => {
      if (err) {
        if (err.message === "Product not found") {
          return res.status(404).send("Product not found");
        }
        // console.log("Delete error:", err);
        return res
          .status(500)
          .json({ message: "Error deleting product", error: err.message });
      }
      res.status(200).json({ message: "Product deleted", id });
    });
  },
};
module.exports = productController;
