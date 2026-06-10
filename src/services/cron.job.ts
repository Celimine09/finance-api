import cron from "node-cron";
import prisma from "./prisma.service";

const formatPeriod = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const startCronJobs = () => {
  console.log("⏰ Cron Jobs initialized and ready!");

  cron.schedule("5 0 * * *", async () => {
    console.log("🔄 Running Recurring Transactions Check...");
    try {
      const today = new Date();

      const dueSubscriptions = await prisma.recurringTransaction.findMany({
        where: {
          nextRun: { lte: today },
          isActive: true,
        },
      });

      for (const sub of dueSubscriptions) {
        await prisma.transaction.create({
          data: {
            userId: sub.userId,
            categoryId: sub.categoryId ?? undefined,
            title: sub.title ?? "Recurring expense",
            amount: sub.amount,
            type: sub.type,
            note: "Subscription (Auto-generated)",
            date: today,
          },
        });

        const nextDate = new Date(sub.nextRun);
        if (sub.frequency === "MONTHLY") {
          nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (sub.frequency === "YEARLY") {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        } else if (sub.frequency === "WEEKLY") {
          nextDate.setDate(nextDate.getDate() + 7);
        } else if (sub.frequency === "DAILY") {
          nextDate.setDate(nextDate.getDate() + 1);
        }

        await prisma.recurringTransaction.update({
          where: { id: sub.id },
          data: { nextRun: nextDate },
        });
      }

      console.log(
        `✅ Processed ${dueSubscriptions.length} recurring transactions.`,
      );
    } catch (error) {
      console.error("❌ Error running recurring transactions cron:", error);
    }
  });

  cron.schedule("10 0 1 * *", async () => {
    console.log("📊 Running Budget Auto-Renew Check...");
    try {
      const today = new Date();
      const lastMonthPeriod = formatPeriod(
        new Date(today.getFullYear(), today.getMonth() - 1, 1),
      );
      const thisMonthPeriod = formatPeriod(
        new Date(today.getFullYear(), today.getMonth(), 1),
      );

      const lastMonthBudgets = await prisma.budget.findMany({
        where: {
          period: lastMonthPeriod,
          isAutoRenew: true,
        },
      });

      for (const budget of lastMonthBudgets) {
        const existingBudget = await prisma.budget.findFirst({
          where: {
            userId: budget.userId,
            categoryId: budget.categoryId,
            period: thisMonthPeriod,
          },
        });

        if (!existingBudget) {
          await prisma.budget.create({
            data: {
              userId: budget.userId,
              categoryId: budget.categoryId,
              amount: budget.amount,
              period: thisMonthPeriod,
              isAutoRenew: true,
            },
          });
        }
      }

      console.log(`✅ Auto-renewed ${lastMonthBudgets.length} budgets.`);
    } catch (error) {
      console.error("❌ Error running budget auto-renew cron:", error);
    }
  });
};
