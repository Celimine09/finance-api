import express, { type Request, type Response } from "express";
import cors from "cors";
import transactionRoutes from "./routes/transaction.route";
import { setupSwagger } from "./utils/swagger";

const app = express();
const PORT = process.env.PORT || 3000;

// === Middlewares (รปภ. คอยตรวจข้อมูลก่อนเข้าแอป) ===
app.use(cors()); // อนุญาตให้หน้าเว็บ (Next.js) ยิง API เข้ามาได้
app.use(express.json()); // อนุญาตให้แอปอ่านข้อมูลที่ส่งมาเป็น JSON ได้

// === Routes (พนักงานต้อนรับ) ===
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "🚀 Welcome to Personal Finance API (Express + Bun)!",
  });
});

app.use("/api/transactions", transactionRoutes);

setupSwagger(app);

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server is running firmly on http://localhost:${PORT}`);
});
