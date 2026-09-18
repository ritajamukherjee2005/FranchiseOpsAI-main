import { prisma } from "../lib/prisma.js";

const CAMPAIGN_SORTABLE = [
  "name",
  "startDate",
  "endDate",
  "budget",
  "revenueGenerated",
  "customersReached",
  "conversions",
  "status",
  "type",
  "createdAt",
];
const CAMPAIGN_TYPES = [
  "ONLINE",
  "SOCIAL_MEDIA",
  "IN_STORE",
  "LOYALTY",
  "SEASONAL",
  "EMAIL",
  "PARTNERSHIP",
];
const CAMPAIGN_STATUSES = ["ACTIVE", "COMPLETED", "UPCOMING"];

function num(value) {
  return Number(value ?? 0);
}

function toTitleCase(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^\w|\s\w)/g, (char) => char.toUpperCase());
}

function toCampaignTypeLabel(value) {
  return toTitleCase(value);
}

function serializeCampaign(campaign) {
  const budget = num(campaign.budget);
  const revenueGenerated = num(campaign.revenueGenerated);
  const customersReached = num(campaign.customersReached);
  const clicks = campaign.clicks !== null && campaign.clicks !== undefined ? num(campaign.clicks) : null;
  const conversions = num(campaign.conversions);

  const roi = budget > 0 ? ((revenueGenerated - budget) / budget) * 100 : 0;
  const ctr = clicks !== null && customersReached > 0 ? (clicks / customersReached) * 100 : null;
  const conversionRate = clicks !== null && clicks > 0 
    ? (conversions / clicks) * 100 
    : customersReached > 0 
      ? (conversions / customersReached) * 100 
      : null;

  return {
    ...campaign,
    budget,
    revenueGenerated,
    roi,
    clicks,
    ctr,
    conversionRate,
    campaignType: toCampaignTypeLabel(campaign.type),
    statusLabel: toTitleCase(campaign.status),
    profit: revenueGenerated - budget,
  };
}

function getScopeWhere(user) {
  if (!user) return {};
  if (user.role === "ADMIN") return {};
  if (user.role === "REGIONAL_MANAGER") {
    if (!user.region) return { franchiseId: "__none__" };
    return { franchise: { region: user.region } };
  }
  if (user.role === "OUTLET_MANAGER") {
    if (!user.franchiseId) return { franchiseId: "__none__" };
    return { franchiseId: user.franchiseId };
  }
  return { franchiseId: "__none__" };
}

function buildCampaignFilter(query) {
  const { search = "", type = "", status = "", outlet = "", city = "", productCategory = "", startDate = "", endDate = "" } = query;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { outletName: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type && type !== "All") {
    where.type = type;
  }

  if (status && status !== "All") {
    where.status = status;
  }

  if (outlet && outlet !== "All") {
    where.outletName = { contains: outlet, mode: "insensitive" };
  }

  if (city && city !== "All") {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (productCategory && productCategory !== "All") {
    where.productCategory = { contains: productCategory, mode: "insensitive" };
  }

  if (startDate || endDate) {
    where.startDate = {};
    if (startDate) where.startDate.gte = new Date(startDate);
    if (endDate) where.startDate.lte = new Date(endDate);
  }

  return where;
}

export async function listCampaigns(user, query = {}) {
  const {
    page = "1",
    limit = "8",
    sortBy = "startDate",
    sortDir = "desc",
  } = query;

  const scope = getScopeWhere(user);
  const where = { ...scope, ...buildCampaignFilter(query) };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 8));
  const skip = (pageNum - 1) * pageSize;

  const orderField = CAMPAIGN_SORTABLE.includes(sortBy) ? sortBy : "startDate";
  const orderDirection = sortDir === "asc" ? "asc" : "desc";

  const [total, campaigns] = await Promise.all([
    prisma.marketingCampaign.count({ where }),
    prisma.marketingCampaign.findMany({
      where,
      include: { franchise: { select: { id: true, name: true, region: true } } },
      orderBy: { [orderField]: orderDirection },
      skip,
      take: pageSize,
    }),
  ]);

  return {
    data: campaigns.map(serializeCampaign),
    total,
    page: pageNum,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    filters: {
      types: CAMPAIGN_TYPES,
      statuses: CAMPAIGN_STATUSES,
    },
  };
}

