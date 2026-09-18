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

export async function listAlerts(user, query = {}) {
  const { severity = "", type = "", search = "", isRead = "" } = query;
  const scope = getScopeWhere(user);

  const where = { ...scope };

  if (severity && severity !== "All") {
    where.severity = severity;
  }

  if (type && type !== "All") {
    where.type = type;
  }

  if (isRead === "unread") {
    where.isRead = false;
  } else if (isRead === "read") {
    where.isRead = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
      { outletName: { contains: search, mode: "insensitive" } },
    ];
  }

  const alerts = await prisma.alert.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const total = alerts.length;
  const unreadCount = alerts.filter((a) => !a.isRead).length;
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const warningCount = alerts.filter((a) => a.severity === "WARNING").length;
  const infoCount = alerts.filter((a) => a.severity === "INFO").length;

  return {
    data: alerts,
    summary: {
      totalAlerts: total,
      unreadAlerts: unreadCount,
      criticalAlerts: criticalCount,
      warningAlerts: warningCount,
      infoAlerts: infoCount,
    },
  };
}

export async function markAlertAsRead(user, id) {
  const alert = await prisma.alert.findUnique({ where: { id } });
  if (!alert) {
    const err = new Error("Alert not found");
    err.status = 404;
    throw err;
  }

  const updated = await prisma.alert.update({
    where: { id },
    data: { isRead: true },
  });

  return updated;
}

export async function markAllAlertsAsRead(user) {
  const scope = getScopeWhere(user);
  await prisma.alert.updateMany({
    where: { ...scope, isRead: false },
    data: { isRead: true },
  });

  return { success: true };
}
