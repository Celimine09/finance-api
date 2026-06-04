import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: error.issues.map((e: any) => e.message).join(", "),
        });
      }
      next(error);
    }
  };