export async function getCampaignById(user, id) {
  const campaign = await prisma.marketingCampaign.findUnique({
    where: { id },
    include: { franchise: { select: { id: true, name: true, region: true } } },
  });

  if (!campaign) {
    const err = new Error("Campaign not found");
    err.status = 404;
    throw err;
  }

  const scope = getScopeWhere(user);
  const matchesScope =
    Object.keys(scope).length === 0 ||
    (scope.franchiseId && scope.franchiseId === campaign.franchiseId) ||
    (scope.franchise && campaign.franchise && scope.franchise.region === campaign.franchise.region);

  if (!matchesScope) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  return serializeCampaign(campaign);
}

export async function createCampaignRecord(user, payload) {
  const {
    name,
    type,
    outletName,
    city,
    targetAudience,
    productCategory,
    franchiseId,
    startDate,
    endDate,
    budget,
    revenueGenerated,
    customersReached,
    clicks,
    conversions,
    status,
    description,
  } = payload;

  if (!name || !type || !outletName || !startDate || !endDate || budget === undefined) {
    const err = new Error("Missing required campaign fields");
    err.status = 400;
    throw err;
  }

  if (CAMPAIGN_TYPES.includes(type) === false) {
    const err = new Error("Invalid campaign type");
    err.status = 400;
    throw err;
  }

  if (CAMPAIGN_STATUSES.includes(status || "ACTIVE") === false) {
    const err = new Error("Invalid campaign status");
    err.status = 400;
    throw err;
  }

  let targetFranchiseId = franchiseId;
  if (user.role === "OUTLET_MANAGER" && user.franchiseId) {
    targetFranchiseId = user.franchiseId;
  }

  const campaign = await prisma.marketingCampaign.create({
    data: {
      name: String(name).trim(),
      type,
      outletName: String(outletName).trim(),
      city: city ? String(city).trim() : null,
      targetAudience: targetAudience ? String(targetAudience).trim() : null,
      productCategory: productCategory ? String(productCategory).trim() : null,
      franchiseId: targetFranchiseId || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: Number(budget),
      revenueGenerated: Number(revenueGenerated || 0),
      customersReached: Number(customersReached || 0),
      clicks: clicks !== undefined && clicks !== null ? Number(clicks) : null,
      conversions: Number(conversions || 0),
      status: status || "ACTIVE",
      description: description ? String(description).trim() : null,
    },
  });

  return serializeCampaign(campaign);
}

export async function updateCampaignRecord(user, id, payload) {
  const existing = await prisma.marketingCampaign.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error("Campaign not found");
    err.status = 404;
    throw err;
  }

  const scope = getScopeWhere(user);
  const allowed = scope.franchiseId === "__none__" ? false : true;
  if (user.role !== "ADMIN" && allowed && existing.franchiseId && scope.franchiseId !== existing.franchiseId) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  const updateData = { ...payload };
  if (payload.type && CAMPAIGN_TYPES.includes(payload.type) === false) {
    const err = new Error("Invalid campaign type");
    err.status = 400;
    throw err;
  }
  if (payload.status && CAMPAIGN_STATUSES.includes(payload.status) === false) {
    const err = new Error("Invalid campaign status");
    err.status = 400;
    throw err;
  }
  if (payload.startDate) updateData.startDate = new Date(payload.startDate);
  if (payload.endDate) updateData.endDate = new Date(payload.endDate);
  if (payload.budget !== undefined) updateData.budget = Number(payload.budget);
  if (payload.revenueGenerated !== undefined) updateData.revenueGenerated = Number(payload.revenueGenerated);
  if (payload.customersReached !== undefined) updateData.customersReached = Number(payload.customersReached);
  if (payload.clicks !== undefined) updateData.clicks = payload.clicks !== null ? Number(payload.clicks) : null;
  if (payload.conversions !== undefined) updateData.conversions = Number(payload.conversions);

  const campaign = await prisma.marketingCampaign.update({
    where: { id },
    data: updateData,
  });

  return serializeCampaign(campaign);
}

