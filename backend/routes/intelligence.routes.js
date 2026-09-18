import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as intelligenceController from "../controllers/intelligence.controller.js";

const router = express.Router();

// All intelligence routes require authentication
router.use(authenticate);

// GET /api/intelligence/dashboard — Franchise Health Score + Business Pulse + Outlet Matrix
router.get("/dashboard", intelligenceController.getDashboard);

// GET /api/intelligence/recommendations — Data-driven business recommendations with evidence
router.get("/recommendations", intelligenceController.getRecommendations);

// GET /api/intelligence/outlet/:outletName — Outlet Intelligence Profile
router.get("/outlet/:outletName", intelligenceController.getOutletProfile);

// POST /api/intelligence/generate-alerts — Generate smart alerts from real data (idempotent)
router.post("/generate-alerts", intelligenceController.generateAlerts);

export default router;
