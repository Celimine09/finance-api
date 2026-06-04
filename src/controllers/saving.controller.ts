import { type Request, type Response } from "express";
import * as SavingsService from "../services/saving.service";
import id from "zod/v4/locales/id.js";

export const createGoalHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { name, targetAmount, deadline } = req.body;

    const newGoal = await SavingsService.createSavingsGoal(userId, {
      name,
      targetAmount,
      deadline,
    });

    res.status(201).json({ status: "success", data: newGoal });
  } catch (error: any) {
    console.error("Error creating savings goal:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const getGoalsHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const goals = await SavingsService.getSavingsGoals(userId);

    res.status(200).json({ status: "success", data: goals });
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const addMoneyHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { amount } = req.body;
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Goal ID is required and must be a string",
      });
    }

    const updatedGoal = await SavingsService.addMoneyToGoal(userId, id, amount);

    res.status(200).json({
      status: "success",
      message: "Savings added successfully!",
      data: updatedGoal,
    });
  } catch (error: any) {
    if (error?.message === "GOAL_NOT_FOUND") {
      return res
        .status(404)
        .json({ status: "error", message: "Goal not found" });
    }
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
