import { z } from "zod";

const createBudgetPayload = z.object({
  category: z
    .string({ message: "Category is required" })
    .min(1, "Category cannot be empty"),
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
  period: z
    .string({ message: "Period is required" })
    .regex(/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format (e.g., 2026-06)"),
});

export const createBudgetSchema = z.object({ body: createBudgetPayload });
