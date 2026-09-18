import React from "react";
import { motion } from "framer-motion";
import {
  Play, FileCheck, Search, ShieldCheck, XCircle, RotateCcw,
  FileText, Download, Plus, Sparkles, ChevronRight, Layers, ArrowRight
} from "lucide-react";

export default function AuditQuickActionsBar({ triggerToast, activeSection, scrollToSection }) {
  const workflowSteps = [
    { id: "audit-center", label: "1. AUDIT INIT", subtitle: "Verification Center" },
    { id: "scores-decision", label: "2. EVIDENCE & SCORES", subtitle: "Scores & Decision" },
    { id: "workflow-queue", label: "3. GOVERNANCE", subtitle: "Workflow & Queue" },
    { id: "evidence-expiry", label: "4. EVIDENCE & EXPIRY", subtitle: "Docs & Expiry" },
    { id: "findings-actions", label: "5. FINDINGS & CAP", subtitle: "Findings & Actions" },
    { id: "scorecard-history", label: "6. SCORECARD", subtitle: "Scorecard & History" },
    { id: "timeline-alerts", label: "7. TIMELINE & ALERTS", subtitle: "Timeline & Alerts" },
    { id: "final-decision", label: "8. FINAL DECISION", subtitle: "Signoff & Summary" }
  ];

  return (
    <div className="space-y-4">
      {/* VISUAL 8-STAGE ENTERPRISE WORKFLOW STEPPER */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-3 shadow-md">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1">
            <Sparkles size={11} /> ENTERPRISE AUDIT LIFECYCLE WORKFLOW
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Click step to jump to section</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {workflowSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => scrollToSection && scrollToSection(step.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${activeSection === step.id ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-md shadow-blue-500/25 font-bold" : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"}`}
            >
              <div className="text-[10px] font-extrabold tracking-wider uppercase opacity-80">{step.label}</div>
              <div className="text-[11px] truncate font-bold">{step.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* FEATURE 16: FINAL AUDIT QUICK ACTIONS TOOLBAR */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enterprise Audit Control Toolbar</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Execute quick audit governance and verification operations</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => triggerToast("Initiated network-wide AI Audit scan.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-md shadow-blue-500/20"
          >
            <Play size={13} /> Start Audit
          </button>
          <button
            onClick={() => triggerToast("Running full OCR evidence verification...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold shadow-xs"
          >
            <FileCheck size={13} /> Verify Evidence
          </button>
          <button
            onClick={() => triggerToast("Opening findings matrix...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold transition-colors"
          >
            <Search size={13} /> Review Findings
          </button>
          <button
            onClick={() => triggerToast("Audit approved with executive sign-off.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold shadow-xs"
          >
            <ShieldCheck size={13} /> Approve Audit
          </button>
          <button
            onClick={() => triggerToast("Audit rejected. Return to store manager for fixes.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold"
          >
            <XCircle size={13} /> Reject Audit
          </button>
          <button
            onClick={() => triggerToast("Changes requested from store leads.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold"
          >
            <RotateCcw size={13} /> Request Changes
          </button>
          <button
            onClick={() => triggerToast("Generating board-ready Audit PDF Report...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
          >
            <FileText size={13} /> Generate Report
          </button>
          <button
            onClick={() => triggerToast("Exporting audit raw telemetry to Excel/CSV...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
          >
            <Download size={13} /> Export Audit
          </button>
          <button
            onClick={() => triggerToast("Corrective Action task created.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold"
          >
            <Plus size={13} /> Assign Action
          </button>
        </div>
      </div>
    </div>
  );
}