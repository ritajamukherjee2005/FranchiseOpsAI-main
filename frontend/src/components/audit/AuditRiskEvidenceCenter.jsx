import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  ShieldAlert, ShieldCheck, AlertTriangle, FileCheck, CheckCircle2,
  XCircle, Clock, Activity, Sliders, Search, FileText, Zap,
  TrendingUp, Layers, Eye, RefreshCw, FileDown, Plus, Play,
  TrendingDown, Check, ArrowRight, AlertCircle, FileSpreadsheet,
  Building2, Sparkles, Filter, CheckSquare, HelpCircle, X,
  BadgeCheck, Info, ChevronRight, UserCheck, Calculator, ArrowUpRight
} from "lucide-react";

/* IMPORT NEW ENTERPRISE GOVERNANCE & COMPLIANCE COMPONENTS */
import AuditVerificationCenter from "./AuditVerificationCenter";
import AuditScoresAndDecision from "./AuditScoresAndDecision";
import ApprovalWorkflowAndQueue from "./ApprovalWorkflowAndQueue";
import EvidenceAndExpiryTracker from "./EvidenceAndExpiryTracker";
import FindingsAndCorrectiveActions from "./FindingsAndCorrectiveActions";
import ScorecardAndHistory from "./ScorecardAndHistory";
import TimelineAndNotifications from "./TimelineAndNotifications";
import AuditQuickActionsBar from "./AuditQuickActionsBar";

/* ------------------------------------------------------------------ */
/* DUMMY DATA FOR AI AUDIT RISK & EVIDENCE CENTER                      */
/* ------------------------------------------------------------------ */

const riskBreakdown = [
  { category: "Hygiene Risk", score: 68, level: "HIGH", color: "#f43f5e" },
  { category: "Financial Risk", score: 74, level: "HIGH", color: "#f97316" },
  { category: "Inventory Risk", score: 82, level: "HIGH", color: "#eab308" },
  { category: "Staff Compliance Risk", score: 71, level: "HIGH", color: "#f97316" },
  { category: "Safety Risk", score: 45, level: "LOW", color: "#10b981" },
  { category: "Documentation Risk", score: 79, level: "HIGH", color: "#f43f5e" },
  { category: "Operational Risk", score: 65, level: "MEDIUM", color: "#3b82f6" },
];

const predictiveAlerts = [
  {
    id: 1,
    title: "Inventory records show unusual discrepancies.",
    outlet: "Connaught Place",
    riskLevel: "High",
    confidence: 92,
    impact: "Estimated ₹1.4L stock shrinkage",
    action: "Perform physical stock count immediately and freeze manual adjustments.",
    category: "Inventory"
  },
  {
    id: 2,
    title: "Staff attendance compliance is declining.",
    outlet: "Bandra West",
    riskLevel: "Medium",
    confidence: 88,
    impact: "Peak hour service delays & customer satisfaction drop",
    action: "Audit shift biometric logs and reassign supervisor shift rosters.",
    category: "Staff"
  },
  {
    id: 3,
    title: "Required safety documents may expire within 15 days.",
    outlet: "Salt Lake Sector V",
    riskLevel: "High",
    confidence: 95,
    impact: "Regulatory penalty risk & temporary suspension warning",
    action: "Re-upload renewed Fire Safety Certificate & NOC copy.",
    category: "Documentation"
  },
  {
    id: 4,
    title: "Cash transactions are higher than historical average.",
    outlet: "Hazratganj",
    riskLevel: "Medium",
    confidence: 84,
    impact: "Potential unrecorded register adjustments & cash audit audit flag",
    action: "Reconcile daily POS drawer reports with bank deposit receipts.",
    category: "Financial"
  },
  {
    id: 5,
    title: "Outlet hygiene score has decreased for 3 consecutive weeks.",
    outlet: "C-Scheme",
    riskLevel: "High",
    confidence: 91,
    impact: "Audit failure risk on food safety standards",
    action: "Schedule emergency deep-cleaning audit & kitchen checklist inspection.",
    category: "Hygiene"
  },
  {
    id: 6,
    title: "Product wastage is above the normal threshold.",
    outlet: "Viman Nagar",
    riskLevel: "Medium",
    confidence: 86,
    impact: "4.2% direct margin erosion on raw ingredient inventory",
    action: "Enforce FIFO batch usage and recalibrate daily prep batch sizes.",
    category: "Inventory"
  }
];

