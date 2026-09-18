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

function computeHealthScore({ audits, staffList, campaigns, transactions }) {
  const factors = [];

  if (audits.length > 0) {
    const avgCompliance =
      audits.reduce((s, a) => s + a.compliancePercentage, 0) / audits.length;
    factors.push({
      name: "Audit Compliance",
      score: Math.round(avgCompliance),
      weight: 30,
      description: `Average compliance across ${audits.length} audit(s)`,
      status:
        avgCompliance >= 80
          ? "healthy"
          : avgCompliance >= 65
          ? "watch"
          : "risk",
    });
  }

  if (staffList.length > 0) {
    const avgAttendance =
      staffList.reduce((s, st) => s + (st.attendanceRate || 100), 0) /
      staffList.length;
    factors.push({
      name: "Staff Attendance",
      score: Math.round(avgAttendance),
      weight: 25,
      description: `Average attendance rate across ${staffList.length} staff member(s)`,
      status:
        avgAttendance >= 85
          ? "healthy"
          : avgAttendance >= 75
          ? "watch"
          : "risk",
    });
  }

  if (campaigns.length > 0) {
    const totalSpend = campaigns.reduce(
      (s, c) => s + Number(c.budget || 0),
      0
    );
    const totalRevenue = campaigns.reduce(
      (s, c) => s + Number(c.revenueGenerated || 0),
      0
    );
    if (totalSpend > 0) {
      const rawRoi = ((totalRevenue - totalSpend) / totalSpend) * 100;
      const cappedScore = Math.min(100, Math.max(0, 50 + rawRoi / 2));
      factors.push({
        name: "Marketing ROI",
        score: Math.round(cappedScore),
        weight: 20,
        rawRoi: Number(rawRoi.toFixed(1)),
        description: `${campaigns.length} campaign(s), ROI: ${rawRoi.toFixed(1)}%`,
        status: rawRoi >= 20 ? "healthy" : rawRoi >= 0 ? "watch" : "risk",
      });
    }
  }

  if (transactions.length > 0) {
    const activityScore = Math.min(100, transactions.length);
    factors.push({
      name: "Sales Activity",
      score: activityScore,
      weight: 25,
      description: `${transactions.length} retail transaction(s) recorded`,
      status: transactions.length >= 50 ? "healthy" : "watch",
    });
  }

  if (factors.length === 0) {
    return { score: null, factors: [], hasData: false };
  }

  const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
  const weightedScore =
    factors.reduce((s, f) => s + (f.score * f.weight) / totalWeight, 0);

  return {
    score: Math.round(weightedScore),
    factors,
    hasData: true,
  };
}

function classifyOutlet(outletAudits) {
  if (!outletAudits || outletAudits.length === 0) return "No Data";
  const avgScore =
    outletAudits.reduce((s, a) => s + a.score, 0) / outletAudits.length;
  const failedCount = outletAudits.filter((a) => a.status === "FAILED").length;
  const hasVeryLow = outletAudits.some((a) => a.score < 50);

  if (avgScore < 60 || hasVeryLow) return "Critical";
  if (avgScore < 70 || failedCount > 1) return "At Risk";
  if (avgScore < 80 || failedCount === 1) return "Watch";
  return "Healthy";
}

