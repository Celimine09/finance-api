import prisma from "./prisma.service";
import { type Prisma } from "@prisma/client";

export const getAllTransactions = async () => {
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      date: "desc",
    },
  });
  return transactions;
};

export const createTransaction = async (
  data: Prisma.TransactionCreateInput,
) => {
  return await prisma.transaction.create({
    data,
  });
};

export const updateTransaction = async (
  id: string,
  data: Prisma.TransactionUpdateInput,
) => {
  return await prisma.transaction.update({
    where: { id },
    data,
  });
};

export const deleteTransaction = async (id: string) => {
  return await prisma.transaction.delete({
    where: { id },
  });
};