const anomalyChartData = [
  { day: "Aug 01", salesSpike: 12, inventoryLoss: 8, refundAnomaly: 4 },
  { day: "Aug 02", salesSpike: 15, inventoryLoss: 10, refundAnomaly: 5 },
  { day: "Aug 03", salesSpike: 18, inventoryLoss: 9, refundAnomaly: 7 },
  { day: "Aug 04", salesSpike: 22, inventoryLoss: 14, refundAnomaly: 6 },
  { day: "Aug 05", salesSpike: 19, inventoryLoss: 12, refundAnomaly: 8 },
  { day: "Aug 06", salesSpike: 28, inventoryLoss: 21, refundAnomaly: 15 },
  { day: "Aug 07", salesSpike: 35, inventoryLoss: 29, refundAnomaly: 18 },
  { day: "Aug 08", salesSpike: 42, inventoryLoss: 38, refundAnomaly: 24 },
  { day: "Aug 09", salesSpike: 48, inventoryLoss: 44, refundAnomaly: 31 },
  { day: "Aug 10", salesSpike: 52, inventoryLoss: 41, refundAnomaly: 28 },
];

const anomalyList = [
  {
    id: "ANO-01",
    type: "Sudden sales increase",
    outlet: "Bandra West",
    severity: "High",
    detectedDate: "Aug 09, 2026",
    confidence: 94,
    status: "Investigating",
    details: "+45% late-night transaction surge without corresponding inventory reduction."
  },
  {
    id: "ANO-02",
    type: "Unusual inventory loss",
    outlet: "Connaught Place",
    severity: "Critical",
    detectedDate: "Aug 08, 2026",
    confidence: 96,
    status: "Open",
    details: "14kg premium cheese & protein stock unaccounted during shift handover."
  },
  {
    id: "ANO-03",
    type: "Repeated stock adjustments",
    outlet: "Salt Lake Sector V",
    severity: "High",
    detectedDate: "Aug 07, 2026",
    confidence: 89,
    status: "Investigating",
    details: "7 manual inventory quantity adjustments submitted within 48 hours."
  },
  {
    id: "ANO-04",
    type: "Abnormal refund activity",
    outlet: "Hazratganj",
    severity: "High",
    detectedDate: "Aug 09, 2026",
    confidence: 92,
    status: "Open",
    details: "18 cash refunds authorized on same terminal without customer bills attached."
  },
  {
    id: "ANO-05",
    type: "Unusual employee attendance",
    outlet: "Viman Nagar",
    severity: "Medium",
    detectedDate: "Aug 06, 2026",
    confidence: 87,
    status: "Resolved",
    details: "3 staff members clocked in simultaneously from remote IP coordinates."
  },
  {
    id: "ANO-06",
    type: "Unexpected expense increase",
    outlet: "C-Scheme",
    severity: "Medium",
    detectedDate: "Aug 08, 2026",
    confidence: 85,
    status: "Investigating",
    details: "+38% petty cash maintenance claim logged without vendor invoice."
  }
];

const heatmapOutlets = [
  { name: "Outlet 01 — Anna Nagar", safety: 92, hygiene: 88, inventory: 85, finance: 90, staff: 94, documentation: 91, overallRisk: "Low" },
  { name: "Outlet 02 — Indiranagar", safety: 95, hygiene: 92, inventory: 89, finance: 94, staff: 91, documentation: 96, overallRisk: "Low" },
  { name: "Outlet 03 — Connaught Place", safety: 62, hygiene: 58, inventory: 42, finance: 51, staff: 65, documentation: 55, overallRisk: "Critical" },
  { name: "Outlet 04 — Salt Lake", safety: 54, hygiene: 61, inventory: 58, finance: 48, staff: 59, documentation: 44, overallRisk: "Critical" },
  { name: "Outlet 05 — Bandra West", safety: 78, hygiene: 72, inventory: 66, finance: 79, staff: 70, documentation: 75, overallRisk: "Medium" }
];

