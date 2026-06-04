import { z } from "zod";

const transactionPayload = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, "Title cannot be empty"),
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Type must be INCOME or EXPENSE",
  }),
  category: z
    .string({ message: "Category is required" })
    .min(1, "Category cannot be empty"),
  note: z.string().optional(),
  date: z.string().optional(),
});

export const createTransactionSchema = z.object({ body: transactionPayload });
export const updateTransactionSchema = z.object({ body: transactionPayload.partial() });
