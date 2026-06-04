import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import jwt from "jsonwebtoken";

// 1. ฟังก์ชันค้นหา User จากอีเมล
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

// 2. ฟังก์ชันสร้าง User ใหม่
export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data,
  });
};

// (โค้ดฟังก์ชันค้นหาและสร้าง User ด้านบนปล่อยไว้เหมือนเดิมครับ)

// 🌟 เพิ่มฟังก์ชันนี้เข้าไปสำหรับจัดการลอจิก Register โดยเฉพาะ
export const registerUser = async (data: Prisma.UserCreateInput) => {
  // 1. เช็กอีเมลซ้ำ
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS"); // ปา Error ไปให้ Controller รับช่วงต่อ
  }

  // 2. เข้ารหัสรหัสผ่าน (งานหนักๆ ให้ Service ทำ)
  const hashedPassword = await Bun.password.hash(data.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. สร้าง User เลือดใหม่ลงฐานข้อมูล
  return await createUser({
    email: data.email,
    name: data.name,
    password: hashedPassword,
  });
};

export const loginUser = async (email: string, passwordRaw: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }
  const isPasswordMatch = await Bun.password.verify(passwordRaw, user.password);
  if (!isPasswordMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const secret = process.env.JWT_SECRET || "default_secret";
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

export const updateUser = async (
  data: Prisma.UserUpdateInput,
  userId: string,
) => {
  const existing = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!existing) {
    throw new Error("USER_NOT_FOUND_OR_UNAUTHORIZED");
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
  });
};
