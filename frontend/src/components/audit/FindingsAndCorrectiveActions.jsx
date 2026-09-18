import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, ShieldAlert, User, Calendar,
  RefreshCw, CheckSquare, Sparkles, Filter, ChevronRight, X,
  ArrowRight, ShieldCheck, Clock
} from "lucide-react";

const initialFindings = [
  {
    id: "FND-801",
    issue: "Unexplained High Inventory Shrinkage (14kg raw cheese)",
    severity: "Critical",
    outlet: "Connaught Place",
    assignedTo: "Rajesh K. (Store Mgr)",
    dueDate: "Aug 16, 2026",
    status: "In Progress",
    resolution: "Dual-signoff wastage log enforced; physical recount under supervisor audit."
  },
  {
    id: "FND-802",
    issue: "Expired Fire Safety NOC Renewal Grace Period Passed",
    severity: "Critical",
    outlet: "Salt Lake Sector V",
    assignedTo: "Anita S. (Compliance Officer)",
    dueDate: "Aug 15, 2026",
    status: "Assigned",
    resolution: "Application submitted to Municipal Authority; awaiting physical inspection slip."
  },
  {
    id: "FND-803",
    issue: "Cash Drawer Refunds Executed Without POS Receipts",
    severity: "High",
    outlet: "Hazratganj",
    assignedTo: "Manoj T. (Shift Lead)",
    dueDate: "Aug 18, 2026",
    status: "Open",
    resolution: "Mandated customer phone OTP authentication for cash refunds above ₹500."
  },
  {
    id: "FND-804",
    issue: "Missing Cold-Chain Digital Temperature Entries",
    severity: "Medium",
    outlet: "Bandra West",
    assignedTo: "Suresh P. (Kitchen Lead)",
    dueDate: "Aug 20, 2026",
    status: "Resolved",
    resolution: "Automated IoT Bluetooth temperature monitoring sensor installed."
  },
  {
    id: "FND-805",
    issue: "Biometric Shift Login Location Discrepancy",
    severity: "Medium",
    outlet: "Viman Nagar",
    assignedTo: "Priya M. (HR Specialist)",
    dueDate: "Aug 22, 2026",
    status: "Verified",
    resolution: "IP whitelist restriction added to employee shift login portal."
  }
];

const initialActionPlans = [
  {
    id: "CAP-01",
    issue: "Raw Material COGS Leakage",
    rootCause: "Untracked manual inventory adjustments during evening peak hours.",
    action: "Implement strict POS barcode batch scans and daily manager signoff on waste logs.",
    responsible: "Rajesh Kumar",
    deadline: "Aug 18, 2026",
    progress: 75,
    verificationStatus: "In Review"
  },
  {
    id: "CAP-02",
    issue: "Statutory License Compliance Deficit",
    rootCause: "Renewal application delayed past 30-day municipal grace period.",
    action: "Submit fast-track expediter application and upload provisional municipal receipt.",
    responsible: "Anita Sen",
    deadline: "Aug 15, 2026",
    progress: 50,
    verificationStatus: "Pending Verification"
  },
  {
    id: "CAP-03",
    issue: "Register Cash Discrepancy Risk",
    rootCause: "Unrestricted supervisor override key shared with shift cashiers.",
    action: "Revoke key overrides; enforce biometric approval for drawer cash reconciliations.",
    responsible: "Manoj Tiwari",
    deadline: "Aug 20, 2026",
    progress: 25,
    verificationStatus: "In Progress"
  },
  {
    id: "CAP-04",
    issue: "Kitchen Food Safety Temperature Logging Gap",
    rootCause: "Manual paper logbooks omitted during peak weekend meal rushes.",
    action: "Deploy automated IoT cold-storage sensors synced to central dashboard.",
    responsible: "Suresh Patil",
    deadline: "Aug 12, 2026",
    progress: 100,
    verificationStatus: "Verified"
  }
];

