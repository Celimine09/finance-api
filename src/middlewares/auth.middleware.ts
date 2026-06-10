import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret);

    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: Invalid or expired token",
    });
  }
};
