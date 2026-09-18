import * as marketingService from "../services/marketing.service.js";

function handleError(res, err) {
  if (err.code === "P2002") {
    return res.status(409).json({ error: "Marketing campaign already exists" });
  }
  const status = err.status || 500;
  const message = err.status ? err.message : "Internal server error";
  if (!err.status) console.error(err);
  return res.status(status).json({ error: message });
}

export async function getDashboard(req, res) {
  try {
    const payload = await marketingService.getDashboardData(req.user, req.query);
    res.json(payload);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getAnalytics(req, res) {
  try {
    const payload = await marketingService.getAnalyticsData(req.user, req.query);
    res.json(payload);
  } catch (err) {
    handleError(res, err);
  }
}

export async function listCampaigns(req, res) {
  try {
    const payload = await marketingService.listCampaigns(req.user, req.query);
    res.json(payload);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getCampaignById(req, res) {
  try {
    const campaign = await marketingService.getCampaignById(req.user, req.params.id);
    res.json(campaign);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getSingleCampaignAnalytics(req, res) {
  try {
    const campaign = await marketingService.getCampaignById(req.user, req.params.id);
    res.json({
      campaign: campaign.name,
      roi: campaign.roi,
      revenue: campaign.revenueGenerated,
      budget: campaign.budget,
      ctr: campaign.ctr,
      conversionRate: campaign.conversionRate,
      customersReached: campaign.customersReached,
      conversions: campaign.conversions,
    });
  } catch (err) {
    handleError(res, err);
  }
}

export async function createCampaign(req, res) {
  try {
    const campaign = await marketingService.createCampaignRecord(req.user, req.body);
    res.status(201).json(campaign);
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateCampaign(req, res) {
  try {
    const campaign = await marketingService.updateCampaignRecord(req.user, req.params.id, req.body);
    res.json(campaign);
  } catch (err) {
    handleError(res, err);
  }
}

export async function deleteCampaign(req, res) {
  try {
    const result = await marketingService.deleteCampaignRecord(req.user, req.params.id);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getEngagementAnalytics(req, res) {
  try {
    const data = await marketingService.getEngagementAnalytics(req.user, req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getRoiAnalytics(req, res) {
  try {
    const data = await marketingService.getRoiAnalytics(req.user, req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getRecommendations(req, res) {
  try {
    const data = await marketingService.getRecommendations(req.user, req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
}
