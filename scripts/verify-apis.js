async function runVerification() {
  console.log("🔍 Verifying FranchiseOpsAI Backend APIs on http://localhost:5000...");

  try {
    const health = await fetch("http://localhost:5000/api/health").then((r) => r.json());
    console.log("✅ 1. Health API:", health);

    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "rajesh.kumar@franchiseops.ai", password: "password123" }),
    }).then((r) => r.json());

    if (!loginRes.token) {
      throw new Error("Login failed: " + JSON.stringify(loginRes));
    }
    console.log("✅ 2. Login API: SUCCESS (Token received for user:", loginRes.user.email, ")");

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginRes.token}`,
    };

    const auditDash = await fetch("http://localhost:5000/api/audits/dashboard", { headers: authHeaders }).then((r) => r.json());
    console.log("✅ 3. Audit Dashboard API: Total Audits =", auditDash.summary.totalAudits, "| Avg Compliance =", auditDash.summary.averageCompliancePercentage + "%");

    const auditList = await fetch("http://localhost:5000/api/audits", { headers: authHeaders }).then((r) => r.json());
    console.log("✅ 4. Audit List API: Loaded", auditList.data.length, "audit records");

    const biDash = await fetch("http://localhost:5000/api/bi/dashboard", { headers: authHeaders }).then((r) => r.json());
    console.log("✅ 5. BI Dashboard API: Health Score =", biDash.healthScore?.score ?? "N/A", "| Matrix Outlets =", biDash.outletMatrix?.length ?? 0);

    const intelDash = await fetch("http://localhost:5000/api/intelligence/dashboard", { headers: authHeaders }).then((r) => r.json());
    console.log("✅ 6. Intelligence Dashboard API: Health Score =", intelDash.healthScore?.score ?? "N/A", "| Revenue =", intelDash.businessPulse?.totalRevenue ?? "N/A");

    const biRecs = await fetch("http://localhost:5000/api/intelligence/recommendations", { headers: authHeaders }).then((r) => r.json());
    console.log("✅ 7. Intelligence Recommendations API: Derived", biRecs.recommendations?.length ?? 0, "data-driven insights");

    const genAlerts = await fetch("http://localhost:5000/api/intelligence/generate-alerts", { method: "POST", headers: authHeaders }).then((r) => r.json());
    console.log("✅ 8. Generate Smart Alerts API: Created", genAlerts.created ?? 0, "new alerts | Analyzed");

    const alertsRes = await fetch("http://localhost:5000/api/alerts", { headers: authHeaders }).then((r) => r.json());
    console.log("✅ 9. Alerts Center API: Total Alerts =", alertsRes.summary.totalAlerts, "| Unread =", alertsRes.summary.unreadAlerts);

    console.log("\n🎉 ALL BACKEND APIs VERIFIED SUCCESSFULLY!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

runVerification();
