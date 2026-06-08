import express from "express";
import {
  createBudgetHandler,
  getBudgetsHandler,
  updateBudgetHandler,
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
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: "หมวดหมู่ที่ต้องการตั้งงบ (ต้องตรงกับ category ใน Transaction)"
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
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

/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     summary: แก้ไขจำนวนเงินงบประมาณ
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของงบประมาณที่ต้องการแก้ไข
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: จำนวนเงินเป้าหมายใหม่
 *                 example: 6000
 *     responses:
 *       200:
 *         description: แก้ไขงบประมาณสำเร็จ
 *       404:
 *         description: ไม่พบงบประมาณ หรือไม่มีสิทธิ์แก้ไข
 */
router.put("/:id", requireAuth, updateBudgetHandler);

export default router;
