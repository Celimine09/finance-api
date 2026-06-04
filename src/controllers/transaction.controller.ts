import { type Request, type Response } from "express";
import * as TransactionService from "../services/transaction.service";
import prisma from "../services/prisma.service";
import { createRecurringTask } from "../services/recurring.service";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await TransactionService.getAllTransactions();

    res.status(200).json({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getTransactionsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "User ID is required" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const month = req.query.month as string;
    const year = req.query.year as string;

    const result = await TransactionService.getTransactionsByUserId(
      userId,
      page,
      limit,
      month,
      year,
    );

    res.status(200).json({
      status: "success",
      data: result.transactions,
      meta: result.meta,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as { user?: { id: string } }).user?.id;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }
    const newTransaction = await TransactionService.createTransaction({
      ...req.body,
      userId,
    });
    res
      .status(201)
      .json({ status: "success", message: "Transaction created successfully" });
  } catch (error) {
    console.error("POST Transaction Error:", error);
    res.status(400).json({ status: "error", message: "Invalid data provided" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Transaction ID is required and must be a string",
      });
    }
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required and must be a string",
      });
    }
    const updatedTransaction = await TransactionService.updateTransaction(
      id,
      req.body,
      userId,
    );
    res
      .status(200)
      .json({ status: "success", message: "Transaction updated successfully" });
  } catch (error) {
    console.error("PATCH Transaction Error:", error);
    res
      .status(400)
      .json({ status: "error", message: "Could not update transaction" });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Transaction ID is required and must be a string",
      });
    }
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required and must be a string",
      });
    }
    const deletedTransaction = await TransactionService.deleteTransaction(
      id,
      userId,
    );
    res
      .status(200)
      .json({ status: "success", message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("DELETE Transaction Error:", error);
    res
      .status(400)
      .json({ status: "error", message: "Could not delete transaction" });
  }
};

export const getTransactionSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required and must be a string",
      });
    }
    const summary = await TransactionService.getTransactionSummary(userId);
    res.status(200).json({
      status: "success",
      data: summary,
    });
  } catch (error) {
    console.error("GET Transaction Summary Error:", error);
    res.status(500).json({
      status: "error",
      message: "Could not retrieve transaction summary",
    });
  }
};

export const getCategorySummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required and must be a string",
      });
    }
    const summary = await TransactionService.getCategorySummaryByUserId(userId);
    res.status(200).json({
      status: "success",
      data: summary,
    });
  } catch (error) {
    console.error("Get Category Summary Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const createRecurringTransaction = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required and must be a string",
      });
    }
    const recurringTask = await createRecurringTask(userId, req.body);

    res.status(201).json({
      status: "success",
      message: "ตั้งค่ารายการอัตโนมัติสำเร็จ",
      data: recurringTask,
    });
  } catch (error) {
    console.error("Error creating recurring transaction:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
