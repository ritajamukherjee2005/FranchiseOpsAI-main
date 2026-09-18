import * as biService from "../services/bi.service.js";

function handleError(res, err) {
  const status = err.status || 500;
  const message = err.status ? err.message : "Internal server error";
  if (!err.status) console.error(err);
  return res.status(status).json({ error: message });
}

export async function getBIDashboard(req, res) {
  try {
    const data = await biService.getBIDashboard(req.user);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getBIRecommendations(req, res) {
  try {
    const data = await biService.getBIRecommendations(req.user);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}
