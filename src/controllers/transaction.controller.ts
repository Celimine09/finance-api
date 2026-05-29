import { type Request, type Response } from "express";
import * as TransactionService from "../services/transaction.service";

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

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const newTransaction = await TransactionService.createTransaction(req.body);
    res.status(201).json({ status: "success", data: newTransaction });
  } catch (error) {
    console.error("POST Transaction Error:", error);
    res.status(400).json({ status: "error", message: "Invalid data provided" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Transaction ID is required and must be a string",
      });
    }
    const updatedTransaction = await TransactionService.updateTransaction(
      id,
      req.body,
    );
    res.status(200).json({ status: "success", data: updatedTransaction });
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
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Transaction ID is required and must be a string",
      });
    }
    const deletedTransaction = await TransactionService.deleteTransaction(id);
    res.status(200).json({ status: "success", data: deletedTransaction });
  } catch (error) {
    console.error("DELETE Transaction Error:", error);
    res
      .status(400)
      .json({ status: "error", message: "Could not delete transaction" });
  }
};
