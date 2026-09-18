const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getAuthToken() {
  return localStorage.getItem("franchise_auth_token") || "";
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("franchise_auth_token", token);
  } else {
    localStorage.removeItem("franchise_auth_token");
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`API Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request("/health"),

  // Auth
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  signup: (userData) => request("/auth/signup", { method: "POST", body: JSON.stringify(userData) }),
  getProfile: () => request("/auth/me"),

  // Audits
  getAuditDashboard: () => request("/audits/dashboard"),
  listAudits: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/audits${query ? `?${query}` : ""}`);
  },
  getAuditById: (id) => request(`/audits/${id}`),
  createAudit: (auditData) => request("/audits", { method: "POST", body: JSON.stringify(auditData) }),
  updateAudit: (id, auditData) => request(`/audits/${id}`, { method: "PUT", body: JSON.stringify(auditData) }),
  deleteAudit: (id) => request(`/audits/${id}`, { method: "DELETE" }),

  // Marketing
  getMarketingDashboard: () => request("/marketing/dashboard"),
  getMarketingAnalytics: () => request("/marketing/analytics"),
  listCampaigns: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/marketing/campaigns${query ? `?${query}` : ""}`);
  },
  createCampaign: (campaignData) => request("/marketing/campaigns", { method: "POST", body: JSON.stringify(campaignData) }),
  updateCampaign: (id, campaignData) => request(`/marketing/campaigns/${id}`, { method: "PUT", body: JSON.stringify(campaignData) }),
  deleteCampaign: (id) => request(`/marketing/campaigns/${id}`, { method: "DELETE" }),
  getEngagementAnalytics: () => request("/marketing/engagement"),
  getRoiAnalytics: () => request("/marketing/roi"),
  getMarketingRecommendations: () => request("/marketing/recommendations"),

  // Intelligence & BI
  getIntelligenceDashboard: () => request("/intelligence/dashboard"),
  getIntelligenceRecommendations: () => request("/intelligence/recommendations"),
  getOutletProfile: (outletName) => request(`/intelligence/outlet/${encodeURIComponent(outletName)}`),
  generateAlerts: () => request("/intelligence/generate-alerts", { method: "POST" }),
  getBIDashboard: () => request("/bi/dashboard"),

  // Alerts
  listAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/alerts${query ? `?${query}` : ""}`);
  },
  markAlertAsRead: (id) => request(`/alerts/${id}/read`, { method: "PUT" }),
  markAllAlertsAsRead: () => request("/alerts/read-all", { method: "PUT" }),

  // Staff
  getStaffDashboard: () => request("/staff/dashboard"),
  listStaff: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/staff${query ? `?${query}` : ""}`);
  },
  createStaff: (staffData) => request("/staff", { method: "POST", body: JSON.stringify(staffData) }),
  updateStaff: (id, staffData) => request(`/staff/${id}`, { method: "PUT", body: JSON.stringify(staffData) }),
  deleteStaff: (id) => request(`/staff/${id}`, { method: "DELETE" }),
};

export default api;
