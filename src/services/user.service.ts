import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import jwt from "jsonwebtoken";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data,
  });
};

export const registerUser = async (data: Prisma.UserCreateInput) => {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS"); // ปา Error ไปให้ Controller รับช่วงต่อ
  }

  const hashedPassword = await Bun.password.hash(data.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

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

export const getUserProfile = async (userId: string) => {
  const existing = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!existing) {
    throw new Error("USER_NOT_FOUND_OR_UNAUTHORIZED");
  }

  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
};