export async function deleteCampaignRecord(user, id) {
  const existing = await prisma.marketingCampaign.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error("Campaign not found");
    err.status = 404;
    throw err;
  }

  if (user.role !== "ADMIN" && existing.franchiseId && user.franchiseId && user.franchiseId !== existing.franchiseId) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }

  await prisma.marketingCampaign.delete({ where: { id } });
  return { success: true, id };
}

function buildCampaignSummary(campaigns, salesTotal = 0) {
  const totalRevenue = campaigns.reduce((sum, c) => sum + num(c.revenueGenerated), 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + num(c.budget), 0);
  const totalCustomers = campaigns.reduce((sum, c) => sum + num(c.customersReached), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks !== null ? num(c.clicks) : 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + num(c.conversions), 0);
  const hasClicks = campaigns.some((c) => c.clicks !== null && c.clicks !== undefined);

  const avgRoi = campaigns.length
    ? campaigns.reduce((sum, c) => {
        const b = num(c.budget);
        const r = num(c.revenueGenerated);
        return sum + (b > 0 ? ((r - b) / b) * 100 : 0);
      }, 0) / campaigns.length
    : 0;

  const ctr = hasClicks && totalCustomers > 0 ? (totalClicks / totalCustomers) * 100 : null;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : totalCustomers > 0 ? (totalConversions / totalCustomers) * 100 : null;

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
    totalRevenue,
    totalMarketingSpend: totalSpend,
    averageROI: avgRoi,
    totalCustomersReached: totalCustomers,
    totalClicks: hasClicks ? totalClicks : null,
    totalConversions,
    ctr,
    conversionRate,
    salesDatasetRevenue: salesTotal,
  };
}

export async function getDashboardData(user, query = {}) {
  const scope = getScopeWhere(user);
  const where = { ...scope, ...buildCampaignFilter(query) };

  const [campaigns, salesTransactions] = await Promise.all([
    prisma.marketingCampaign.findMany({ where, orderBy: { startDate: "desc" } }),
    prisma.retailTransaction.findMany(),
  ]);

  const salesTotal = salesTransactions.reduce((acc, t) => acc + num(t.totalAmount), 0);
  const summary = buildCampaignSummary(campaigns, salesTotal);

  const revenueByCampaign = campaigns.map((c) => ({
    name: c.name,
    revenue: num(c.revenueGenerated),
    spend: num(c.budget),
    roi: num(c.budget) > 0 ? ((num(c.revenueGenerated) - num(c.budget)) / num(c.budget)) * 100 : 0,
  }));

  const outletPerformance = campaigns.reduce((acc, c) => {
    const key = c.outletName || "General";
    acc[key] = (acc[key] || 0) + num(c.revenueGenerated);
    return acc;
  }, {});

  const categorySalesFromCSV = salesTransactions.reduce((acc, t) => {
    const key = t.productCategory || "Other";
    acc[key] = (acc[key] || 0) + num(t.totalAmount);
    return acc;
  }, {});

  const citySalesFromCSV = salesTransactions.reduce((acc, t) => {
    const key = t.city || "Other";
    acc[key] = (acc[key] || 0) + num(t.totalAmount);
    return acc;
  }, {});

  const allCities = [...new Set([...campaigns.map((c) => c.city).filter(Boolean), ...salesTransactions.map((t) => t.city).filter(Boolean)])];
  const allCategories = [...new Set([...campaigns.map((c) => c.productCategory).filter(Boolean), ...salesTransactions.map((t) => t.productCategory).filter(Boolean)])];
  const allOutlets = [...new Set(campaigns.map((c) => c.outletName).filter(Boolean))];

  return {
    summary,
    campaigns: campaigns.map(serializeCampaign),
    charts: {
      revenueByCampaign,
      roiByCampaign: revenueByCampaign.map((entry) => ({ name: entry.name, roi: Number(entry.roi.toFixed(2)) })),
      outletPerformance: Object.entries(outletPerformance).map(([name, value]) => ({ name, value })),
      categorySalesFromCSV: Object.entries(categorySalesFromCSV).map(([name, value]) => ({ name, value })),
      citySalesFromCSV: Object.entries(citySalesFromCSV).map(([name, value]) => ({ name, value })),
    },
    filters: {
      types: CAMPAIGN_TYPES,
      statuses: CAMPAIGN_STATUSES,
      outlets: allOutlets,
      cities: allCities,
      categories: allCategories,
    },
  };
}

