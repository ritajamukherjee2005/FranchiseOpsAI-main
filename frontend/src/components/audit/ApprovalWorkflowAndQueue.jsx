import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck, ShieldCheck, CheckCircle2, XCircle, Clock,
  MessageSquare, ChevronRight, AlertTriangle, Sparkles, Filter,
  Building2, ArrowRight, User, Check, X, RotateCcw
} from "lucide-react";

const initialWorkflowStages = [
  {
    id: "stage-1",
    name: "Auditor Review",
    responsible: "Dr. A. Verma (Lead Auditor)",
    status: "Approved",
    date: "Aug 11, 2026",
    comments: "All physical inventory sampling and digital POS cross-checks verified."
  },
  {
    id: "stage-2",
    name: "Supervisor Review",
    responsible: "K. Gupta (Regional Supervisor)",
    status: "Approved",
    date: "Aug 12, 2026",
    comments: "Inventory discrepancy variance acknowledged with store manager write-off."
  },
  {
    id: "stage-3",
    name: "Manager Approval",
    responsible: "S. Nair (General Manager)",
    status: "In Review",
    date: "Aug 13, 2026",
    comments: "Awaiting updated fire safety license renewal slip before final GM signoff."
  },
  {
    id: "stage-4",
    name: "Final Approval",
    responsible: "V. Patel (VP Compliance)",
    status: "Pending",
    date: "Target: Aug 15, 2026",
    comments: "Awaiting prior level authorizations."
  }
];

const initialApprovalQueue = [
  {
    id: "AUD-2026-101",
    outlet: "Connaught Place",
    riskScore: "78/100 (High Risk)",
    verificationScore: 68,
    approvalScore: 62,
    pendingSince: "2 days ago",
    requiredAction: "Manager Approval Required",
    category: "Inventory Shrinkage"
  },
  {
    id: "AUD-2026-103",
    outlet: "Salt Lake Sector V",
    riskScore: "84/100 (Critical)",
    verificationScore: 54,
    approvalScore: 48,
    pendingSince: "3 days ago",
    requiredAction: "Fire NOC Review",
    category: "Safety NOC"
  },
  {
    id: "AUD-2026-105",
    outlet: "Hazratganj",
    riskScore: "71/100 (High Risk)",
    verificationScore: 71,
    approvalScore: 65,
    pendingSince: "1 day ago",
    requiredAction: "Cash Drawer Audit Review",
    category: "Financial Compliance"
  },
  {
    id: "AUD-2026-107",
    outlet: "Viman Nagar",
    riskScore: "82/100 (Critical)",
    verificationScore: 42,
    approvalScore: 38,
    pendingSince: "4 days ago",
    requiredAction: "Staff Biometric Log Review",
    category: "Staff Attendance"
  }
];

