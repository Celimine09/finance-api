import { type Request, type Response } from "express";
import * as RecurringService from "../services/recurring.service";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createRecurring = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const { categoryId, title, amount, type, note, frequency, nextRun } =
      req.body;

    const newRecurring = await RecurringService.createRecurring({
      userId,
      categoryId,
      title,
      amount: Number(amount),
      type,
      note,
      frequency,
      nextRun: new Date(nextRun),
    });

    res.status(201).json({ status: "success", data: newRecurring });
  } catch (error: unknown) {
    console.error("Create Recurring Error:", error);
    res.status(500).json({
      status: "error",
      message: "Could not create recurring transaction",
    });
  }
};

export const getRecurring = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const items = await RecurringService.getRecurringByUser(userId);

    res.status(200).json({ status: "success", data: items });
  } catch (error: unknown) {
    console.error("Get Recurring Error:", error);
    res.status(500).json({
      status: "error",
      message: "Could not fetch recurring transactions",
    });
  }
};

export const updateRecurring = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res
        .status(400)
        .json({ status: "error", message: "Invalid ID parameter" });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.nextRun) {
      updateData.nextRun = new Date(updateData.nextRun);
    }
    if (updateData.amount) {
      updateData.amount = Number(updateData.amount);
    }

    const updated = await RecurringService.updateRecurring(
      id,
      userId,
      updateData,
    );

    res.status(200).json({ status: "success", data: updated });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "NOT_FOUND_OR_UNAUTHORIZED"
    ) {
      res
        .status(404)
        .json({ status: "error", message: "Recurring transaction not found" });
      return;
    }
    console.error("Update Recurring Error:", error);
    res.status(500).json({
      status: "error",
      message: "Could not update recurring transaction",
    });
  }
};

export const deleteRecurring = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    if (!id || typeof id !== "string") {
      res
        .status(400)
        .json({ status: "error", message: "Invalid ID parameter" });
      return;
    }

    await RecurringService.deleteRecurring(id, userId);

    res
      .status(200)
      .json({ status: "success", message: "Deleted successfully" });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "NOT_FOUND_OR_UNAUTHORIZED"
    ) {
      res
        .status(404)
        .json({ status: "error", message: "Recurring transaction not found" });
      return;
    }
    console.error("Delete Recurring Error:", error);
    res.status(500).json({
      status: "error",
      message: "Could not delete recurring transaction",
    });
  }
};
