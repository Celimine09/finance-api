import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createRecurring,
  getRecurring,
  updateRecurring,
  deleteRecurring,
} from "../controllers/recurring.controller";

const router = express.Router();
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Recurring
 *   description: จัดการรายการรายรับ-รายจ่ายที่เกิดซ้ำ (Subscriptions)
 */

/**
 * @swagger
 * /api/recurring:
 *   post:
 *     summary: สร้างรายการเกิดซ้ำใหม่
 *     tags: [Recurring]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - title
 *               - amount
 *               - type
 *               - frequency
 *               - nextRun
 *             properties:
 *               categoryId:
 *                 type: string
 *               title:
 *                 type: string
 *                 example: "Netflix Subscription"
 *               amount:
 *                 type: number
 *                 example: 419
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: "EXPENSE"
 *               note:
 *                 type: string
 *                 example: "จ่ายผ่านบัตรเครดิต"
 *               frequency:
 *                 type: string
 *                 enum: [DAILY, WEEKLY, MONTHLY, YEARLY]
 *                 example: "MONTHLY"
 *               nextRun:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-07-01T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: สร้างรายการสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: ไม่ได้เข้าสู่ระบบ (ไม่มี Token)
 */
router.post("/", createRecurring);

/**
 * @swagger
 * /api/recurring:
 *   get:
 *     summary: ดึงรายการเกิดซ้ำทั้งหมดของผู้ใช้
 *     tags: [Recurring]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: คืนค่ารายการทั้งหมด
 *       401:
 *         description: ไม่ได้เข้าสู่ระบบ
 */
router.get("/", getRecurring);

/**
 * @swagger
 * /api/recurring/{id}:
 *   patch:
 *     summary: อัปเดตข้อมูลรายการเกิดซ้ำ หรือ เปิด/ปิด การทำงาน
 *     tags: [Recurring]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของรายการเกิดซ้ำ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               categoryId:
 *                 type: string
 *               note:
 *                 type: string
 *               frequency:
 *                 type: string
 *                 enum: [DAILY, WEEKLY, MONTHLY, YEARLY]
 *               nextRun:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: อัปเดตข้อมูลสำเร็จ
 *       400:
 *         description: ID ไม่ถูกต้อง
 *       404:
 *         description: ไม่พบรายการนี้ หรือไม่มีสิทธิ์แก้ไข
 */
router.patch("/:id", updateRecurring);

/**
 * @swagger
 * /api/recurring/{id}:
 *   delete:
 *     summary: ลบรายการเกิดซ้ำ
 *     tags: [Recurring]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของรายการเกิดซ้ำที่ต้องการลบ
 *     responses:
 *       200:
 *         description: ลบรายการสำเร็จ
 *       400:
 *         description: ID ไม่ถูกต้อง
 *       404:
 *         description: ไม่พบรายการนี้ หรือไม่มีสิทธิ์ลบ
 */
router.delete("/:id", deleteRecurring);

export default router;
