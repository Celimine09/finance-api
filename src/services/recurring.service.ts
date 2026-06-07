import { Frequency, TransactionType } from "@prisma/client";
import prisma from "./prisma.service";

interface CreateRecurringDTO {
  title: string;
  amount: number;
  type: TransactionType;
  category?: string;
  frequency: Frequency;
}

export const createRecurringTask = async (
  userId: string,
  data: CreateRecurringDTO,
) => {
  const nextRun = new Date();
  if (data.frequency === "DAILY") nextRun.setDate(nextRun.getDate() + 1);
  if (data.frequency === "WEEKLY") nextRun.setDate(nextRun.getDate() + 7);
  if (data.frequency === "MONTHLY") nextRun.setMonth(nextRun.getMonth() + 1);
  if (data.frequency === "YEARLY")
    nextRun.setFullYear(nextRun.getFullYear() + 1);

  return await prisma.recurringTransaction.create({
    data: {
      userId,
      title: data.title,
      amount: data.amount,
      type: data.type,
      ...(data.category ? { categoryId: data.category } : {}),
      frequency: data.frequency,
      nextRun,
    },
  });
};
