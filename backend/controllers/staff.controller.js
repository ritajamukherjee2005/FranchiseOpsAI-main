import * as staffService from "../services/staff.service.js";

function handleError(res, err) {
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Email or Staff ID already exists" });
  }
  const status = err.status || 500;
  const message = err.status ? err.message : "Internal server error";
  if (!err.status) console.error(err);
  return res.status(status).json({ error: message });
}

export async function getDashboard(req, res) {
  try {
    const stats = await staffService.getDashboardStats(req.user);
    res.json(stats);
  } catch (err) {
    handleError(res, err);
  }
}

export async function listStaff(req, res) {
  try {
    const result = await staffService.listStaffRecords(req.user, req.query);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getStaff(req, res) {
  try {
    const staff = await staffService.getStaffById(req.user, req.params.id);
    res.json(staff);
  } catch (err) {
    handleError(res, err);
  }
}

export async function createStaff(req, res) {
  try {
    const staff = await staffService.createStaffRecord(req.user, req.body);
    res.status(201).json(staff);
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateStaff(req, res) {
  try {
    const staff = await staffService.updateStaffRecord(req.user, req.params.id, req.body);
    res.json(staff);
  } catch (err) {
    handleError(res, err);
  }
}

export async function deleteStaff(req, res) {
  try {
    const result = await staffService.deleteStaffRecord(req.user, req.params.id);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
}

export async function listAttendance(req, res) {
  try {
    const records = await staffService.listAttendanceRecords(req.user, req.params.id);
    res.json(records);
  } catch (err) {
    handleError(res, err);
  }
}

export async function markAttendance(req, res) {
  try {
    const result = await staffService.markAttendanceRecord(req.user, req.params.id, req.body);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
}

export async function listFranchises(req, res) {
  try {
    const franchises = await staffService.listFranchiseRecords(req.user);
    res.json(franchises);
  } catch (err) {
    handleError(res, err);
  }
}