export async function getIntelligenceDashboard(user) {
  const scope = getScopeWhere(user);

  const [transactions, campaigns, audits, staffList, alerts] =
    await Promise.all([
      prisma.retailTransaction.findMany(),
      prisma.marketingCampaign.findMany({ where: scope }),
      prisma.audit.findMany({
        where: scope,
        include: { items: true },
        orderBy: { auditDate: "desc" },
      }),
      prisma.staff.findMany({ where: scope }),
      prisma.alert.findMany({ where: { ...scope, isRead: false } }),
    ]);

  const healthScore = computeHealthScore({
    audits,
    staffList,
    campaigns,
    transactions,
  });

  const totalRevenue = transactions.reduce(
    (s, t) => s + Number(t.totalAmount || 0),
    0
  );

  const totalSpend = campaigns.reduce((s, c) => s + Number(c.budget || 0), 0);
  const totalCampRevenue = campaigns.reduce(
    (s, c) => s + Number(c.revenueGenerated || 0),
    0
  );
  const marketingROI =
    totalSpend > 0
      ? Number(
          (((totalCampRevenue - totalSpend) / totalSpend) * 100).toFixed(1)
        )
      : null;

  const avgStaffAttendance =
    staffList.length > 0
      ? Math.round(
          staffList.reduce((s, st) => s + (st.attendanceRate || 100), 0) /
            staffList.length
        )
      : null;

  const avgAuditCompliance =
    audits.length > 0
      ? Math.round(
          audits.reduce((s, a) => s + a.compliancePercentage, 0) / audits.length
        )
      : null;

  const highRiskOutlets = [
    ...new Set(
      audits
        .filter((a) => a.status === "FAILED" || a.score < 70)
        .map((a) => a.outletName)
    ),
  ];

  const auditsByOutlet = audits.reduce((acc, a) => {
    if (!acc[a.outletName]) acc[a.outletName] = [];
    acc[a.outletName].push(a);
    return acc;
  }, {});

  const txOutlets = [
    ...new Set(transactions.map((t) => t.city).filter(Boolean)),
  ];
  const auditOutlets = Object.keys(auditsByOutlet);
  const allOutlets = [...new Set([...auditOutlets, ...txOutlets])];

  const outletMatrix = allOutlets.map((outletName) => {
    const outletAudits = auditsByOutlet[outletName] || [];
    const classification = classifyOutlet(outletAudits);

    const outletTx = transactions.filter((t) => t.city === outletName);
    const outletRevenue = outletTx.reduce(
      (s, t) => s + Number(t.totalAmount || 0),
      0
    );

    const lastAudit = outletAudits[0] || null;

    return {
      outletName,
      classification,
      auditScore: lastAudit ? lastAudit.score : null,
      auditCompliance: lastAudit ? lastAudit.compliancePercentage : null,
      lastAuditDate: lastAudit ? lastAudit.auditDate : null,
      lastAuditStatus: lastAudit ? lastAudit.status : null,
      totalAudits: outletAudits.length,
      failedAudits: outletAudits.filter((a) => a.status === "FAILED").length,
      revenue: outletRevenue > 0 ? outletRevenue : null,
      transactionCount: outletTx.length,
    };
  });

  const sortOrder = { Critical: 0, "At Risk": 1, Watch: 2, Healthy: 3, "No Data": 4 };
  outletMatrix.sort(
    (a, b) => (sortOrder[a.classification] ?? 5) - (sortOrder[b.classification] ?? 5)
  );

  return {
    healthScore,
    businessPulse: {
      totalRevenue,
      marketingROI,
      staffAttendance: avgStaffAttendance,
      auditCompliance: avgAuditCompliance,
      highRiskOutletsCount: highRiskOutlets.length,
      highRiskOutlets,
      activeAlerts: alerts.length,
      totalTransactions: transactions.length,
      totalCampaigns: campaigns.length,
      totalStaff: staffList.length,
      totalAudits: audits.length,
    },
    outletMatrix,
  };
}

