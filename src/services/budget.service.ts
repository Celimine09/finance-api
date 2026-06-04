import prisma from "./prisma.service";

export const createBudget = async (
  userId: string,
  data: { category: string; amount: number; period: string },
) => {
  const existingBudget = await prisma.budget.findFirst({
    where: { userId, category: data.category, period: data.period },
  });

  if (existingBudget) {
    throw new Error("BUDGET_ALREADY_EXISTS");
  }

  return await prisma.budget.create({
    data: {
      userId,
      category: data.category,
      amount: data.amount,
      period: data.period,
    },
  });
};

export const getBudgetsWithUsage = async (userId: string, period: string) => {
  const budgets = await prisma.budget.findMany({
    where: { userId, period },
  });

  const [year, month] = period.split("-");
  const startDate = new Date(
    parseInt(year as string),
    parseInt(month as string) - 1,
    1,
  );
  const endDate = new Date(
    parseInt(year as string),
    parseInt(month as string),
    1,
  );

  const expenses = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      userId,
      type: "EXPENSE",
      date: { gte: startDate, lt: endDate },
    },
    _sum: { amount: true },
  });

  return budgets.map((budget) => {
    const actualExpense = expenses.find((e) => e.category === budget.category);
    const spent = actualExpense?._sum.amount || 0;

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      usagePercentage: parseFloat(((spent / budget.amount) * 100).toFixed(2)),
    };
  });
};
