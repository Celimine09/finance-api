import { type Request, type Response } from "express";
import * as CategoryService from "../services/category.service";

export const getCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({ status: "success", data: categories });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Cannot fetch categories" });
  }
};
