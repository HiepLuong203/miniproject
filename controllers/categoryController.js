const Category = require("../models/category");
const Product = require("../models/product");
const categoryController = {
  getAllCategories(req, res) {
    Category.getAll((err, results) => {
      if (err) return res.status(500).send("Error fetching categories");
      res.status(200).json(results);
    });
  },

  createCategory(req, res) {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send("Category name is required");
    }
    Category.create(name, (err, result) => {
      if (err) {
        console.log("Create error:", err);
        return res.status(500).send("Error creating category");
      }
      res.status(201).json({
        message: "Category created",
        id: result.insertId, // Trả về id tự động tạo
        name,
      });
    });
  },

  updateCategory(req, res) {
    const { id } = req.params; // Lấy id từ URL
    const { name } = req.body; // Lấy name từ body
    if (!name || !id) {
      return res.status(400).send("ID and Name are required");
    }
    Category.update(name, id, (err) => {
      if (err) {
        if (err.message === "Category not found") {
          return res.status(404).send("Category not found");
        }
        if (err.message === "Invalid ID") {
          return res.status(400).send("Invalid ID");
        }
        console.log("Update error:", err);
        return res
          .status(500)
          .json({ message: "Error updating category", error: err.message });
      }
      res.status(200).json({ message: "Category updated", id, name });
    });
  },

  deleteCategory(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("ID is required");
    }
    Category.delete(id, (err) => {
      if (err) {
        // Nếu còn sản phẩm liên quan
        if (err.message === "Cannot delete category") {
          return res.status(err.status).json({
            message: err.message,
            reason: err.reason,
          });
        }
        // Kiểm tra nếu category không tồn tại
        if (err.message === "Category not found") {
          return res
            .status(404)
            .json({ message: "Category not found ID" + id });
        }
        // Kiểm tra nếu ID không hợp lệ
        if (err.message === "Invalid ID") {
          return res.status(400).json({ message: "Invalid ID" });
        }
        // Lỗi khác
        console.log("Delete error:", err);
        return res
          .status(500)
          .json({ message: "Error deleting category", error: err.message });
      }
      res.status(200).json({ message: "Category deleted", id });
    });
  },
  //Lấy danh sách sản phẩm theo category_name
  getProductsByCategory(req, res) {
    const { category_name } = req.params; // Lấy category_name từ URL
    if (!category_name) {
      return res.status(400).send("Category name is required");
    }

    // Kiểm tra xem category có tồn tại không
    Category.findByName(category_name, (err, category) => {
      if (err) {
        console.log("Error checking category:", err);
        return res.status(500).send("Error checking category");
      }
      if (!category) {
        return res.status(404).send(`Category '${category_name}' not found`);
      }

      // Lấy danh sách sản phẩm
      Product.getByCategory(category_name, (err, products) => {
        if (err) {
          console.log("Error fetching products:", err);
          return res.status(500).send("Error fetching products");
        }
        if (products.length === 0) {
          return res.status(200).json({
            message: "No products found for this category",
            products: [],
          });
        }
        res.status(200).json(products);
      });
    });
  },
};

module.exports = categoryController;
