import express from "express";
import {
  createBudgetHandler,
  getBudgetsHandler,
} from "../controllers/budget.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: ระบบจัดการงบประมาณรายเดือน
 */

/**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: ตั้งงบประมาณใหม่
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: "หมวดหมู่ที่ต้องการตั้งงบ (ต้องตรงกับ category ใน Transaction)"
 *                 example: "ENTERTAINMENT"
 *               amount:
 *                 type: number
 *                 description: "จำนวนเงินเป้าหมาย"
 *                 example: 5000
 *               period:
 *                 type: string
 *                 description: "เดือนที่ตั้งงบ (YYYY-MM)"
 *                 example: "2026-06"
 *     responses:
 *       201:
 *         description: ตั้งงบประมาณสำเร็จ
 *       400:
 *         description: มีการตั้งงบประมาณหมวดหมู่นี้ในเดือนนี้ไปแล้ว
 */
router.post("/", requireAuth, createBudgetHandler);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: ดึงข้อมูลงบประมาณพร้อมคำนวณยอดใช้จ่ายจริง
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         description: "เดือนที่ต้องการดูงบ (YYYY-MM) ถ้าไม่ใส่จะดึงเดือนปัจจุบัน"
 *         example: "2026-06"
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จพร้อมคำนวณเปอร์เซ็นต์การใช้งาน
 */
router.get("/", requireAuth, getBudgetsHandler);

export default router;
