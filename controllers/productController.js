const Product = require("../models/product");
const Category = require("../models/category");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const results = await Product.getAll();
      res.status(200).json(results);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching products: " + err.message });
    }
  },

  createProduct: async (req, res) => {
    const { name, price, category_name } = req.body;

    try {
      const category = await Category.findByName(category_name);
      if (!category) {
        const categories = await Category.getAll();
        const availableCategories = categories.map((cat) => cat.name);
        return res.status(400).json({
          message: "Category does not exist",
          availableCategories,
        });
      }

      const result = await Product.createProduct(name, price, category_name);
      res.status(201).json({
        message: "Product created",
        id: result.id,
        name: result.name,
        price: result.price,
        category_name: result.category_name,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating product: " + err.message });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, price, category_name } = req.body;

    try {
      const category = await Category.findByName(category_name);
      if (!category) {
        const categories = await Category.getAll();
        const availableCategories = categories.map((cat) => cat.name);
        return res.status(400).json({
          message: "Category does not exist",
          availableCategories,
        });
      }

      const result = await Product.updateProduct(
        id,
        name,
        price,
        category_name
      );
      res.status(200).json({
        message: "Product updated",
        id: result.id,
        name: result.name,
        price: result.price,
        category_name: result.category_name,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating product: " + err.message });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await Product.deleteProduct(id);
      res.status(200).json({ message: "Product deleted", id: result.id });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error deleting product: " + err.message });
    }
  },
};

module.exports = productController;
