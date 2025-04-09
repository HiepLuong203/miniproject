import Category from "../models/category";
import express, { Express, Request, Response } from "express";
import Product from "../models/product";
class categoryController {
  // static #instance = null;
  // static getInstance() {
  //   if (!categoryController.#instance) {
  //     categoryController.#instance = new categoryController();
  //   }
  //   return categoryController.#instance;
  // }
  // Lấy tất cả các danh mục
  public async getAllCategories(req: Request, res: Response) {
    try {
      const result = await Category.getAllCategories();
      res.status(200).json({ message: "Data Category", result });
    } catch (error: any) {
      console.error("Error in getAllCategories:", error); // Ghi log lỗi chi tiết
      res
        .status(500)
        .json({ message: "Error fetching category: " + error.message });
    }
  }

  // Lấy danh mục theo ID
  public async getCategoryById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id, 10);
    try {
      const result = await Category.getCategoryById(id);
      if (!result) {
        res.status(404).json({ message: `Category ID ${id} not found` });
        return;
      }
      res.status(200).json({ message: `Found Category ID: ${id}`, result });
    } catch (error: any) {
      res
        .status(404)
        .json({ message: `Error fetching Category: ${error.message}` });
    }
  }

  // Thêm danh mục mới
  public async addCategory(req: Request, res: Response) {
    const { name } = req.body as { name: string };
    try {
      const result = await Category.addCategory(name);
      res.status(201).json({
        message: "Category created",
        id: result.id,
        name: result.name,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error adding category:  " + error.message });
    }
  }

  // Cập nhật danh mục
  public async updateCategory(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const { name } = req.body as { name: string };
    try {
      const result = await Category.updateCategory(id, name);
      res.status(200).json({
        message: "Category and related products updated",
        id: result.id,
        name: result.name,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ message: "Error updating category: " + err.message });
    }
  }

  // Xóa danh mục
  public async deleteCategory(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      const result = await Category.deleteCategory(id);
      res.status(200).json({
        message: "Category deleted",
        id: result.id,
        name: result.name,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error deleting category: " + error.message });
    }
  }

  //Lấy Products theo name_category
  public async getProductsByCategory(
    req: Request<{ name: string }>,
    res: Response
  ): Promise<void> {
    const { name } = req.params;
    try {
      const category = await Category.findByName(name);

      if (!category) {
        res.status(404).json({ message: `Category '${name}' not found` });
        return;
      }

      const products = await Product.findAll({
        where: { name_category: category.name },
      });

      if (products.length === 0) {
        res.status(200).json({
          message: "No products found for this category",
          products: [],
        });
        return;
      }

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  }
}

export default new categoryController();
