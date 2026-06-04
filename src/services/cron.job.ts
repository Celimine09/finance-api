import cron from "node-cron";
import prisma from "./prisma.service";

export const startCronJobs = () => {
  // ตั้งเวลาให้ตื่นมาเช็ก (ตอนนี้ตั้งเป็น "* * * * *" คือเช็กทุกๆ 1 นาทีเพื่อความง่ายตอนเทส)
  // ถ้าใช้จริงบนโปรดักชันจะแก้เป็น "0 0 * * *" (เที่ยงคืนของทุกวัน)
  cron.schedule("* * * * *", async () => {
    console.log("⏰ [Cron] กำลังตรวจสอบ Recurring Transactions...");

    try {
      const now = new Date();

      const dueTransactions = await prisma.recurringTransaction.findMany({
        where: {
          isActive: true,
          nextRun: { lte: now },
        },
      });

      if (dueTransactions.length === 0) {
        return;
      }

      for (const rt of dueTransactions) {
        await prisma.transaction.create({
          data: {
            userId: rt.userId,
            title: `[Auto] ${rt.title}`,
            amount: rt.amount,
            type: rt.type,
            category: rt.category || "OTHER",
            date: now,
          },
        });

        let nextRun = new Date(rt.nextRun);
        if (rt.frequency === "DAILY") nextRun.setDate(nextRun.getDate() + 1);
        if (rt.frequency === "WEEKLY") nextRun.setDate(nextRun.getDate() + 7);
        if (rt.frequency === "MONTHLY")
          nextRun.setMonth(nextRun.getMonth() + 1);
        if (rt.frequency === "YEARLY")
          nextRun.setFullYear(nextRun.getFullYear() + 1);

        await prisma.recurringTransaction.update({
          where: { id: rt.id },
          data: { nextRun },
        });

        console.log(
          `✅ จ่ายอัตโนมัติ: ${rt.title} | รอบถัดไป: ${nextRun.toISOString()}`,
        );
      }
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดใน Cron Job:", error);
    }
  });

  console.log("🕰️ Cron Job System Started!");
};
