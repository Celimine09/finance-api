import { z } from "zod";

const createBudgetPayload = z.object({
  categoryId: z
    .string({ message: "Category ID is required" })
    .uuid("Category ID must be a valid UUID"),
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
  period: z
    .string({ message: "Period is required" })
    .regex(/^\d{4}-\d{2}$/, "Period must be in YYYY-MM format (e.g., 2026-06)"),
});

const updateBudgetPayload = z.object({
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
});

export const createBudgetSchema = z.object({ body: createBudgetPayload });
