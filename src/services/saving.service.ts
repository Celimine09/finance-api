import prisma from "./prisma.service";

export const createSavingsGoal = async (
  userId: string,
  data: { name: string; targetAmount: number; deadline?: string },
) => {
  return await prisma.savingsGoal.create({
    data: {
      userId,
      name: data.name,
      targetAmount: data.targetAmount,
      deadline: data.deadline ? new Date(data.deadline) : null,
    },
  });
};

export const getSavingsGoals = async (userId: string) => {
  const goals = await prisma.savingsGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return goals.map((goal) => ({
    ...goal,
    progressPercentage: parseFloat(
      ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2),
    ),
  }));
};

export const addMoneyToGoal = async (
  userId: string,
  goalId: string,
  amountToAdd: number,
) => {
  const goal = await prisma.savingsGoal.findFirst({
    where: { id: goalId, userId },
  });

  if (!goal) {
    throw new Error("GOAL_NOT_FOUND");
  }

  return await prisma.savingsGoal.update({
    where: { id: goalId },
    data: {
      currentAmount: goal.currentAmount + amountToAdd,
    },
  });
};
