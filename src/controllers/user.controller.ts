import { type Request, type Response } from "express";
import * as UserService from "../services/user.service";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const validatedData = req.body;

    await UserService.registerUser(validatedData as any);

    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (error: any) {
    if (error?.message === "EMAIL_ALREADY_EXISTS") {
      return res
        .status(400)
        .json({ status: "error", message: "Email is already registered" });
    }
    res
      .status(500)
      .json({ status: "error", message: "Could not register user" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);

    res
      .status(200)
      .json({
        status: "success",
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
  } catch (error: any) {
    if (error?.message === "INVALID_CREDENTIALS") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password" });
    }
    console.error("Login Error:", error);
    res.status(500).json({ status: "error", message: "Could not login" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        status: "error",
        message: "User ID is required and must be a string",
      });
    }
    const updatedUser = await UserService.updateUser(req.body, userId);
    res
      .status(200)
      .json({ status: "success", message: "User updated successfully" });
  } catch (error) {
    console.error("PATCH User Error:", error);
    res.status(400).json({ status: "error", message: "Could not update user" });
  }
};
