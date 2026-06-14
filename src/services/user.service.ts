import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";

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
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  if (!data.password) {
    throw new Error("PASSWORD_REQUIRED");
  }

  const hashedPassword = await Bun.password.hash(data.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  return await createUser({
    email: data.email,
    name: data.name,
    surname: data.surname,
    password: hashedPassword,
  });
};

export const loginUser = async (email: string, passwordRaw: string) => {
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    throw new Error("INVALID_CREDENTIALS");
  }
  const isPasswordMatch = await Bun.password.verify(passwordRaw, user.password);
  if (!isPasswordMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const secret = process.env.JWT_SECRET || "default_secret";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh_secret";

  const accessToken = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user.id }, refreshSecret, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      status: "success",
      message: "Logged out successfully (Cookies cleared)",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
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
      surname: true,
      createdAt: true,
    },
  });
};

export const refreshAccessToken = async (currentRefreshToken: string) => {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(currentRefreshToken, refreshSecret) as any;
    const newAccessToken = jwt.sign({ id: decoded.id }, secret, {
      expiresIn: "15m",
    });

    return newAccessToken;
  } catch (error) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }
};
