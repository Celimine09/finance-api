import { type Request, type Response } from "express";
import * as AuthService from "../services/auth.service";

export const googleLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential || typeof credential !== "string") {
      res.status(400).json({
        status: "error",
        message: "Credential is required",
      });
      return;
    }

    const { accessToken, refreshToken, user } =
      await AuthService.verifyAndLoginGoogleUser(credential);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 นาที
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    });

    res.status(200).json({
      status: "success",
      message: "Google login successful",
      user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "INVALID_GOOGLE_TOKEN") {
        res.status(400).json({
          status: "error",
          message: "Invalid Google token",
        });
        return;
      }
    }

    console.error("Google Login Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
