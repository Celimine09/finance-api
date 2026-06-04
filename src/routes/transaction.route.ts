import { Router } from "express";
import * as TransactionController from "../controllers/transaction.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../validators/transaction.validator";
import { validate } from "../middlewares/validate.middleware";
import { createRecurringTransaction } from "../controllers/transaction.controller";

const router = Router();

// /**
//  * @swagger
//  * /api/transactions:
//  *   get:
//  *     summary: ดึงข้อมูลรายการธุรกรรมทั้งหมด
//  *     tags: [Transactions]
//  *     responses:
//  *       200:
//  *         description: คืนค่ารายการธุรกรรมสำเร็จ
//  */
// router.get("/", requireAuth, TransactionController.getTransactions);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: ดึงข้อมูลรายการธุรกรรมทั้งหมดของผู้ใช้งานทีนั้นๆ
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: คืนค่ารายการธุรกรรมสำเร็จ
 */
router.get("/", requireAuth, TransactionController.getTransactionsByUserId);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: สร้างรายการธุรกรรมใหม่
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "นั่งแท็กซี่"
 *               amount:
 *                 type: number
 *                 example: 250
 *               type:
 *                 type: string
 *                 example: "EXPENSE"
 *               category:
 *                 type: string
 *                 example: "Transport"
 *               note:
 *                 type: string
 *                 example: "ค่าแท็กซี่กลับบ้านตอนตีสาม"
 *               userId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
router.post(
  "/",
  requireAuth,
  validate(createTransactionSchema),
  TransactionController.createTransaction,
);
/**
 * @swagger
 * /api/transactions/{id}:
 *   patch:
 *     summary: แก้ไขรายการธุรกรรม
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของรายการธุรกรรมที่ต้องการแก้ไข
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 300
 *               note:
 *                 type: string
 *                 example: "ค่าแท็กซี่ (บวกค่าทางด่วน)"
 *     responses:
 *       200:
 *         description: แก้ไขสำเร็จ
 *       400:
 *         description: ไม่พบรายการนี้หรือข้อมูลผิดพลาด
 */
router.patch(
  "/:id",
  requireAuth,
  validate(updateTransactionSchema),
  TransactionController.updateTransaction,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: ลบรายการธุรกรรม
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของรายการธุรกรรมที่ต้องการลบ
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 *       400:
 *         description: ไม่พบรายการนี้
 */
router.delete("/:id", requireAuth, TransactionController.deleteTransaction);

/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: ดึงยอดรวมรายรับ รายจ่าย และยอดคงเหลือของผู้ใช้งาน (สำหรับ 3 กล่องบน Dashboard)
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: คืนค่ายอดรวมสำเร็จ
 */
router.get(
  "/summary",
  requireAuth,
  TransactionController.getTransactionSummary,
);

/**
 * @swagger
 * /api/transactions/categories:
 *   get:
 *     summary: ดึงข้อมูลสรุปรายจ่ายแยกตามหมวดหมู่ (สำหรับกราฟโดนัท)
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: คืนค่าข้อมูลหมวดหมู่สำเร็จ
 */
router.get(
  "/categories",
  requireAuth,
  TransactionController.getCategorySummary,
);

router.post("/recurring", requireAuth, createRecurringTransaction);

export default router;
