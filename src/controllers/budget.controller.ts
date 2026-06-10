import { type Request, type Response } from "express";
import {
  createBudget,
  getBudgetsWithUsage,
  updateBudget,
} from "../services/budget.service";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createBudgetHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const { categoryId, amount, period, isAutoRenew } = req.body;

    await createBudget(userId, {
      categoryId,
      amount: Number(amount),
      period,
      isAutoRenew: typeof isAutoRenew === "boolean" ? isAutoRenew : undefined,
    });

    res
      .status(201)
      .json({ status: "success", message: "Create budget successfully" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "BUDGET_ALREADY_EXISTS") {
      res.status(400).json({
        status: "error",
        message: "Already have a budget for this category and period",
      });
      return;
    }
    console.error("Error creating budget:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const getBudgetsHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const period = (req.query.period as string) || currentMonth;
    const budgets = await getBudgetsWithUsage(userId, period);

    res.status(200).json({ status: "success", data: budgets });
  } catch (error: unknown) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const updateBudgetHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const budgetId = req.params.id;
    if (!budgetId || typeof budgetId !== "string") {
      res
        .status(400)
        .json({ status: "error", message: "Invalid ID parameter" });
      return;
    }
    const { amount, isAutoRenew } = req.body;

    await updateBudget(userId, budgetId, {
      amount: amount !== undefined ? Number(amount) : undefined,
      isAutoRenew: typeof isAutoRenew === "boolean" ? isAutoRenew : undefined,
    });

    res
      .status(200)
      .json({ status: "success", message: "Update budget successfully" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "BUDGET_NOT_FOUND") {
      res.status(404).json({
        status: "error",
        message: "Budget not found or you don't have permission to edit it",
      });
      return;
    }
    console.error("Error updating budget:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