export async function getEngagementAnalytics(user, query = {}) {
  const scope = getScopeWhere(user);
  const where = { ...scope, ...buildCampaignFilter(query) };
  const campaigns = await prisma.marketingCampaign.findMany({ where, orderBy: { startDate: "desc" } });

  const data = campaigns.map((c) => {
    const customersReached = num(c.customersReached);
    const clicks = c.clicks !== null && c.clicks !== undefined ? num(c.clicks) : null;
    const conversions = num(c.conversions);

    const ctr = clicks !== null && customersReached > 0 ? (clicks / customersReached) * 100 : null;
    const conversionRate = clicks !== null && clicks > 0 ? (conversions / clicks) * 100 : customersReached > 0 ? (conversions / customersReached) * 100 : null;

    return {
      campaign: c.name,
      outlet: c.outletName,
      city: c.city || "—",
      customersReached,
      clicks: clicks !== null ? clicks : "N/A",
      conversions,
      ctr: ctr !== null ? Number(ctr.toFixed(2)) : "N/A",
      conversionRate: conversionRate !== null ? Number(conversionRate.toFixed(2)) : "N/A",
    };
  });

  const totalReached = data.reduce((sum, item) => sum + item.customersReached, 0);
  const validCtrs = data.filter((item) => typeof item.ctr === "number").map((item) => item.ctr);
  const validConversions = data.filter((item) => typeof item.conversionRate === "number").map((item) => item.conversionRate);

  const avgCtr = validCtrs.length ? validCtrs.reduce((a, b) => a + b, 0) / validCtrs.length : "N/A";
  const avgConversionRate = validConversions.length ? validConversions.reduce((a, b) => a + b, 0) / validConversions.length : "N/A";

  return {
    kpis: {
      customersReached: totalReached,
      clickThroughRate: typeof avgCtr === "number" ? Number(avgCtr.toFixed(2)) : "N/A",
      conversionRate: typeof avgConversionRate === "number" ? Number(avgConversionRate.toFixed(2)) : "N/A",
      totalCampaignsTracked: campaigns.length,
    },
    byCampaign: data.map((item) => ({ name: item.campaign, reached: item.customersReached, conversions: item.conversions })),
  };
}

export async function getRoiAnalytics(user, query = {}) {
  const scope = getScopeWhere(user);
  const where = { ...scope, ...buildCampaignFilter(query) };
  const campaigns = await prisma.marketingCampaign.findMany({ where, orderBy: { startDate: "desc" } });

  const rows = campaigns.map((campaign) => {
    const budget = num(campaign.budget);
    const revenue = num(campaign.revenueGenerated);
    const profit = revenue - budget;
    const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;
    const conversionRate = campaign.customersReached > 0 ? (campaign.conversions / campaign.customersReached) * 100 : null;

    return {
      name: campaign.name,
      outlet: campaign.outletName,
      type: campaign.type,
      campaignCost: budget,
      revenue,
      profit,
      roi: Number(roi.toFixed(2)),
      conversionRate: conversionRate !== null ? Number(conversionRate.toFixed(2)) : "N/A",
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    };
  });

  const sortedByRoi = [...rows].sort((a, b) => b.roi - a.roi);
  const lowest = [...rows].sort((a, b) => a.roi - b.roi)[0] || null;
  const best = sortedByRoi[0] || null;

  return {
    kpis: {
      roi: rows.length ? Number((rows.reduce((sum, row) => sum + row.roi, 0) / rows.length).toFixed(2)) : 0,
      revenue: rows.reduce((sum, row) => sum + row.revenue, 0),
      budget: rows.reduce((sum, row) => sum + row.campaignCost, 0),
      profit: rows.reduce((sum, row) => sum + row.profit, 0),
    },
    comparison: rows.map((row) => ({ name: row.name, roi: row.roi, revenue: row.revenue, cost: row.campaignCost })),
    ranking: sortedByRoi,
    bestPerforming: best,
    lowestPerforming: lowest,
  };
}

