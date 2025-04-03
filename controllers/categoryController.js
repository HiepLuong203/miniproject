const Category = require("../models/category");
const Product = require("../models/product");
const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const result = await Category.getAllCategory();
      res.status(200).json({ message: "Data Category", result });
    } catch (error) {
      res.status(500).json({ message: "Error fetching category: ", error });
    }
  },
  getCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Category.getCategoryById(id);
      if (!result) {
        return res.status(404).json({ message: `Category ID ${id} not found` });
      }
      res.status(200).json({ message: `Found Catagory ID: ${id}`, result });
    } catch (error) {
      res
        .status(404)
        .json({ message: "Error fetching Category: " + error.message });
    }
  },
  addCategory: async (req, res) => {
    const { name } = req.body;
    try {
      const result = await Category.addCategory(name);
      res.status(201).json({
        message: "Category created",
        id: result.id,
        name: result.name,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error add category:  " + error.message });
    }
  },
  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const result = await Category.updateCategory(id, name);
      res.status(200).json({
        message: "Category and related products updated",
        id: result.id,
        name: result.name,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error update category: " + err.message });
    }
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Category.deleteCategory(id);
      res.status(200).json({
        message: "Category deleted",
        id: result.id,
        name: result.name,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error delete category: " + error.message });
    }
  },
  //Lấy Products theo name_category
  getProductsByCategory: async (req, res) => {
    try {
      const { name } = req.params;

      // Tìm category theo tên
      const category = await Category.findOne({ where: { name } });

      if (!category) {
        return res
          .status(404)
          .json({ message: `Category '${name}' not found` });
      }

      // Lấy Product thuộc category đó
      const products = await Product.findAll({
        where: { name_category: category.name },
      });

      if (products.length === 0) {
        return res.status(200).json({
          message: "No products found for this category",
          products: [],
        });
      }

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  },
};
module.exports = categoryController;
