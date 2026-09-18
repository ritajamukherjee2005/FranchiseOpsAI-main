import express from "express";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import {
  validateCreateStaff,
  validateUpdateStaff,
  validateMarkAttendance,
} from "../middleware/validateStaff.js";
import * as staffController from "../controllers/staff.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", staffController.getDashboard);
router.get("/franchises", staffController.listFranchises);
router.get("/", staffController.listStaff);
router.get("/:id/attendance", staffController.listAttendance);
router.post(
  "/:id/attendance",
  requireRole("ADMIN", "REGIONAL_MANAGER", "OUTLET_MANAGER"),
  validateMarkAttendance,
  staffController.markAttendance
);
router.get("/:id", staffController.getStaff);
router.post(
  "/",
  requireRole("ADMIN", "REGIONAL_MANAGER", "OUTLET_MANAGER"),
  validateCreateStaff,
  staffController.createStaff
);
router.put(
  "/:id",
  requireRole("ADMIN", "REGIONAL_MANAGER", "OUTLET_MANAGER"),
  validateUpdateStaff,
  staffController.updateStaff
);
router.delete(
  "/:id",
  requireRole("ADMIN", "REGIONAL_MANAGER"),
  staffController.deleteStaff
);

export default router;
