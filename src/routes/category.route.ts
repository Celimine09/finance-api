import { Router } from "express";
import { getCategoriesHandler } from "../controllers/category.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, getCategoriesHandler);

export default router;