const failedAuditItems = [
  {
    id: "FAIL-01",
    title: "High Inventory Variance",
    outlet: "Connaught Place",
    problem: "High Inventory Variance",
    cause: "Repeated manual stock adjustments and untracked wastage during evening peak hours.",
    evidence: "EVD-102 (Unsigned adjustment logs) & 14kg unaccounted raw material gap.",
    impact: "Potential revenue leakage & inaccurate COGS reporting.",
    confidence: 94,
    solution: "Perform immediate physical stock verification, freeze manual manager overrides, and enable dual-signoff on waste logs."
  },
  {
    id: "FAIL-02",
    title: "Expired Fire Safety Certificate",
    outlet: "Salt Lake Sector V",
    problem: "Expired Fire Safety NOC",
    cause: "Renewal application delayed at municipal office past 30-day grace period.",
    evidence: "EVD-103 document timestamp expired July 31, 2026.",
    impact: "High risk of statutory notice, insurance invalidate hazard, and audit compliance failure.",
    confidence: 98,
    solution: "Escalate renewal receipt to Municipal Authority and submit temporary acknowledgment slip."
  },
  {
    id: "FAIL-03",
    title: "Unverified Cash Drawer Refunds",
    outlet: "Hazratganj",
    problem: "Abnormal Cash Refund Pattern",
    cause: "Cashier override key left unattended near register during shift changes.",
    evidence: "ANO-04 (18 cash refunds processed without bill receipts).",
    impact: "Direct cash drawer discrepancy & internal shrinkage risk.",
    confidence: 92,
    solution: "Revoke terminal manager override key, mandate customer phone OTP for cash refunds above ₹500."
  },
  {
    id: "FAIL-04",
    title: "Hygiene Temperature Log Gaps",
    outlet: "Bandra West",
    problem: "Incomplete Cold-Chain Logs",
    cause: "Staff skipped mandatory digital chiller temperature logging during weekend rush.",
    evidence: "EVD-105 missing 3 consecutive temperature entries.",
    impact: "Food safety non-compliance & risk of stock spoilage.",
    confidence: 88,
    solution: "Install automated IoT Bluetooth temp sensors in cold storage units."
  }
];

const recommendations = [
  {
    id: "REC-1",
    priority: "Critical",
    color: "rose",
    badgeBg: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
    dotColor: "bg-rose-500",
    text: "Verify expired safety certificates at Salt Lake Sector V & Hazratganj.",
    impact: "Eliminates legal penalty & prevents 15-pt audit penalty",
    confidence: 98,
    action: "Verify Certificate"
  },
  {
    id: "REC-2",
    priority: "High",
    color: "amber",
    badgeBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    dotColor: "bg-amber-500",
    text: "Investigate inventory discrepancies and manual stock adjustments at Connaught Place.",
    impact: "Saves ₹1.4L monthly shrinkage leakage",
    confidence: 94,
    action: "Audit Stock"
  },
  {
    id: "REC-3",
    priority: "Medium",
    color: "yellow",
    badgeBg: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
    dotColor: "bg-yellow-500",
    text: "Improve staff attendance compliance & shift logging at Bandra West.",
    impact: "Increases peak shift efficiency by 18%",
    confidence: 89,
    action: "Review Rosters"
  },
  {
    id: "REC-4",
    priority: "Low",
    color: "emerald",
    badgeBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    dotColor: "bg-emerald-500",
    text: "Update outlet food safety license documentation for Vesu outlet.",
    impact: "Maintains 100% compliance record",
    confidence: 95,
    action: "Update Docs"
  }
];

