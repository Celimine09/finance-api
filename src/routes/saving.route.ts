import express from "express";
import {
  createGoalHandler,
  getGoalsHandler,
  addMoneyHandler,
} from "../controllers/saving.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Savings
 *   description: ระบบกระปุกออมทรัพย์และเป้าหมายการเงิน
 */

/**
 * @swagger
 * /api/savings:
 *   post:
 *     summary: สร้างเป้าหมายการออมใหม่
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "เก็บเงินซื้อการ์ดจอ"
 *               targetAmount:
 *                 type: number
 *                 example: 30000
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: สร้างเป้าหมายสำเร็จ
 */
router.post("/", requireAuth, createGoalHandler);

/**
 * @swagger
 * /api/savings:
 *   get:
 *     summary: ดึงเป้าหมายการออมทั้งหมดของฉัน
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ (พร้อมคำนวณ progressPercentage)
 */
router.get("/", requireAuth, getGoalsHandler);

/**
 * @swagger
 * /api/savings/{id}/add-money:
 *   patch:
 *     summary: หยอดเงินเข้ากระปุกเป้าหมาย
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของกระปุกออมทรัพย์
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: "จำนวนเงินที่ต้องการหยอด"
 *                 example: 1500
 *     responses:
 *       200:
 *         description: หยอดกระปุกสำเร็จ
 *       404:
 *         description: ไม่พบกระปุกออมทรัพย์
 */
router.patch("/:id/add-money", requireAuth, addMoneyHandler);

export default router;
