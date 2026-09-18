import * as auditService from "../services/audit.service.js";

function handleError(res, err) {
  const status = err.status || 500;
  const message = err.status ? err.message : "Internal server error";
  if (!err.status) console.error(err);
  return res.status(status).json({ error: message });
}

export async function getAuditDashboard(req, res) {
  try {
    const data = await auditService.getAuditDashboard(req.user, req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function listAudits(req, res) {
  try {
    const data = await auditService.listAudits(req.user, req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getAuditById(req, res) {
  try {
    const audit = await auditService.getAuditById(req.user, req.params.id);
    res.json(audit);
  } catch (err) {
    handleError(res, err);
  }
}

export async function createAudit(req, res) {
  try {
    const audit = await auditService.createAuditRecord(req.user, req.body);
    res.status(201).json(audit);
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateAudit(req, res) {
  try {
    const audit = await auditService.updateAuditRecord(req.user, req.params.id, req.body);
    res.json(audit);
  } catch (err) {
    handleError(res, err);
  }
}

export async function deleteAudit(req, res) {
  try {
    const result = await auditService.deleteAuditRecord(req.user, req.params.id);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
}
