import { Router } from "express";
import * as TransactionController from "../controllers/transaction.controller";

const router = Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: ดึงข้อมูลรายการธุรกรรมทั้งหมด
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: คืนค่ารายการธุรกรรมสำเร็จ
 */
router.get("/", TransactionController.getTransactions);

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
router.post("/", TransactionController.createTransaction);
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
router.patch("/:id", TransactionController.updateTransaction);

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
router.delete("/:id", TransactionController.deleteTransaction);

export default router;
