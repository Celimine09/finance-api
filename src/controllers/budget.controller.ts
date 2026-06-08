import { type Request, type Response } from "express";
import {
  createBudget,
  getBudgetsWithUsage,
  updateBudget,
} from "../services/budget.service";

export const createBudgetHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { categoryId, amount, period } = req.body;
    await createBudget(userId, { categoryId, amount, period });

    res
      .status(201)
      .json({ status: "success", message: "Create budget successfully" });
  } catch (error: any) {
    if (error?.message === "BUDGET_ALREADY_EXISTS") {
      return res.status(400).json({
        status: "error",
        message: "Already have a budget for this category and period",
      });
    }
    console.error("Error creating budget:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const getBudgetsHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const period = (req.query.period as string) || currentMonth;
    const budgets = await getBudgetsWithUsage(userId, period);

    res.status(200).json({ status: "success", data: budgets });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const updateBudgetHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const budgetId = req.params.id as string;
    const { amount } = req.body;

    await updateBudget(userId, budgetId, { amount });

    res
      .status(200)
      .json({ status: "success", message: "Update budget successfully" });
  } catch (error: any) {
    if (error?.message === "BUDGET_NOT_FOUND") {
      return res.status(404).json({
        status: "error",
        message: "Budget not found or you don't have permission to edit it",
      });
    }
    console.error("Error updating budget:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
