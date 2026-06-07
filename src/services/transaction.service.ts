import prisma from "./prisma.service";
import { type Prisma } from "@prisma/client";

export const getAllTransactions = async () => {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: { category: true },
  });
  return transactions;
};

export const getTransactionsByUserId = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  month?: string,
  year?: string,
) => {
  const skip = (page - 1) * limit;
  const whereClause: any = { userId: userId };

  if (month && year) {
    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
    const nextYear =
      parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
    const endDate = new Date(
      `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01T00:00:00.000Z`,
    );
    whereClause.date = { gte: startDate, lt: endDate };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      skip: skip,
      take: limit,
      include: { category: true },
    }),
    prisma.transaction.count({ where: whereClause }),
  ]);

  return {
    transactions,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const createTransaction = async (
  data: Prisma.TransactionUncheckedCreateInput,
) => {
  return await prisma.transaction.create({ data });
};

export const updateTransaction = async (
  id: string,
  data: Prisma.TransactionUpdateInput,
  userId: string,
) => {
  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
  });
  if (!existing) throw new Error("TRANSACTION_NOT_FOUND_OR_UNAUTHORIZED");
  return await prisma.transaction.update({ where: { id }, data });
};

export const deleteTransaction = async (id: string, userId: string) => {
  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
  });
  if (!existing) throw new Error("TRANSACTION_NOT_FOUND_OR_UNAUTHORIZED");
  return await prisma.transaction.delete({ where: { id } });
};

export const getTransactionSummary = async (userId: string) => {
  const aggregations = await prisma.transaction.groupBy({
    by: ["type"],
    where: { userId: userId },
    _sum: { amount: true },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  aggregations.forEach((item) => {
    if (item.type === "INCOME") totalIncome = item._sum.amount || 0;
    else if (item.type === "EXPENSE") totalExpense = item._sum.amount || 0;
  });

  return {
    totalIncome: totalIncome,
    totalExpense: totalExpense,
    balance: totalIncome - totalExpense,
  };
};

export const getCategorySummaryByUserId = async (userId: string) => {
  const categorySummary = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId: userId,
      type: "EXPENSE",
      categoryId: { not: null },
    },
    _sum: { amount: true },
  });

  const categoryIds = categorySummary
    .map((c) => c.categoryId)
    .filter(Boolean) as string[];
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });

  const formattedSummary = categorySummary
    .map((item) => {
      const catInfo = categories.find((c) => c.id === item.categoryId);
      return {
        category: catInfo?.name || "อื่นๆ",
        color: catInfo?.color || "#cbd5e1",
        totalAmount: item._sum.amount || 0,
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return formattedSummary;
};
