import * as intelligenceService from "../services/intelligence.service.js";

function handleError(res, err) {
  const status = err.status || 500;
  const message = err.status ? err.message : "Internal server error";
  if (!err.status) console.error("[Intelligence]", err);
  return res.status(status).json({ error: message });
}

export async function getDashboard(req, res) {
  try {
    const data = await intelligenceService.getIntelligenceDashboard(req.user);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getRecommendations(req, res) {
  try {
    const data = await intelligenceService.getRecommendations(req.user);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getOutletProfile(req, res) {
  try {
    const { outletName } = req.params;
    if (!outletName) {
      return res.status(400).json({ error: "outletName is required" });
    }
    const data = await intelligenceService.getOutletProfile(
      req.user,
      decodeURIComponent(outletName)
    );
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function generateAlerts(req, res) {
  try {
    const data = await intelligenceService.generateSmartAlerts(req.user);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}