export async function getRecommendations(user, query = {}) {
  const scope = getScopeWhere(user);
  const where = { ...scope, ...buildCampaignFilter(query) };

  const [campaigns, salesTransactions] = await Promise.all([
    prisma.marketingCampaign.findMany({ where, orderBy: { startDate: "desc" } }),
    prisma.retailTransaction.findMany(),
  ]);

  if (!campaigns.length && !salesTransactions.length) {
    return {
      summary: "No campaign or sales data is available yet. Add campaigns to unlock AI recommendations.",
      recommendations: [],
    };
  }

  const recommendationList = [];

  if (campaigns.length > 0) {
    const ranked = [...campaigns]
      .map((c) => {
        const budget = num(c.budget);
        const revenue = num(c.revenueGenerated);
        const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;
        return { ...c, roi, budget, revenue };
      })
      .sort((a, b) => b.roi - a.roi);

    const bestCampaign = ranked[0];
    const weakestCampaign = ranked[ranked.length - 1];

    if (bestCampaign) {
      recommendationList.push({
        title: "Scale Top Performing Campaign",
        priority: "High",
        text: `"${bestCampaign.name}" generated ₹${bestCampaign.revenue.toLocaleString("en-IN")} revenue with an ROI of ${bestCampaign.roi.toFixed(1)}%. Consider scaling budget for ${bestCampaign.outletName}.`,
        metric: `${bestCampaign.roi.toFixed(1)}% ROI`,
      });
    }

    if (weakestCampaign && weakestCampaign.id !== bestCampaign.id && weakestCampaign.roi < 100) {
      recommendationList.push({
        title: "Review Low ROI Campaign",
        priority: "Medium",
        text: `"${weakestCampaign.name}" shows a lower ROI of ${weakestCampaign.roi.toFixed(1)}%. Re-evaluate copy or reallocate budget to higher-performing outlets.`,
        metric: `${weakestCampaign.roi.toFixed(1)}% ROI`,
      });
    }
  }

  if (salesTransactions.length > 0) {
    const categoryTotals = salesTransactions.reduce((acc, t) => {
      acc[t.productCategory] = (acc[t.productCategory] || 0) + num(t.totalAmount);
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      recommendationList.push({
        title: "Capitalize on Top Sales Category",
        priority: "High",
        text: `Real sales transactions show "${topCategory[0]}" is your top revenue category (₹${topCategory[1].toLocaleString("en-IN")}). Align future marketing campaigns to promote this category.`,
        metric: `₹${topCategory[1].toLocaleString("en-IN")}`,
      });
    }

    const cityTotals = salesTransactions.reduce((acc, t) => {
      acc[t.city] = (acc[t.city] || 0) + num(t.totalAmount);
      return acc;
    }, {});
    const topCity = Object.entries(cityTotals).sort((a, b) => b[1] - a[1])[0];

    if (topCity) {
      recommendationList.push({
        title: "High Potential City Focus",
        priority: "Medium",
        text: `${topCity[0]} generated ₹${topCity[1].toLocaleString("en-IN")} in historical retail sales. Launch localized promotions targeting this city.`,
        metric: topCity[0],
      });
    }
  }

  return {
    summary: `Analytics engine processed ${campaigns.length} campaigns and ${salesTransactions.length} retail transactions from database records.`,
    recommendations: recommendationList,
  };
}

export async function getAnalyticsData(user, query = {}) {
  const [dashboard, engagement, roi, recs] = await Promise.all([
    getDashboardData(user, query),
    getEngagementAnalytics(user, query),
    getRoiAnalytics(user, query),
    getRecommendations(user, query),
  ]);

  return {
    dashboard,
    engagement,
    roi,
    recommendations: recs,
  };
}
