const Product = require("../models/product");
const Category = require("../models/category");
const productController = {
  getAllProducts: async (req, res) => {
    try {
      const result = await Product.getAllProducts();
      res.status(200).json({ message: "Data Product:", result });
    } catch (error) {
      res
        .status(500)
        .json({ messsage: "Error fetching product" + error.messsage });
    }
  },
  // Thêm sản phẩm mới
  addProduct: async (req, res) => {
    try {
      const { name, price, description, name_category } = req.body;
      const imagePath = req.file ? "/uploads/" + req.file.filename : null; // Lưu đường dẫn ảnh
      // Kiểm tra nếu danh mục tồn tại
      const category = await Category.findByName(name_category);
      if (!category) {
        const categories = await Category.getAllCategory();
        const availableCategories = categories.map((cat) => cat.name);
        return res.status(400).json({
          message: "Category does not exist",
          availableCategories,
        });
      }

      const result = await Product.create({
        name,
        price: parseFloat(price),
        description,
        name_category,
        image: imagePath,
      });

      res.status(201).json({ message: "Product created successfully", result });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating product: " + error.message });
    }
  },
  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, price, description, name_category } = req.body;
    const priceF = parseFloat(price);
    const imagePath = req.file ? "/uploads/" + req.file.filename : null; // Lưu đường dẫn ảnh
    try {
      const category = await Category.findByName(name_category);
      if (!category) {
        const categories = await Category.getAllCategory();
        const availableCategories = categories.map((cate) => {
          return cate.name;
        });
        return res.status(400).json({
          message: "Category does not exist",
          availableCategories,
        });
      }
      const result = await Product.updateProduct(
        id,
        name,
        priceF,
        description,
        name_category,
        imagePath
      );
      res.status(200).json({
        message: "Product updated",
        id: result.id,
        name: result.name,
        price: result.price,
        image: result.image,
        name_category: result.name_category,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error update product: " + error.message });
    }
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Product.deleteProduct(id);
      return res.status(201).json({
        message: "Deleted Product",
        id: result.id,
        name: result.name,
        price: result.price,
        description: result.description,
        name_category: result.name_category,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error delete product: " + error.message });
    }
  },
};
module.exports = productController;
