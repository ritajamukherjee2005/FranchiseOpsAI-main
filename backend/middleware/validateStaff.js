import { validateStaffPayload, validateAttendancePayload } from "../services/staff.service.js";

export function validateCreateStaff(req, res, next) {
  const errors = validateStaffPayload(req.body, false);
  if (errors.length) {
    return res.status(400).json({ error: errors.join(", ") });
  }
  next();
}

export function validateUpdateStaff(req, res, next) {
  const errors = validateStaffPayload(req.body, true);
  if (errors.length) {
    return res.status(400).json({ error: errors.join(", ") });
  }
  next();
}

export function validateMarkAttendance(req, res, next) {
  const errors = validateAttendancePayload(req.body);
  if (errors.length) {
    return res.status(400).json({ error: errors.join(", ") });
  }
  next();
}