export async function getOutletProfile(user, outletName) {
  const scope = getScopeWhere(user);

  const [audits, alerts, campaigns] = await Promise.all([
    prisma.audit.findMany({
      where: { ...scope, outletName: { contains: outletName, mode: "insensitive" } },
      include: { items: true },
      orderBy: { auditDate: "desc" },
    }),
    prisma.alert.findMany({
      where: { ...scope, outletName: { contains: outletName, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.marketingCampaign.findMany({
      where: {
        ...scope,
        OR: [
          { outletName: { contains: outletName, mode: "insensitive" } },
          { city: { contains: outletName, mode: "insensitive" } },
        ],
      },
      orderBy: { startDate: "desc" },
    }),
  ]);

  const transactions = await prisma.retailTransaction.findMany({
    where: { city: { contains: outletName, mode: "insensitive" } },
  });

  const totalRevenue = transactions.reduce(
    (s, t) => s + Number(t.totalAmount || 0),
    0
  );

  const avgAuditScore =
    audits.length > 0
      ? Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length)
      : null;
  const avgCompliance =
    audits.length > 0
      ? Math.round(
          audits.reduce((s, a) => s + a.compliancePercentage, 0) / audits.length
        )
      : null;

  const classification = classifyOutlet(audits);
  const failedAudits = audits.filter((a) => a.status === "FAILED");
  const recentAudit = audits[0] || null;

  const observations = [];
  const drivers = [];
  const actions = [];

  if (recentAudit) {
    if (recentAudit.score < 70) {
      observations.push(
        `Audit score is ${recentAudit.score}%, below the 70% threshold.`
      );
      drivers.push("Recent audit identified compliance gaps in the checklist.");
      actions.push(
        "Schedule a re-audit and address failing checklist categories immediately."
      );
    } else {
      observations.push(
        `Audit compliance is at ${avgCompliance}%, within acceptable range.`
      );
    }
  }

  if (failedAudits.length > 0) {
    observations.push(`${failedAudits.length} audit(s) with FAILED status.`);
    drivers.push(
      "Persistent compliance failures detected across multiple audit cycles."
    );
    actions.push("Conduct a root-cause analysis on failed audit checklist items.");
  }

  if (transactions.length > 0) {
    observations.push(
      `${transactions.length} retail transaction(s) recorded generating ₹${totalRevenue.toLocaleString("en-IN")} revenue.`
    );
  } else {
    observations.push("No retail transaction data available for this outlet.");
  }

  if (campaigns.length > 0) {
    const campRevenue = campaigns.reduce(
      (s, c) => s + Number(c.revenueGenerated || 0),
      0
    );
    const campSpend = campaigns.reduce(
      (s, c) => s + Number(c.budget || 0),
      0
    );
    const roi =
      campSpend > 0
        ? Number((((campRevenue - campSpend) / campSpend) * 100).toFixed(1))
        : null;
    if (roi !== null) {
      observations.push(`${campaigns.length} marketing campaign(s) with ${roi}% ROI.`);
      if (roi < 0) {
        drivers.push("Marketing spend exceeds revenue generated — negative ROI.");
        actions.push("Review campaign targeting and channel effectiveness.");
      }
    }
  }

  if (alerts.length > 0) {
    const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL");
    if (criticalAlerts.length > 0) {
      observations.push(`${criticalAlerts.length} active critical alert(s) for this outlet.`);
      drivers.push("Critical system alerts indicate operational risk.");
      actions.push("Review and resolve critical alerts in the Alerts Center.");
    }
  }

  if (observations.length === 0) {
    observations.push("Insufficient data to generate observations for this outlet.");
  }

  return {
    outletName,
    classification,
    metrics: {
      totalRevenue: totalRevenue > 0 ? totalRevenue : null,
      transactionCount: transactions.length,
      avgAuditScore,
      avgCompliance,
      totalAudits: audits.length,
      failedAudits: failedAudits.length,
      recentAudit: recentAudit
        ? {
            code: recentAudit.auditCode,
            date: recentAudit.auditDate,
            score: recentAudit.score,
            compliance: recentAudit.compliancePercentage,
            status: recentAudit.status,
            type: recentAudit.auditType,
          }
        : null,
      totalCampaigns: campaigns.length,
      activeAlerts: alerts.filter((a) => !a.isRead).length,
    },
    intelligence: { observations, drivers, actions },
    recentAlerts: alerts.slice(0, 5),
    recentAudits: audits.slice(0, 3).map((a) => ({
      code: a.auditCode,
      date: a.auditDate,
      score: a.score,
      compliance: a.compliancePercentage,
      status: a.status,
      type: a.auditType,
      items: a.items || [],
    })),
  };
}

export async function getRecommendations(user) {
  const scope = getScopeWhere(user);

  const [transactions, campaigns, audits, staffList] = await Promise.all([
    prisma.retailTransaction.findMany(),
    prisma.marketingCampaign.findMany({ where: scope }),
    prisma.audit.findMany({ where: scope, include: { items: true } }),
    prisma.staff.findMany({ where: scope }),
  ]);

  const recommendations = [];

  const failedAudits = audits.filter(
    (a) => a.status === "FAILED" || a.score < 70
  );
  const failedByOutlet = failedAudits.reduce((acc, a) => {
    acc[a.outletName] = (acc[a.outletName] || 0) + 1;
    return acc;
  }, {});

  for (const [outlet, count] of Object.entries(failedByOutlet)) {
    const outletAudits = audits.filter((a) => a.outletName === outlet);
    const worst = outletAudits.sort((a, b) => a.score - b.score)[0];
    const failItems = (worst?.items || []).filter((i) => i.status === "FAIL");
    const categories = [...new Set(failItems.map((i) => i.category))];

    recommendations.push({
      id: `audit-${outlet}`,
      title: `Audit Compliance Action Required: ${outlet}`,
      priority: worst?.score < 60 ? "Critical" : "High",
      category: "Audit",
      outlet,
      reason: `${count} audit(s) scored below 70% compliance threshold. Worst score: ${worst?.score ?? "N/A"}%.`,
      action:
        "Schedule immediate re-audit. Address all FAIL items in: " +
        (categories.length > 0 ? categories.join(", ") : "general compliance"),
      impact: "Prevent regulatory risk and franchise compliance failure.",
      evidence: {
        auditScore: worst?.score ?? null,
        auditCompliance: worst?.compliancePercentage ?? null,
        failedItemCount: failItems.length,
        failedCategories: categories,
        totalAuditsForOutlet: outletAudits.length,
      },
    });
  }

  const lowAttendanceStaff = staffList.filter((s) => s.attendanceRate < 85);
  if (lowAttendanceStaff.length > 0) {
    const byDept = lowAttendanceStaff.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {});
    const worstDept = Object.entries(byDept).sort((a, b) => b[1] - a[1])[0];
    const avgRate =
      Math.round(
        lowAttendanceStaff.reduce((s, st) => s + st.attendanceRate, 0) /
          lowAttendanceStaff.length
      );

    recommendations.push({
      id: "staff-attendance",
      title: "Staff Attendance Below Threshold",
      priority: lowAttendanceStaff.length > 5 ? "High" : "Medium",
      category: "Staff",
      outlet: "All Outlets",
      reason: `${lowAttendanceStaff.length} staff member(s) have attendance rates below 85%. Highest impact in: ${worstDept?.[0] ?? "N/A"} department.`,
      action:
        "Review shift schedules, identify recurring absentees, and initiate HR counseling process.",
      impact: "Restore operational capacity and reduce workload imbalance.",
      evidence: {
        affectedStaff: lowAttendanceStaff.length,
        avgAttendanceRate: avgRate,
        worstDepartment: worstDept?.[0] ?? null,
        affectedDepartments: Object.entries(byDept).map(([dept, count]) => ({
          dept,
          count,
        })),
      },
    });
  }

  const negativeCampaigns = campaigns.filter(
    (c) =>
      Number(c.budget || 0) > 0 &&
      Number(c.revenueGenerated || 0) < Number(c.budget || 0)
  );
  if (negativeCampaigns.length > 0) {
    const totalLoss = negativeCampaigns.reduce(
      (s, c) => s + (Number(c.budget || 0) - Number(c.revenueGenerated || 0)),
      0
    );
    recommendations.push({
      id: "marketing-roi",
      title: "Negative ROI Campaigns Detected",
      priority: "Medium",
      category: "Marketing",
      outlet: "Multiple Outlets",
      reason: `${negativeCampaigns.length} campaign(s) generating less revenue than spend. Total estimated loss: ₹${totalLoss.toLocaleString("en-IN")}.`,
      action:
        "Pause underperforming campaigns. Redirect budget to higher-ROI channels or high-performing campaign types.",
      impact: "Recover marketing spend efficiency and reduce wastage.",
      evidence: {
        negativeCampaigns: negativeCampaigns.map((c) => ({
          name: c.name,
          type: c.type,
          budget: Number(c.budget),
          revenue: Number(c.revenueGenerated),
          roi: Number(
            (
              ((Number(c.revenueGenerated) - Number(c.budget)) /
                Number(c.budget)) *
              100
            ).toFixed(1)
          ),
        })),
        totalLoss,
      },
    });
  }

  if (transactions.length > 0) {
    const categorySales = transactions.reduce((acc, t) => {
      acc[t.productCategory] = (acc[t.productCategory] || 0) + Number(t.totalAmount || 0);
      return acc;
    }, {});
    const sorted = Object.entries(categorySales).sort((a, b) => b[1] - a[1]);
    const topCat = sorted[0];
    const bottomCat = sorted[sorted.length - 1];

    if (topCat && sorted.length > 1) {
      recommendations.push({
        id: "sales-top-category",
        title: `Capitalise on Leading Category: ${topCat[0]}`,
        priority: "Low",
        category: "Sales",
        outlet: "All Outlets",
        reason: `${topCat[0]} contributes ₹${topCat[1].toLocaleString("en-IN")} — the highest of all product categories.`,
        action:
          "Ensure adequate stock levels for this category. Bundle with lower-performing categories to drive cross-sales.",
        impact: "Protect top revenue stream and increase average basket value.",
        evidence: {
          topCategory: topCat[0],
          topRevenue: topCat[1],
          allCategories: sorted.map(([name, value]) => ({ name, value })),
          bottomCategory: bottomCat[0],
          bottomRevenue: bottomCat[1],
        },
      });
    }
  }

  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  recommendations.sort(
    (a, b) =>
      (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4)
  );

  const summary = `Intelligence engine analysed ${transactions.length} transactions, ${campaigns.length} campaigns, ${audits.length} audits, and ${staffList.length} staff profiles. Generated ${recommendations.length} data-driven recommendation(s).`;

  return { summary, recommendations };
}

export async function generateSmartAlerts(user) {
  const scope = getScopeWhere(user);
  const created = [];
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [audits, staffList, campaigns] = await Promise.all([
    prisma.audit.findMany({ where: scope }),
    prisma.staff.findMany({ where: scope }),
    prisma.marketingCampaign.findMany({ where: scope }),
  ]);

  const existingAlerts = await prisma.alert.findMany({
    where: { ...scope, createdAt: { gte: cutoff } },
    select: { title: true },
  });
  const existingTitles = new Set(existingAlerts.map((a) => a.title));

  for (const audit of audits) {
    if (audit.status === "FAILED" || audit.score < 60) {
      const title = `Critical Audit Failure: ${audit.outletName}`;
      if (!existingTitles.has(title)) {
        const alert = await prisma.alert.create({
          data: {
            type: "AUDIT",
            severity: "CRITICAL",
            title,
            message: `Audit ${audit.auditCode} for ${audit.outletName} received a score of ${audit.score}% and status ${audit.status}. Immediate corrective action required.`,
            outletName: audit.outletName,
            franchiseId: audit.franchiseId || null,
            isRead: false,
          },
        });
        created.push(alert);
        existingTitles.add(title);
      }
    } else if (audit.score < 70) {
      const title = `Low Audit Compliance: ${audit.outletName}`;
      if (!existingTitles.has(title)) {
        const alert = await prisma.alert.create({
          data: {
            type: "AUDIT",
            severity: "WARNING",
            title,
            message: `Audit ${audit.auditCode} for ${audit.outletName} scored ${audit.score}% — below the 70% compliance threshold. Review required.`,
            outletName: audit.outletName,
            franchiseId: audit.franchiseId || null,
            isRead: false,
          },
        });
        created.push(alert);
        existingTitles.add(title);
      }
    }
  }

  const lowAttendance = staffList.filter((s) => s.attendanceRate < 80);
  if (lowAttendance.length > 0) {
    const title = `Staff Attendance Alert: ${lowAttendance.length} member(s) below 80%`;
    if (!existingTitles.has(title)) {
      const alert = await prisma.alert.create({
        data: {
          type: "STAFF",
          severity: "WARNING",
          title,
          message: `${lowAttendance.length} staff member(s) have attendance below 80% threshold, potentially impacting shift coverage and outlet operations.`,
          outletName: null,
          isRead: false,
        },
      });
      created.push(alert);
    }
  }

  const negativeCampaigns = campaigns.filter(
    (c) =>
      Number(c.budget || 0) > 0 &&
      Number(c.revenueGenerated || 0) < Number(c.budget || 0) * 0.5
  );
  if (negativeCampaigns.length > 0) {
    const title = `Marketing ROI Warning: ${negativeCampaigns.length} underperforming campaign(s)`;
    if (!existingTitles.has(title)) {
      const alert = await prisma.alert.create({
        data: {
          type: "MARKETING",
          severity: "WARNING",
          title,
          message: `${negativeCampaigns.length} campaign(s) are generating less than 50% of their budget in revenue. Review campaign strategy and channel mix.`,
          outletName: null,
          isRead: false,
        },
      });
      created.push(alert);
    }
  }

  return { created: created.length, alerts: created };
}
