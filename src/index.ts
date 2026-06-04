import express, { type Request, type Response } from "express";
import cors from "cors";
import transactionRoutes from "./routes/transaction.route";
import userRoutes from "./routes/user.route";
import { setupSwagger } from "./utils/swagger";
import { startCronJobs } from "./services/cron.job";
import budgetRoutes from "./routes/budget.route";
import savingRoutes from "./routes/saving.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "🚀 Welcome to Personal Finance API (Express + Bun)!",
  });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/savings", savingRoutes);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 Server is running firmly on http://localhost:${PORT}`);
  startCronJobs();
});