export default function FindingsAndCorrectiveActions({ triggerToast }) {
  const [findings, setFindings] = useState(initialFindings);
  const [actionPlans, setActionPlans] = useState(initialActionPlans);
  const [assignModalFinding, setAssignModalFinding] = useState(null);
  const [assigneeInput, setAssigneeInput] = useState("");

  const handleUpdateFindingStatus = (id, newStatus) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (triggerToast) triggerToast(`Finding ${id} status updated to: ${newStatus}`);
  };

  const handleAssignFinding = () => {
    if (!assignModalFinding) return;
    setFindings((prev) =>
      prev.map((f) =>
        f.id === assignModalFinding.id
          ? { ...f, assignedTo: assigneeInput || f.assignedTo, status: "Assigned" }
          : f
      )
    );
    if (triggerToast) triggerToast(`Finding ${assignModalFinding.id} assigned to ${assigneeInput}`);
    setAssignModalFinding(null);
    setAssigneeInput("");
  };

  const handleAdvanceProgress = (capId) => {
    setActionPlans((prev) =>
      prev.map((c) => {
        if (c.id === capId) {
          const nextProg = c.progress >= 100 ? 100 : c.progress + 25;
          const nextVer = nextProg === 100 ? "Verified" : "In Progress";
          return { ...c, progress: nextProg, verificationStatus: nextVer };
        }
        return c;
      })
    );
    if (triggerToast) triggerToast(`CAP progress updated for ${capId}`);
  };

  const getSeverityBadge = (sev) => {
    const styles = {
      Critical: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
      High: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400",
      Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[sev] || "bg-slate-100"}`}>
        {sev}
      </span>
    );
  };

  const getFindingStatusBadge = (st) => {
    const styles = {
      Open: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
      Assigned: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400",
      "In Progress": "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
      Resolved: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400",
      Verified: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[st] || "bg-slate-100"}`}>
        {st}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* ==================================================== */}
      {/* FEATURE 7: AUDIT FINDINGS & RESOLUTION               */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                FEATURE 7 · ISSUE RESOLUTION
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="text-rose-500" size={20} /> Audit Findings & Resolution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tracks specific audit violations, responsible assignees, and resolution progress.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {findings.map((fnd) => (
              <div
                key={fnd.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-2.5 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                      {fnd.id}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{fnd.issue}</span>
                  </div>
                  {getSeverityBadge(fnd.severity)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Outlet</span>
                    <strong className="text-slate-800 dark:text-slate-200">{fnd.outlet}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned To</span>
                    <strong className="text-slate-800 dark:text-slate-200">{fnd.assignedTo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Due Date</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-200">{fnd.dueDate}</strong>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px]">
                  <span className="text-slate-400">Resolution Status Note: </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{fnd.resolution}</span>
                </div>

                {/* Status + Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  {getFindingStatusBadge(fnd.status)}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAssignModalFinding(fnd);
                        setAssigneeInput(fnd.assignedTo);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => handleUpdateFindingStatus(fnd.id, "Resolved")}
                      className="px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-600 dark:border-indigo-500/30 dark:text-indigo-400 text-[10px] font-semibold"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleUpdateFindingStatus(fnd.id, "Verified")}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-xs"
                    >
                      Verify Resolution
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 8: CORRECTIVE ACTION TRACKER                 */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                FEATURE 8 · ACTION PLAN TRACKING
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="text-indigo-500" size={20} /> Corrective Action Plan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Root cause analysis and milestone progress indicators for compliance remediation.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {actionPlans.map((cap) => (
              <div
                key={cap.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-[11px] block">
                      {cap.id}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{cap.issue}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cap.verificationStatus === "Verified" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"}`}>
                    {cap.verificationStatus}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <p className="text-slate-500 dark:text-slate-400">
                    Root Cause: <strong className="text-slate-700 dark:text-slate-300">{cap.rootCause}</strong>
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Corrective Action: <strong className="text-blue-600 dark:text-blue-400">{cap.action}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                  <span>Responsible: <strong className="text-slate-900 dark:text-white">{cap.responsible}</strong></span>
                  <span>Deadline: <strong className="font-mono">{cap.deadline}</strong></span>
                </div>

                {/* Progress Indicators: 25%, 50%, 75%, 100% */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Progress</span>
                    <span className="tabular-nums text-indigo-600 dark:text-indigo-400">{cap.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cap.progress}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${cap.progress === 100 ? "bg-emerald-500" : cap.progress >= 50 ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-amber-500"}`}
                    />
                  </div>
                </div>

                {cap.progress < 100 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleAdvanceProgress(cap.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold shadow-xs hover:bg-indigo-500 transition-colors"
                    >
                      Advance Milestone (+25%)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ASSIGNMENT MODAL */}
      <AnimatePresence>
        {assignModalFinding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Assign Finding {assignModalFinding.id}
                </h3>
                <button onClick={() => setAssignModalFinding(null)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-2">Issue: {assignModalFinding.issue}</p>
                <label className="text-slate-700 dark:text-slate-200 font-semibold block mb-1">
                  Assignee Name / Role:
                </label>
                <input
                  type="text"
                  value={assigneeInput}
                  onChange={(e) => setAssigneeInput(e.target.value)}
                  placeholder="e.g. Rajesh Kumar (Store Mgr)"
                  className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setAssignModalFinding(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignFinding}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold shadow-xs"
                >
                  Save Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
