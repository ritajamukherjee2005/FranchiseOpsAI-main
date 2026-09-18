import * as alertService from "../services/alert.service.js";

function handleError(res, err) {
  const status = err.status || 500;
  const message = err.status ? err.message : "Internal server error";
  if (!err.status) console.error(err);
  return res.status(status).json({ error: message });
}

export async function listAlerts(req, res) {
  try {
    const data = await alertService.listAlerts(req.user, req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function markAlertAsRead(req, res) {
  try {
    const alert = await alertService.markAlertAsRead(req.user, req.params.id);
    res.json(alert);
  } catch (err) {
    handleError(res, err);
  }
}

export async function markAllAlertsAsRead(req, res) {
  try {
    const result = await alertService.markAllAlertsAsRead(req.user);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
}
