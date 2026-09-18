import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import marketingRoutes from "./routes/marketing.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import biRoutes from "./routes/bi.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import intelligenceRoutes from "./routes/intelligence.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"], credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", module: "FranchiseOpsAI Backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/audits", auditRoutes);
app.use("/api/bi", biRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/intelligence", intelligenceRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`FranchiseOpsAI API running on http://localhost:${PORT}`);
});
