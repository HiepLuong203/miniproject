import { Request, Response } from "express";
import Product from "../models/product";
import Category from "../models/category";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class productController {
  public async getAllProducts(req: Request, res: Response) {
    try {
      const result = await Product.getAllProducts();
      res.status(200).json({ message: "Data Product:", result });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error fetching product: ${error.message}` });
    }
  }

  public async addProduct(req: MulterRequest, res: Response) {
    try {
      const { name, price, description, name_category } = req.body as {
        name: string;
        price: string;
        description: string;
        name_category: string;
      };
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const category = await Category.findByName(name_category);
      if (!category) {
        const categories = await Category.getAllCategories();
        const availableCategories = categories.map((cat) => cat.name);
        res.status(400).json({
          message: "Category does not exist",
          availableCategories,
        });
        return;
      }

      const result = await Product.create({
        name,
        price: parseFloat(price),
        description,
        name_category,
        image: imagePath,
      });

      res.status(201).json({ message: "Product created successfully", result });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: `Error creating product: ${error.message}` });
    }
  }

  public async updateProduct(req: MulterRequest, res: Response) {
    const id: number = parseInt(req.params.id, 10);
    const { name, price, description, name_category } = req.body as {
      name: string;
      price: string;
      description: string;
      name_category: string;
    };
    const priceF = parseFloat(price);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const category = await Category.findByName(name_category);
      if (!category) {
        const categories = await Category.getAllCategories();
        const availableCategories = categories.map((cat) => cat.name);
        res.status(400).json({
          message: "Category does not exist",
          availableCategories,
        });
        return;
      }

      const result = await Product.updateProduct(
        id,
        name,
        priceF,
        description,
        name_category,
        imagePath!
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
    } catch (error: any) {
      res
        .status(400)
        .json({ message: `Error updating product: ${error.message}` });
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    const id: number = parseInt(req.params.id, 10);
    try {
      const result = await Product.deleteProduct(id);
      res.status(200).json({
        message: "Deleted Product",
        id: result.id,
        name: result.name,
        price: result.price,
        description: result.description,
        name_category: result.name_category,
        image: result.image,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (error: any) {
      res
        .status(400)
        .json({ message: `Error deleting product: ${error.message}` });
    }
  }
}

export default new productController();
