import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ShieldAlert, Bell, CheckCircle2, AlertTriangle, FileText,
  UserCheck, ShieldCheck, Filter, Sparkles, AlertCircle, ArrowRight,
  Check, X, Zap
} from "lucide-react";

const initialTimelineMilestones = [
  {
    stage: "Audit Created",
    date: "Aug 01, 2026",
    time: "09:00 AM",
    user: "System Auto-Init",
    action: "Quarterly audit #AUD-2026-101 initialized across 16 franchise outlets.",
    icon: Sparkles,
    color: "text-blue-500"
  },
  {
    stage: "Evidence Submitted",
    date: "Aug 05, 2026",
    time: "14:20 PM",
    user: "Outlet Store Managers",
    action: "48 mandatory audit evidence files uploaded (invoices, checklists, licenses).",
    icon: FileText,
    color: "text-indigo-500"
  },
  {
    stage: "Verification Started",
    date: "Aug 07, 2026",
    time: "11:15 AM",
    user: "AI Compliance Engine",
    action: "Automated OCR document scan and POS ledger cross-matching executed.",
    icon: Zap,
    color: "text-purple-500"
  },
  {
    stage: "Issues Identified",
    date: "Aug 08, 2026",
    time: "16:45 PM",
    user: "AI Audit Agent",
    action: "4 critical inventory & safety doc gaps flagged for store manager review.",
    icon: AlertTriangle,
    color: "text-rose-500"
  },
  {
    stage: "Corrective Action Assigned",
    date: "Aug 09, 2026",
    time: "10:30 AM",
    user: "Supervisor K. Gupta",
    action: "Corrective Action Plan matrix dispatched to 3 store leads with 7-day deadlines.",
    icon: CheckCircle2,
    color: "text-amber-500"
  },
  {
    stage: "Auditor Approved",
    date: "Aug 11, 2026",
    time: "15:00 PM",
    user: "Dr. A. Verma (Lead Auditor)",
    action: "Auditor review completed with 92% verification score.",
    icon: UserCheck,
    color: "text-emerald-500"
  },
  {
    stage: "Manager Approved",
    date: "Aug 12, 2026",
    time: "17:10 PM",
    user: "S. Nair (General Manager)",
    action: "Provisional GM signoff granted pending Fire NOC renewal receipt.",
    icon: ShieldCheck,
    color: "text-blue-500"
  },
  {
    stage: "Final Approval",
    date: "Pending",
    time: "Scheduled Aug 15",
    user: "V. Patel (VP Compliance)",
    action: "Final board authorization pending municipal document submission.",
    icon: Clock,
    color: "text-slate-400 font-bold"
  }
];

const initialNotificationAlerts = [
  {
    id: "ALT-01",
    title: "Audit Waiting for Approval",
    details: "Audit #AUD-2026-101 at Connaught Place pending GM sign-off for >48h.",
    priority: "Critical",
    type: "Approval Overdue",
    time: "10m ago"
  },
  {
    id: "ALT-02",
    title: "Document Expired",
    details: "Municipal Fire Safety NOC expired at Salt Lake Sector V outlet.",
    priority: "Critical",
    type: "Document Expired",
    time: "25m ago"
  },
  {
    id: "ALT-03",
    title: "Evidence Missing",
    details: "Cold storage maintenance photo proof missing at Hazratganj.",
    priority: "High",
    type: "Evidence Missing",
    time: "1h ago"
  },
  {
    id: "ALT-04",
    title: "Critical Issue Unresolved",
    details: "14kg cheese stock shrinkage gap open past deadline at Connaught Place.",
    priority: "High",
    type: "Issue Unresolved",
    time: "2h ago"
  },
  {
    id: "ALT-05",
    title: "Verification Failed",
    details: "Kitchen sanitation checklist omitted 3 cold-chain temperature entries.",
    priority: "Medium",
    type: "Verification Failed",
    time: "4h ago"
  },
  {
    id: "ALT-06",
    title: "Corrective Action Overdue",
    details: "Cash refund OTP policy update pending cashier training at Hazratganj.",
    priority: "Low",
    type: "Action Overdue",
    time: "6h ago"
  }
];

export default function TimelineAndNotifications({ triggerToast }) {
  const [timeline, setTimeline] = useState(initialTimelineMilestones);
  const [alerts, setAlerts] = useState(initialNotificationAlerts);
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredAlerts = alerts.filter(
    (a) => priorityFilter === "All" || a.priority === priorityFilter
  );

  const handleAlertAction = (id, action) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (triggerToast) triggerToast(`Notification ${id}: ${action} executed.`);
  };

  const getPriorityBadge = (prio) => {
    const styles = {
      Critical: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
      High: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400",
      Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
      Low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles[prio] || "bg-slate-100"}`}>
        {prio}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* ==================================================== */}
      {/* FEATURE 13: AUDIT ACTIVITY TIMELINE                  */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                FEATURE 13 · ACTIVITY LIFECYCLE
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="text-blue-600 dark:text-blue-400" size={20} /> Audit Activity Timeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Complete audit lifecycle record from creation to final board approval.
              </p>
            </div>
          </div>

          <div className="relative pl-6 space-y-4 max-h-[460px] overflow-y-auto pr-2">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />
            {timeline.map((evt, idx) => {
              const IconComponent = evt.icon;
              return (
                <div key={idx} className="relative flex items-start gap-3 text-xs">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-xs shrink-0">
                    <IconComponent size={12} className={evt.color} />
                  </div>
                  <div className="min-w-0 flex-1 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{evt.stage}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{evt.date} · {evt.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      By: <strong className="text-slate-700 dark:text-slate-300">{evt.user}</strong>
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">{evt.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 14: NOTIFICATION & ESCALATION SYSTEM         */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                FEATURE 14 · NOTIFICATION & ESCALATION
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="text-rose-500" size={20} /> Notification & Escalation Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time priority alerts for missing evidence, expired docs & overdue approvals.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
              {["All", "Critical", "High", "Medium", "Low"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${priorityFilter === p ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                No active notifications for the selected priority.
              </div>
            ) : (
              filteredAlerts.map((alt) => (
                <motion.div
                  key={alt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={15} className={alt.priority === "Critical" ? "text-rose-500 animate-pulse" : "text-amber-500"} />
                      <span className="font-bold text-slate-900 dark:text-white">{alt.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getPriorityBadge(alt.priority)}
                      <span className="text-[10px] text-slate-400 font-mono">{alt.time}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">{alt.details}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono">Category: {alt.type}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAlertAction(alt.id, "Acknowledged")}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleAlertAction(alt.id, "Escalated to GM")}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold shadow-xs hover:bg-rose-500"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
