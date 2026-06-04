import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: Token is missing",
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