/* ------------------------------------------------------------------ */
/* HELPER COMPONENTS                                                  */
/* ------------------------------------------------------------------ */

function GlassCard({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, rightElement }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
      <div>
        {eyebrow && <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1"><Sparkles size={11} /> {eyebrow}</span>}
        <h2 className="font-semibold text-slate-900 dark:text-white text-lg tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}

function ProgressBar({ pct, color = "from-blue-500 to-purple-500" }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    "Needs Review": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Missing: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    Expired: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    Suspicious: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    Open: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
    Investigating: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
    Resolved: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT: ENHANCED ENTERPRISE AUDIT AGENT                     */
/* ------------------------------------------------------------------ */

export default function AuditRiskEvidenceCenter() {
  /* State for Root-Cause Analysis Modal */
  const [selectedRootCause, setSelectedRootCause] = useState(failedAuditItems[0]);
  const [showRootCauseModal, setShowRootCauseModal] = useState(false);

  /* State for What-If Simulator */
  const [simInventory, setSimInventory] = useState(72);
  const [simStaff, setSimStaff] = useState(84);
  const [simDoc, setSimDoc] = useState(88);
  const [simSafety, setSimSafety] = useState(90);
  const [simHygiene, setSimHygiene] = useState(70);

  /* Active Section Tracker for Stepper Navigation */
  const [activeSection, setActiveSection] = useState("audit-center");

  /* Toast Notification */
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* What-If Simulator Calculation */
  const simulationResult = useMemo(() => {
    const weightedCompliance =
      simInventory * 0.25 +
      simStaff * 0.20 +
      simDoc * 0.20 +
      simSafety * 0.15 +
      simHygiene * 0.20;

    const riskScore = Math.round(100 - weightedCompliance);
    const readinessScore = Math.round(weightedCompliance * 0.95 + 3);
    const expectedViolations = Math.max(0, Math.round((riskScore - 20) / 15));

    let riskLevel = "LOW";
    let outcome = "PASS";
    let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400";

    if (riskScore >= 70) {
      riskLevel = "HIGH";
      outcome = "HIGH RISK";
      badgeClass = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400";
    } else if (riskScore >= 45) {
      riskLevel = "MEDIUM";
      outcome = "NEEDS ATTENTION";
      badgeClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400";
    }

    return { riskScore, readinessScore, expectedViolations, riskLevel, outcome, badgeClass };
  }, [simInventory, simStaff, simDoc, simSafety, simHygiene]);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification Floating Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs font-medium"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* HEADER & QUICK ACTIONS BAR                           */}
      {/* ==================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <ShieldCheck size={16} /> ENTERPRISE AUDIT & COMPLIANCE GOVERNANCE SYSTEM
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Audit Agent & Compliance Hub
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-4xl">
            Enterprise verification, multi-level approval workflows, document expiry tracking, audit readiness scoring, and corrective action management across 16 franchise outlets.
          </p>
        </div>

        {/* TOP QUICK ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerToast("New AI Audit initiated across 16 franchise outlets.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-500/25"
          >
            <Play size={14} /> Start New Audit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedRootCause(failedAuditItems[0]);
              setShowRootCauseModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
          >
            <ShieldAlert size={14} /> Review High-Risk Outlet
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerToast("Running full evidence AI verification scan...")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200"
          >
            <FileCheck size={14} /> Verify Evidence
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerToast("Generating full AI Compliance & Audit Report (PDF/Excel)...")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200"
          >
            <FileText size={14} /> Generate Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerToast("Corrective Action Task matrix sent to store managers.")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200"
          >
            <Plus size={14} /> Create Action
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerToast("AI Risk Prediction Model updated with live telemetry.")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300"
            title="Run AI Risk Analysis"
          >
            <RefreshCw size={14} />
          </motion.button>
        </div>
      </motion.div>

      {/* FEATURE 16 & STEPPER: VISUAL ENTERPRISE WORKFLOW STEPPER */}
      <AuditQuickActionsBar
        triggerToast={triggerToast}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      {/* ==================================================== */}
      {/* FEATURE 1: AUDIT VERIFICATION CENTER                 */}
      {/* ==================================================== */}
      <section id="audit-center">
        <AuditVerificationCenter triggerToast={triggerToast} />
      </section>

      {/* ==================================================== */}
      {/* FEATURE 2, 3, 12, 15: AUDIT SCORES & DECISION SUMMARY */}
      {/* ==================================================== */}
      <section id="scores-decision" className="space-y-6">
        <AuditScoresAndDecision triggerToast={triggerToast} />
      </section>

      {/* ==================================================== */}
      {/* ORIGINAL SECTION: NETWORK PREDICTIVE RISK SCORE CARD */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7"
        >
          <GlassCard className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-rose-600 dark:text-rose-400 uppercase flex items-center gap-1">
                  <ShieldAlert size={13} /> NETWORK PREDICTIVE RISK SCORE
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">Audit Risk Score</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                  Risk Level: HIGH
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> Updated 5m ago
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-6">
              <div className="sm:col-span-1 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-500/10 dark:to-orange-500/10 border border-rose-100 dark:border-rose-500/20 p-5 text-center">
                <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Overall Risk Score</p>
                <div className="flex items-baseline justify-center gap-1 my-1">
                  <span className="text-5xl font-black text-rose-600 dark:text-rose-400 tracking-tight tabular-nums">78</span>
                  <span className="text-lg font-bold text-slate-500 dark:text-slate-400">/100</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  <TrendingUp size={12} /> +6 pts risk vs last audit
                </span>
              </div>

              <div className="sm:col-span-2 space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                  <Sparkles size={14} className="text-amber-500" /> AI Executive Risk Diagnostics
                </div>
                <p>
                  High risk predicted primarily by <strong className="text-slate-800 dark:text-slate-100">Inventory shrinkage</strong> at Connaught Place and <strong className="text-slate-800 dark:text-slate-100">Documentation expiry</strong> at Salt Lake Sector V.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                    Inventory: 82/100 Risk
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                    Docs: 79/100 Risk
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                    Financial: 74/100 Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category Risk Breakdown</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                {riskBreakdown.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{item.category}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-200">{item.score}%</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${item.level === "HIGH" ? "text-rose-600 bg-rose-50 dark:bg-rose-500/10" : item.level === "MEDIUM" ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"}`}>
                          {item.level}
                        </span>
                      </div>
                    </div>
                    <ProgressBar pct={item.score} color={item.score >= 75 ? "from-rose-500 to-red-600" : item.score >= 60 ? "from-amber-400 to-orange-500" : "from-emerald-400 to-emerald-500"} />
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* SECTION 7: AUDIT READINESS SCORE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="lg:col-span-5"
        >
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <SectionHeading
                eyebrow="Audit Readiness"
                title="Next Audit Readiness"
                subtitle="Predicted network audit pass rate"
              />

              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-5">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Readiness Score</p>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">82%</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                    Target: ≥85% for guaranteed PASS
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">Estimated Outcome</p>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                    NEEDS ATTENTION
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Documentation", score: 90, color: "from-emerald-400 to-emerald-500" },
                  { label: "Inventory Compliance", score: 75, color: "from-amber-400 to-amber-500" },
                  { label: "Staff Attendance", score: 88, color: "from-blue-400 to-blue-500" },
                  { label: "Safety Compliance", score: 92, color: "from-emerald-400 to-emerald-500" },
                  { label: "Hygiene Score", score: 76, color: "from-amber-400 to-amber-500" }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{item.score}%</span>
                    </div>
                    <ProgressBar pct={item.score} color={item.color} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Next Audit Date: <strong className="text-slate-700 dark:text-slate-200">Aug 20, 2026</strong></span>
              <button
                onClick={() => triggerToast("Readiness recalculation requested...")}
                className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
              >
                Recalculate <ChevronRight size={14} />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 4 & 9: MULTI-LEVEL WORKFLOW & APPROVAL QUEUE  */}
      {/* ==================================================== */}
      <section id="workflow-queue">
        <ApprovalWorkflowAndQueue triggerToast={triggerToast} />
      </section>

      {/* ==================================================== */}
      {/* ORIGINAL PREDICTIVE ALERTS                           */}
      {/* ==================================================== */}
      <GlassCard className="p-6">
        <SectionHeading
          eyebrow="Early Warning System"
          title="Predictive Audit Alerts — Potential Issues Before Next Audit"
          subtitle="AI-detected vulnerabilities flagged prior to official inspector visit"
          rightElement={
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
              6 Active Alerts
            </span>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {predictiveAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 bg-white/50 dark:bg-slate-900/40 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${alert.riskLevel === "High" ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20"}`}>
                    {alert.riskLevel} Risk
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                    <Sparkles size={10} /> {alert.confidence}% AI Confidence
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-1">
                  {alert.title}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                  <Building2 size={12} /> {alert.outlet}
                </p>

                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 space-y-1 mb-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-400">
                    Predicted Impact: <strong className="text-rose-600 dark:text-rose-400">{alert.impact}</strong>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Recommended Action: <span className="text-slate-900 dark:text-slate-200 font-medium">{alert.action}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => triggerToast(`Action assigned for: ${alert.title}`)}
                className="w-full py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
              >
                Assign Corrective Task <ArrowRight size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* ==================================================== */}
      {/* FEATURE 5 & 6: EVIDENCE & DOCUMENT EXPIRY TRACKER    */}
      {/* ==================================================== */}
      <section id="evidence-expiry">
        <EvidenceAndExpiryTracker triggerToast={triggerToast} />
      </section>

      {/* ==================================================== */}
      {/* ORIGINAL ANOMALY DETECTION CHART & HEATMAP MATRIX    */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <GlassCard className="xl:col-span-12 p-6 flex flex-col justify-between">
          <div>
            <SectionHeading
              eyebrow="Pattern Analytics"
              title="AI Anomaly Detection & Operational Frequency"
              subtitle="Detecting unusual sales, inventory & expense spikes across outlets"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">10-Day Anomaly Frequency Telemetry</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={anomalyChartData} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "1px solid #334155", color: "#f8fafc", fontSize: "11px" }}
                    />
                    <Area type="monotone" dataKey="salesSpike" name="Sales Spikes" stroke="#3b82f6" fill="url(#salesGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="inventoryLoss" name="Inventory Anomalies" stroke="#f43f5e" fill="url(#invGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-5 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {anomalyList.map((ano) => (
                  <div
                    key={ano.id}
                    className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-xs flex items-center justify-between gap-2 shadow-sm dark:shadow-none"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{ano.type}</span>
                        <span className="text-slate-500 dark:text-slate-400">· {ano.outlet}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[240px]">{ano.details}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge status={ano.status} />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{ano.confidence}% AI confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* HEATMAP MATRIX */}
      <GlassCard className="p-6">
        <SectionHeading
          eyebrow="Network Matrix"
          title="Outlet Compliance Heatmap"
          subtitle="Multi-outlet compliance breakdown across key audit operational pillars"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px] border-separate" style={{ borderSpacing: "6px" }}>
            <thead>
              <tr>
                <th className="text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Outlet</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Safety</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Hygiene</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Inventory</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Finance</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Staff</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Documentation</th>
                <th className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase pb-2">Overall Risk</th>
              </tr>
            </thead>
            <tbody>
              {heatmapOutlets.map((outlet) => {
                const getHeatStyle = (val) => {
                  if (val >= 85) return "bg-emerald-500/80 text-white font-bold";
                  if (val >= 70) return "bg-emerald-100 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold";
                  if (val >= 55) return "bg-amber-100 dark:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-semibold";
                  return "bg-rose-500/85 text-white font-bold";
                };

                return (
                  <tr key={outlet.name}>
                    <td className="font-semibold text-slate-800 dark:text-slate-200 pr-3 whitespace-nowrap">{outlet.name}</td>
                    <td className="text-center"><div className={`py-2 rounded-xl text-xs ${getHeatStyle(outlet.safety)}`}>{outlet.safety}%</div></td>
                    <td className="text-center"><div className={`py-2 rounded-xl text-xs ${getHeatStyle(outlet.hygiene)}`}>{outlet.hygiene}%</div></td>
                    <td className="text-center"><div className={`py-2 rounded-xl text-xs ${getHeatStyle(outlet.inventory)}`}>{outlet.inventory}%</div></td>
                    <td className="text-center"><div className={`py-2 rounded-xl text-xs ${getHeatStyle(outlet.finance)}`}>{outlet.finance}%</div></td>
                    <td className="text-center"><div className={`py-2 rounded-xl text-xs ${getHeatStyle(outlet.staff)}`}>{outlet.staff}%</div></td>
                    <td className="text-center"><div className={`py-2 rounded-xl text-xs ${getHeatStyle(outlet.documentation)}`}>{outlet.documentation}%</div></td>
                    <td className="text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${outlet.overallRisk === "Low" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400" : outlet.overallRisk === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400"}`}>
                        {outlet.overallRisk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ==================================================== */}
      {/* FEATURE 7 & 8: FINDINGS & CORRECTIVE ACTION TRACKER  */}
      {/* ==================================================== */}
      <section id="findings-actions">
        <FindingsAndCorrectiveActions triggerToast={triggerToast} />
      </section>

      {/* ==================================================== */}
      {/* ORIGINAL ROOT CAUSE & WHAT-IF SIMULATOR              */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ORIGINAL ROOT CAUSE */}
        <GlassCard className="xl:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <SectionHeading
              eyebrow="Diagnostic Engine"
              title="AI Root-Cause Analysis"
              subtitle="Select a failed compliance item for immediate automated root cause diagnosis"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {failedAuditItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedRootCause(item)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${selectedRootCause.id === item.id ? "border-blue-500 bg-blue-50 dark:bg-blue-500/15 text-blue-900 dark:text-blue-200 font-semibold shadow-sm" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:border-slate-300"}`}
                >
                  <p className="font-bold text-slate-900 dark:text-white">{item.problem}</p>
                  <p className="text-[11px] opacity-75 mt-0.5 text-slate-600 dark:text-slate-400">{item.outlet}</p>
                </button>
              ))}
            </div>

            {selectedRootCause && (
              <div className="rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800/40 dark:to-blue-500/5 border border-slate-200 dark:border-slate-800 p-4 space-y-3 text-xs shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Problem: {selectedRootCause.problem}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-transparent">
                    {selectedRootCause.confidence}% AI Confidence
                  </span>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Possible Cause:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{selectedRootCause.cause}</p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Supporting Evidence:</p>
                  <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] bg-slate-50 dark:bg-slate-900/60 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                    {selectedRootCause.evidence}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Business Impact:</p>
                  <p className="font-semibold text-rose-600 dark:text-rose-400">{selectedRootCause.impact}</p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Recommended Solution:</p>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedRootCause.solution}</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* ORIGINAL WHAT-IF SIMULATOR */}
        <GlassCard className="xl:col-span-6 p-6 flex flex-col justify-between">
          <div>
            <SectionHeading
              eyebrow="Interactive Simulation"
              title="AI Audit What-If Simulator"
              subtitle="Dynamically adjust outlet conditions to predict risk, violations & readiness"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Inventory Compliance</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400">{simInventory}%</span>
                  </div>
                  <input
                    type="range" min="30" max="100" value={simInventory}
                    onChange={(e) => setSimInventory(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Staff Attendance</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400">{simStaff}%</span>
                  </div>
                  <input
                    type="range" min="30" max="100" value={simStaff}
                    onChange={(e) => setSimStaff(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Documentation</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400">{simDoc}%</span>
                  </div>
                  <input
                    type="range" min="30" max="100" value={simDoc}
                    onChange={(e) => setSimDoc(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Safety Compliance</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400">{simSafety}%</span>
                  </div>
                  <input
                    type="range" min="30" max="100" value={simSafety}
                    onChange={(e) => setSimSafety(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Hygiene Score</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400">{simHygiene}%</span>
                  </div>
                  <input
                    type="range" min="30" max="100" value={simHygiene}
                    onChange={(e) => setSimHygiene(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 flex flex-col justify-between space-y-3 shadow-md dark:shadow-none">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Calculator size={13} className="text-blue-600 dark:text-blue-400" /> AI Dynamic Output
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${simulationResult.badgeClass}`}>
                    {simulationResult.riskLevel} RISK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-transparent">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Predicted Risk Score</p>
                    <p className="text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">{simulationResult.riskScore}/100</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-transparent">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Expected Violations</p>
                    <p className="text-2xl font-black text-amber-500 dark:text-amber-400 tabular-nums">+{simulationResult.expectedViolations}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl text-center border border-slate-100 dark:border-transparent">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Audit Readiness</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{simulationResult.readinessScore}%</p>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold mt-1">Outcome: {simulationResult.outcome}</p>
                </div>

                <button
                  onClick={() => {
                    setSimInventory(72);
                    setSimStaff(84);
                    setSimDoc(88);
                    setSimSafety(90);
                    setSimHygiene(70);
                  }}
                  className="w-full py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-center"
                >
                  Reset to baseline values
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 10 & 11: SCORECARD & HISTORICAL BENCHMARKING */}
      {/* ==================================================== */}
      <section id="scorecard-history">
        <ScorecardAndHistory triggerToast={triggerToast} />
      </section>

      {/* ==================================================== */}
      {/* ORIGINAL RECOMMENDATIONS                             */}
      {/* ==================================================== */}
      <GlassCard className="p-6">
        <SectionHeading
          eyebrow="Prioritized Actions"
          title="AI Recommendation Center"
          subtitle="Intelligent compliance fixes ranked by business risk impact"
        />

        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm dark:shadow-none"
            >
              <div className="flex items-start gap-3">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${rec.dotColor}`} />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${rec.badgeBg}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{rec.confidence}% AI Confidence</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{rec.text}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Expected Impact: {rec.impact}</p>
                </div>
              </div>

              <button
                onClick={() => triggerToast(`Executed action: ${rec.action}`)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-md shrink-0 self-end sm:self-center"
              >
                {rec.action}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ==================================================== */}
      {/* FEATURE 13 & 14: ACTIVITY TIMELINE & NOTIFICATIONS   */}
      {/* ==================================================== */}
      <section id="timeline-alerts">
        <TimelineAndNotifications triggerToast={triggerToast} />
      </section>

      {/* BOTTOM CONTROL TOOLBAR */}
      <section id="final-decision">
        <AuditQuickActionsBar
          triggerToast={triggerToast}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />
      </section>

      {/* MODAL FOR ROOT CAUSE DETAILS IF OPENED */}
      <AnimatePresence>
        {showRootCauseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={16} className="text-rose-600 dark:text-rose-500" /> High-Risk Outlet Deep Diagnostics
                </span>
                <button onClick={() => setShowRootCauseModal(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Target Outlet:</p>
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedRootCause.outlet}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Identified Problem:</p>
                  <p className="font-semibold text-rose-600 dark:text-rose-500">{selectedRootCause.problem}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Root Cause:</p>
                  <p className="text-slate-800 dark:text-slate-200">{selectedRootCause.cause}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Business Impact:</p>
                  <p className="font-semibold text-amber-600 dark:text-amber-500">{selectedRootCause.impact}</p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Recommended Action Plan:</p>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-500">{selectedRootCause.solution}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => setShowRootCauseModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowRootCauseModal(false);
                    triggerToast(`Action Plan dispatched to ${selectedRootCause.outlet} manager.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  Dispatch Action Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}