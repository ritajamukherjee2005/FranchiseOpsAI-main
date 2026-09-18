import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as intelligenceController from "../controllers/intelligence.controller.js";

const router = express.Router();

router.use(authenticate);

// Aliased bi routes to intelligence controller for complete endpoint compatibility
router.get("/dashboard", intelligenceController.getDashboard);
router.get("/recommendations", intelligenceController.getRecommendations);
router.get("/outlet/:outletName", intelligenceController.getOutletProfile);
router.post("/generate-alerts", intelligenceController.generateAlerts);

export default router;
