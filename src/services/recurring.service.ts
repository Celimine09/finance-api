import prisma from "./prisma.service";
import { Frequency, TransactionType } from "@prisma/client";

export const createRecurring = async (data: {
  userId: string;
  categoryId: string;
  title: string;
  amount: number;
  type: TransactionType;
  note?: string;
  frequency: Frequency;
  nextRun: Date;
}) => {
  return await prisma.recurringTransaction.create({
    data,
  });
};

export const getRecurringByUser = async (userId: string) => {
  return await prisma.recurringTransaction.findMany({
    where: { userId },
    include: {
      category: {
        select: { name: true, color: true },
      },
    },
    orderBy: [{ nextRun: "asc" }, { createdAt: "asc" }],
  });
};

export const updateRecurring = async (
  id: string,
  userId: string,
  data: Partial<{
    title: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    note: string;
    frequency: Frequency;
    nextRun: Date;
    isActive: boolean;
  }>,
) => {
  const existing = await prisma.recurringTransaction.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND_OR_UNAUTHORIZED");
  }

  return await prisma.recurringTransaction.update({
    where: { id },
    data,
  });
};

export const deleteRecurring = async (id: string, userId: string) => {
  const existing = await prisma.recurringTransaction.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND_OR_UNAUTHORIZED");
  }

  return await prisma.recurringTransaction.delete({
    where: { id },
  });
};
