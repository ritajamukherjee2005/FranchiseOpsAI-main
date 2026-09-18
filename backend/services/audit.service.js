import { prisma } from "../lib/prisma.js";

const AUDIT_TYPES = ["OPERATIONAL", "HYGIENE", "SAFETY", "COMPLIANCE", "INVENTORY"];
const AUDIT_STATUSES = ["COMPLETED", "PENDING", "FAILED", "IN_PROGRESS"];

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

function buildAuditFilter(query) {
  const { search = "", type = "", status = "", outlet = "", city = "", startDate = "", endDate = "" } = query;
  const where = {};

  if (search) {
    where.OR = [
      { auditCode: { contains: search, mode: "insensitive" } },
      { outletName: { contains: search, mode: "insensitive" } },
      { auditorName: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type && type !== "All") {
    where.auditType = type;
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

  if (startDate || endDate) {
    where.auditDate = {};
    if (startDate) where.auditDate.gte = new Date(startDate);
    if (endDate) where.auditDate.lte = new Date(endDate);
  }

  return where;
}

export function calculateChecklistScore(items = []) {
  const applicableItems = items.filter((item) => item.status !== "NOT_APPLICABLE");
  if (!applicableItems.length) {
    return { score: 0, compliancePercentage: 0 };
  }

  let totalScorePoints = 0;
  let passCount = 0;

  for (const item of applicableItems) {
    if (item.status === "PASS") {
      totalScorePoints += 100;
      passCount += 1;
    } else if (item.status === "PARTIAL") {
      totalScorePoints += 50;
    }
  }

  const score = Math.round((totalScorePoints / (applicableItems.length * 100)) * 100);
  const compliancePercentage = Math.round((passCount / applicableItems.length) * 100);

  return { score, compliancePercentage };
}

export async function getAuditDashboard(user, query = {}) {
  const scope = getScopeWhere(user);
  const where = { ...scope, ...buildAuditFilter(query) };

  const audits = await prisma.audit.findMany({
    where,
    include: { items: true },
    orderBy: { auditDate: "desc" },
  });

  const totalAudits = audits.length;
  const completedAudits = audits.filter((a) => a.status === "COMPLETED").length;
  const pendingAudits = audits.filter((a) => a.status === "PENDING" || a.status === "IN_PROGRESS").length;
  const failedAudits = audits.filter((a) => a.status === "FAILED").length;

  const avgScore = totalAudits ? Math.round(audits.reduce((acc, a) => acc + a.score, 0) / totalAudits) : 0;
  const avgCompliance = totalAudits ? Math.round(audits.reduce((acc, a) => acc + a.compliancePercentage, 0) / totalAudits) : 0;

  const highRiskOutletsList = [...new Set(audits.filter((a) => a.status === "FAILED" || a.score < 70).map((a) => a.outletName))];
  const outletsAuditedCount = [...new Set(audits.map((a) => a.outletName))].length;

  return {
    summary: {
      totalAudits,
      completedAudits,
      pendingAudits,
      failedAudits,
      averageScore: avgScore,
      averageCompliancePercentage: avgCompliance,
      highRiskOutletsCount: highRiskOutletsList.length,
      highRiskOutlets: highRiskOutletsList,
      outletsAuditedCount,
    },
    recentAudits: audits.slice(0, 5),
    filters: {
      types: AUDIT_TYPES,
      statuses: AUDIT_STATUSES,
      outlets: [...new Set(audits.map((a) => a.outletName).filter(Boolean))],
    },
  };
}

export async function listAudits(user, query = {}) {
  const { page = "1", limit = "8", sortBy = "auditDate", sortDir = "desc" } = query;
  const scope = getScopeWhere(user);
  const where = { ...scope, ...buildAuditFilter(query) };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 8));
  const skip = (pageNum - 1) * pageSize;

  const orderDirection = sortDir === "asc" ? "asc" : "desc";

  const [total, audits] = await Promise.all([
    prisma.audit.count({ where }),
    prisma.audit.findMany({
      where,
      include: { items: true, franchise: { select: { name: true, city: true } } },
      orderBy: { [sortBy]: orderDirection },
      skip,
      take: pageSize,
    }),
  ]);

  return {
    data: audits,
    total,
    page: pageNum,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    filters: {
      types: AUDIT_TYPES,
      statuses: AUDIT_STATUSES,
    },
  };
}

export async function getAuditById(user, id) {
  const audit = await prisma.audit.findUnique({
    where: { id },
    include: { items: true, franchise: { select: { id: true, name: true, region: true } } },
  });

  if (!audit) {
    const err = new Error("Audit record not found");
    err.status = 404;
    throw err;
  }

  return audit;
}

export async function createAuditRecord(user, payload) {
  const { outletName, city, auditorName, auditDate, auditType, status, remarks, items = [] } = payload;

  if (!outletName || !auditorName || !auditDate) {
    const err = new Error("Missing required audit fields");
    err.status = 400;
    throw err;
  }

  const { score, compliancePercentage } = calculateChecklistScore(items);
  const auditCode = `AUD-${Date.now().toString().slice(-6)}`;

  let finalStatus = status || "PENDING";
  if (items.length > 0 && finalStatus === "PENDING") {
    finalStatus = score < 60 ? "FAILED" : "COMPLETED";
  }

  let franchiseId = payload.franchiseId || null;
  if (user.role === "OUTLET_MANAGER" && user.franchiseId) {
    franchiseId = user.franchiseId;
  }

  const audit = await prisma.audit.create({
    data: {
      auditCode,
      outletName: String(outletName).trim(),
      city: city ? String(city).trim() : null,
      auditorName: String(auditorName).trim(),
      auditDate: new Date(auditDate),
      auditType: auditType || "OPERATIONAL",
      status: finalStatus,
      score,
      compliancePercentage,
      remarks: remarks ? String(remarks).trim() : null,
      franchiseId,
      items: {
        create: items.map((item) => ({
          category: item.category || "General Operations",
          question: item.question,
          status: item.status || "PASS",
          notes: item.notes ? String(item.notes).trim() : null,
        })),
      },
    },
    include: { items: true },
  });

  return audit;
}

export async function updateAuditRecord(user, id, payload) {
  const existing = await prisma.audit.findUnique({ where: { id }, include: { items: true } });
  if (!existing) {
    const err = new Error("Audit record not found");
    err.status = 404;
    throw err;
  }

  const updateData = {};
  if (payload.outletName) updateData.outletName = String(payload.outletName).trim();
  if (payload.city) updateData.city = String(payload.city).trim();
  if (payload.auditorName) updateData.auditorName = String(payload.auditorName).trim();
  if (payload.auditDate) updateData.auditDate = new Date(payload.auditDate);
  if (payload.auditType) updateData.auditType = payload.auditType;
  if (payload.status) updateData.status = payload.status;
  if (payload.remarks !== undefined) updateData.remarks = payload.remarks;

  if (payload.items) {
    const { score, compliancePercentage } = calculateChecklistScore(payload.items);
    updateData.score = score;
    updateData.compliancePercentage = compliancePercentage;

    await prisma.auditChecklistItem.deleteMany({ where: { auditId: id } });
    await prisma.auditChecklistItem.createMany({
      data: payload.items.map((item) => ({
        auditId: id,
        category: item.category || "General Operations",
        question: item.question,
        status: item.status || "PASS",
        notes: item.notes ? String(item.notes).trim() : null,
      })),
    });
  }

  const updatedAudit = await prisma.audit.update({
    where: { id },
    data: updateData,
    include: { items: true },
  });

  return updatedAudit;
}

export async function deleteAuditRecord(user, id) {
  const existing = await prisma.audit.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error("Audit record not found");
    err.status = 404;
    throw err;
  }

  await prisma.audit.delete({ where: { id } });
  return { success: true, id };
}
