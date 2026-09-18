import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as alertController from "../controllers/alert.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", alertController.listAlerts);
router.put("/read-all", alertController.markAllAlertsAsRead);
router.put("/:id/read", alertController.markAlertAsRead);

export default router;
