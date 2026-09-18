import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as marketingController from "../controllers/marketing.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", marketingController.getDashboard);
router.get("/analytics", marketingController.getAnalytics);
router.get("/campaigns", marketingController.listCampaigns);
router.get("/campaigns/:id", marketingController.getCampaignById);
router.get("/campaigns/:id/analytics", marketingController.getSingleCampaignAnalytics);
router.post("/campaigns", marketingController.createCampaign);
router.put("/campaigns/:id", marketingController.updateCampaign);
router.delete("/campaigns/:id", marketingController.deleteCampaign);
router.get("/engagement", marketingController.getEngagementAnalytics);
router.get("/roi", marketingController.getRoiAnalytics);
router.get("/recommendations", marketingController.getRecommendations);

export default router;
