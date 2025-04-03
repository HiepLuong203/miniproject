const Category = require("../models/category");
const Product = require("../models/product"); // Import Product model

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const results = await Category.getAll();
      res.status(200).json(results);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching categories: " + err.message });
    }
  },

  createCategory: async (req, res) => {
    const { name } = req.body;
    try {
      const result = await Category.createCategory(name);
      res.status(201).json({
        message: "Category created",
        id: result.id,
        name: result.name,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating category: " + err.message });
    }
  },

  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const result = await Category.updateCategory(id, name);
      res.status(200).json({
        message: "Category updated and related products updated",
        id: result.id,
        name: result.name,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating category: " + err.message });
    }
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Category.deleteCategory(id);
      res.status(200).json({ message: "Category deleted", id: result.id });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error deleting category: " + err.message });
    }
  },
  // Lấy danh sách sản phẩm theo category_name
  getProductsByCategory: async (req, res) => {
    const { category_name } = req.params; // Lấy category_name từ URL

    try {
      // Kiểm tra xem category có tồn tại không
      const category = await Category.findByName(category_name);
      if (!category) {
        return res
          .status(404)
          .json({ message: `Category '${category_name}' not found` });
      }

      // Lấy danh sách sản phẩm
      const products = await Product.getByCategory(category_name);
      if (products.length === 0) {
        return res.status(200).json({
          message: "No products found for this category",
          products: [],
        });
      }

      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: "Error fetching products" });
    }
  },
};

module.exports = categoryController;