export default function ApprovalWorkflowAndQueue({ triggerToast }) {
  const [stages, setStages] = useState(initialWorkflowStages);
  const [queue, setQueue] = useState(initialApprovalQueue);
  const [activeQueueCount, setActiveQueueCount] = useState(12);
  const [modalStage, setModalStage] = useState(null);
  const [modalComment, setModalComment] = useState("");
  const [actionType, setActionType] = useState("Approve");

  const handleStageAction = (stageId, newStatus) => {
    setStages((prev) =>
      prev.map((s) =>
        s.id === stageId
          ? {
              ...s,
              status: newStatus,
              date: "Aug 13, 2026 (Just now)",
              comments: modalComment || `Stage updated to ${newStatus} by user.`
            }
          : s
      )
    );
    if (triggerToast) triggerToast(`Workflow stage updated: ${newStatus}`);
    setModalStage(null);
    setModalComment("");
  };

  const handleQueueAction = (auditId, action) => {
    setQueue((prev) => prev.filter((q) => q.id !== auditId));
    setActiveQueueCount((prev) => Math.max(0, prev - 1));
    if (triggerToast) triggerToast(`Audit ${auditId} status updated: ${action}`);
  };

  const getStatusStyle = (status) => {
    const styles = {
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
      "In Review": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400",
      Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
      Rejected: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400"
    };
    return styles[status] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* ==================================================== */}
      {/* FEATURE 4: MULTI-LEVEL APPROVAL WORKFLOW             */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                FEATURE 4 · MULTI-LEVEL GOVERNANCE
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="text-blue-600 dark:text-blue-400" size={20} /> Multi-Level Approval Workflow
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                4-tier authorization chain for official audit completion.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400">
              Current Stage: Manager Approval
            </span>
          </div>

          {/* Stepper Chain Visualization */}
          <div className="grid grid-cols-4 gap-2 mb-6 text-center">
            {stages.map((stg, idx) => (
              <div key={stg.id} className="relative">
                <div
                  className={`p-2.5 rounded-xl border transition-all text-xs ${stg.status === "Approved" ? "bg-emerald-50/80 text-emerald-900 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 font-semibold" : stg.status === "In Review" ? "bg-blue-50 text-blue-900 border-blue-400 dark:bg-blue-500/20 dark:text-blue-300 font-bold ring-2 ring-blue-500/30" : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 border-slate-200 dark:border-slate-800"}`}
                >
                  <span className="text-[10px] uppercase block opacity-75 font-mono">Stage 0{idx + 1}</span>
                  <span className="text-[11px] truncate block font-bold">{stg.name}</span>
                </div>
                {idx < stages.length - 1 && (
                  <ChevronRight size={14} className="absolute -right-2 top-1/2 -translate-y-1/2 text-slate-400 z-10 hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* Detailed Stage Cards */}
          <div className="space-y-3">
            {stages.map((stg) => (
              <div
                key={stg.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{stg.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(stg.status)}`}>
                      {stg.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{stg.date}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Responsible: <strong className="text-slate-900 dark:text-white">{stg.responsible}</strong></span>
                  {stg.status === "In Review" && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setModalStage(stg);
                          setActionType("Approve");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setModalStage(stg);
                          setActionType("Reject");
                        }}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-400 font-semibold text-[10px]"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setModalStage(stg);
                          setActionType("Request Changes");
                        }}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[10px]"
                      >
                        Request Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                  <MessageSquare size={12} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Comments: "{stg.comments}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 9: AUDIT APPROVAL QUEUE                     */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                FEATURE 9 · APPROVAL QUEUE
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="text-rose-600 dark:text-rose-400" size={20} /> Approval Queue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Audits awaiting manager review and sign-off authorization.
              </p>
            </div>

            {/* Counter Badge as explicitly requested */}
            <span className="px-3 py-1.5 rounded-xl font-extrabold text-xs bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-xs">
              {activeQueueCount} Audits Awaiting Approval
            </span>
          </div>

          {/* Queue Cards Grid */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {queue.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                All audits in queue have been processed!
              </div>
            ) : (
              queue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                          {item.id}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {item.outlet}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Category: <strong className="text-slate-700 dark:text-slate-200">{item.category}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                        {item.riskScore}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Pending: {item.pendingSince}</p>
                    </div>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Verification</span>
                      <strong className="text-slate-900 dark:text-white">{item.verificationScore}%</strong>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Approval Score</span>
                      <strong className="text-blue-600 dark:text-blue-400">{item.approvalScore}%</strong>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Req. Action</span>
                      <strong className="text-amber-600 dark:text-amber-400 truncate block">{item.requiredAction}</strong>
                    </div>
                  </div>

                  {/* Action Buttons: Review, Approve, Reject, Request Changes */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleQueueAction(item.id, "Reviewed")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleQueueAction(item.id, "Approved")}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleQueueAction(item.id, "Rejected")}
                      className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-400 text-[10px] font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleQueueAction(item.id, "Requested Changes")}
                      className="px-2.5 py-1 rounded-lg border border-amber-200 text-amber-600 dark:border-amber-500/30 dark:text-amber-400 text-[10px] font-semibold"
                    >
                      Request Changes
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ACTION COMMENT MODAL FOR WORKFLOW STAGES */}
      <AnimatePresence>
        {modalStage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {actionType} — Stage: {modalStage.name}
                </h3>
                <button onClick={() => setModalStage(null)} className="text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                  Authorization Comments & Notes:
                </label>
                <textarea
                  rows={3}
                  value={modalComment}
                  onChange={(e) => setModalComment(e.target.value)}
                  placeholder={`Provide details for ${actionType.toLowerCase()} action...`}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setModalStage(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStageAction(modalStage.id, actionType === "Approve" ? "Approved" : actionType === "Reject" ? "Rejected" : "Needs Revision")}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold shadow-xs"
                >
                  Confirm {actionType}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
