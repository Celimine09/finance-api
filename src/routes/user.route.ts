import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { loginUser } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: สมัครสมาชิกผู้ใช้งานใหม่
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nine.dev@test.com"
 *               name:
 *                 type: string
 *                 example: "Nine"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: สมัครสมาชิกสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน หรืออีเมลนี้ถูกใช้งานไปแล้ว
 */
router.post("/register", validate(registerSchema), UserController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: เข้าสู่ระบบเพื่อรับ Token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nine@nine.com"
 *               password:
 *                 type: string
 *                 example: "nine1234"
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จและได้รับ Token
 *       400:
 *         description: อีเมลหรือรหัสผ่านไม่ถูกต้อง
 */
router.post("/login", validate(loginSchema), UserController.loginUser);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: แก้ไขข้อมูลโปรไฟล์ผู้ใช้งาน (เช่น เปลี่ยนชื่อ หรือ รหัสผ่าน)
 *     tags: [Users]
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
 *                 example: "Test"
 *               password:
 *                 type: string
 *                 description: รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: อัปเดตข้อมูลสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: ไม่ได้รับอนุญาต (Unauthorized) หรือ Token หมดอายุ
 */
router.patch("/profile", requireAuth, UserController.updateUser);

export default router;
