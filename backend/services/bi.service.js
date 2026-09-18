import { prisma } from "../lib/prisma.js";

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

export async function getBIDashboard(user) {
  const scope = getScopeWhere(user);

  const [transactions, campaigns, audits, staffList, alerts] = await Promise.all([
    prisma.retailTransaction.findMany(),
    prisma.marketingCampaign.findMany({ where: scope }),
    prisma.audit.findMany({ where: scope }),
    prisma.staff.findMany({ where: scope }),
    prisma.alert.findMany({ where: scope }),
  ]);

  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.totalAmount || 0), 0);
  const totalCampaignRevenue = campaigns.reduce((sum, c) => sum + Number(c.revenueGenerated || 0), 0);
  const totalCampaignSpend = campaigns.reduce((sum, c) => sum + Number(c.budget || 0), 0);
  const avgMarketingROI = totalCampaignSpend > 0 ? ((totalCampaignRevenue - totalCampaignSpend) / totalCampaignSpend) * 100 : 0;

  const totalStaff = staffList.length;
  const avgStaffAttendance = totalStaff
    ? Math.round(staffList.reduce((sum, s) => sum + (s.attendanceRate || 100), 0) / totalStaff)
    : 100;

  const totalAudits = audits.length;
  const avgAuditCompliance = totalAudits
    ? Math.round(audits.reduce((sum, a) => sum + a.compliancePercentage, 0) / totalAudits)
    : 0;

  const highRiskOutletsList = [...new Set(audits.filter((a) => a.status === "FAILED" || a.score < 70).map((a) => a.outletName))];
  const activeAlertsCount = alerts.filter((a) => !a.isRead).length;

  const categorySales = transactions.reduce((acc, t) => {
    acc[t.productCategory] = (acc[t.productCategory] || 0) + Number(t.totalAmount || 0);
    return acc;
  }, {});

  const citySales = transactions.reduce((acc, t) => {
    acc[t.city] = (acc[t.city] || 0) + Number(t.totalAmount || 0);
    return acc;
  }, {});

  return {
    kpis: {
      totalRevenue,
      totalCampaignRevenue,
      marketingROI: Number(avgMarketingROI.toFixed(1)),
      staffAttendance: avgStaffAttendance,
      auditCompliance: avgAuditCompliance,
      highRiskOutletsCount: highRiskOutletsList.length,
      highRiskOutlets: highRiskOutletsList,
      activeAlertsCount,
    },
    charts: {
      categorySales: Object.entries(categorySales).map(([name, value]) => ({ name, value })),
      citySales: Object.entries(citySales).map(([name, value]) => ({ name, value })),
      outletAuditCompliance: audits.map((a) => ({ name: a.outletName, compliance: a.compliancePercentage, score: a.score })),
      marketingRoiByCampaign: campaigns.map((c) => ({
        name: c.name,
        roi: Number(c.budget) > 0 ? Number((((Number(c.revenueGenerated) - Number(c.budget)) / Number(c.budget)) * 100).toFixed(1)) : 0,
      })),
    },
  };
}

export async function getBIRecommendations(user) {
  const scope = getScopeWhere(user);

  const [transactions, campaigns, audits, staffList, alerts] = await Promise.all([
    prisma.retailTransaction.findMany(),
    prisma.marketingCampaign.findMany({ where: scope }),
    prisma.audit.findMany({ where: scope }),
    prisma.staff.findMany({ where: scope }),
    prisma.alert.findMany({ where: scope }),
  ]);

  const insights = [];

  const failedAudit = audits.find((a) => a.status === "FAILED" || a.score < 70);
  if (failedAudit) {
    insights.push({
      category: "Audit & Safety Risk",
      priority: "CRITICAL",
      title: `Low Compliance at ${failedAudit.outletName}`,
      description: `Outlet ${failedAudit.outletName} failed audit code ${failedAudit.auditCode} with score ${failedAudit.score}%. Immediate corrective action required.`,
      action: "Schedule emergency re-audit and verify safety protocols.",
      metric: `${failedAudit.score}% Score`,
    });
  }

  const lowAttendanceStaff = staffList.filter((s) => s.attendanceRate < 85);
  if (lowAttendanceStaff.length > 0) {
    insights.push({
      category: "Staff Productivity",
      priority: "WARNING",
      title: "Staff Attendance Deficit Detected",
      description: `${lowAttendanceStaff.length} staff member(s) reported attendance below 85% threshold, affecting shift coverage.`,
      action: "Review shift allocations and initiate attendance counseling.",
      metric: `${lowAttendanceStaff.length} Staff Affected`,
    });
  }

  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.productCategory] = (acc[t.productCategory] || 0) + Number(t.totalAmount || 0);
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const topCat = sortedCategories[0];
    insights.push({
      category: "Sales Strategy",
      priority: "INFO",
      title: `Capitalize on High Sales Category: ${topCat[0]}`,
      description: `${topCat[0]} generated ₹${topCat[1].toLocaleString("en-IN")} in gross revenue.`,
      action: "Maintain stock levels and bundle with low-demand items to drive margin.",
      metric: `₹${topCat[1].toLocaleString("en-IN")}`,
    });
  }

  const highRoiCampaign = campaigns.sort((a, b) => Number(b.revenueGenerated) - Number(a.revenueGenerated))[0];
  if (highRoiCampaign) {
    const budget = Number(highRoiCampaign.budget || 1);
    const revenue = Number(highRoiCampaign.revenueGenerated || 0);
    const roiVal = ((revenue - budget) / budget) * 100;

    insights.push({
      category: "Marketing Efficiency",
      priority: "INFO",
      title: `Scale High ROI Campaign: ${highRoiCampaign.name}`,
      description: `Campaign achieved ${roiVal.toFixed(1)}% ROI generating ₹${revenue.toLocaleString("en-IN")} revenue.`,
      action: "Extend budget for high-performing channels in similar regional markets.",
      metric: `${roiVal.toFixed(1)}% ROI`,
    });
  }

  return {
    summary: `Business Intelligence engine processed ${transactions.length} retail transactions, ${campaigns.length} campaigns, ${audits.length} audits, and ${staffList.length} staff profiles.`,
    recommendations: insights,
  };
}
