export const ROLE_HIERARCHY = {
  ADMIN: 3,
  REGIONAL_MANAGER: 2,
  OUTLET_MANAGER: 1,
};

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

export function buildStaffScopeFilter(user) {
  if (!user) return {};

  switch (user.role) {
    case "ADMIN":
      return {};
    case "REGIONAL_MANAGER":
      if (!user.region) return { franchise: { region: "__none__" } };
      return { franchise: { region: user.region } };
    case "OUTLET_MANAGER":
      if (!user.franchiseId) return { franchiseId: "__none__" };
      return { franchiseId: user.franchiseId };
    default:
      return { franchiseId: "__none__" };
  }
}

export function canManageStaff(user, staffFranchiseId, staffRegion) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (user.role === "REGIONAL_MANAGER") return user.region === staffRegion;
  if (user.role === "OUTLET_MANAGER") return user.franchiseId === staffFranchiseId;
  return false;
}
