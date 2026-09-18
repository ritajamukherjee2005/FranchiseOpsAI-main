import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as auditController from "../controllers/audit.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", auditController.getAuditDashboard);
router.get("/", auditController.listAudits);
router.get("/:id", auditController.getAuditById);
router.post("/", auditController.createAudit);
router.put("/:id", auditController.updateAudit);
router.delete("/:id", auditController.deleteAudit);

export default router;
