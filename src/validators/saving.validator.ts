import { z } from "zod";

const createGoalPayload = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, "Name cannot be empty"),
  targetAmount: z
    .number({ message: "Target amount is required" })
    .positive("Target amount must be a positive number"),
  deadline: z.string().optional(),
});

const addMoneyPayload = z.object({
  id: z
    .string({ message: "Goal ID is required" })
    .uuid("Invalid goal ID format"),
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be a positive number"),
});

export const createGoalSchema = z.object({ body: createGoalPayload });
export const addMoneySchema = z.object({
  params: z.object({
    id: z
      .string({ message: "Goal ID is required" })
      .uuid("Invalid goal ID format"),
  }),
  body: z.object({
    amount: z
      .number({ message: "Amount is required" })
      .positive("Amount must be a positive number"),
  }),
});
