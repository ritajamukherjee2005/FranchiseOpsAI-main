import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles,
  TrendingUp, Activity, Award, CheckSquare, Clock, ArrowUpRight,
  ShieldAlert, RefreshCw, FileCheck
} from "lucide-react";

export default function AuditScoresAndDecision({ triggerToast }) {
  const [decisionState, setDecisionState] = useState("APPROVED WITH CONDITIONS");

  /* Verification Score Category Breakdown */
  const verificationBreakdown = [
    { name: "Evidence Completeness", pct: 94, color: "from-emerald-400 to-emerald-500" },
    { name: "Document Validity", pct: 88, color: "from-blue-400 to-blue-500" },
    { name: "Compliance Accuracy", pct: 95, color: "from-emerald-400 to-emerald-500" },
    { name: "Auditor Verification", pct: 90, color: "from-purple-400 to-purple-500" },
    { name: "Data Consistency", pct: 93, color: "from-indigo-400 to-indigo-500" },
  ];

  /* Approval Score Factors Breakdown */
  const approvalFactors = [
    { factor: "Verification Completed", weight: "25%", score: 92, status: "Pass" },
    { factor: "Evidence Submitted", weight: "20%", score: 89, status: "Pass" },
    { factor: "Critical Issues Resolved", weight: "20%", score: 80, status: "Needs Review" },
    { factor: "Auditor Review Completed", weight: "15%", score: 100, status: "Pass" },
    { factor: "Manager Review Completed", weight: "10%", score: 75, status: "Pending" },
    { factor: "Compliance Threshold Met", weight: "10%", score: 85, status: "Pass" },
  ];

  /* Audit Readiness Blockers */
  const readinessBlockers = [
    { icon: XCircle, text: "Fire Safety Certificate renewal pending at Salt Lake Sector V", penalty: "-8 pts" },
    { icon: AlertTriangle, text: "Unresolved stock shrinkage discrepancy at Connaught Place", penalty: "-5 pts" },
    { icon: Clock, text: "Cold-chain temperature log gap at Bandra West", penalty: "-3 pts" },
  ];

  const overallVerificationScore = 92;
  const overallApprovalScore = 87;

  const getScoreRatingBadge = (score) => {
    if (score >= 90) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
          90–100 → Excellent
        </span>
      );
    } else if (score >= 75) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
          75–89 → Good
        </span>
      );
    } else if (score >= 50) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
          50–74 → Needs Review
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
          Below 50 → Critical
        </span>
      );
    }
  };

  const getDecisionBadgeStyle = (st) => {
    const styles = {
      APPROVED: "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20",
      "APPROVED WITH CONDITIONS": "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/25",
      "PENDING REVIEW": "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20",
      REJECTED: "bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-500/25",
      "REQUIRES CORRECTIVE ACTION": "bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-500/25"
    };
    return styles[st] || "bg-slate-700 text-white";
  };

  return (
    <div className="space-y-6">
      {/* ==================================================== */}
      {/* FEATURE 12: AUDIT DECISION SUMMARY (EXECUTIVE BANNER)*/}
      {/* ==================================================== */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white p-6 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1.5">
              <Sparkles size={13} /> EXECUTIVE DECISION SUMMARY
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Audit Decision:</h2>
              <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border ${getDecisionBadgeStyle(decisionState)}`}>
                {decisionState}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
              Network compliance threshold achieved across 14/16 outlets. Provisional signoff granted pending final renewal of municipal safety NOC at Salt Lake Sector V.
            </p>
          </div>

          {/* Quick Decision State Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <select
              value={decisionState}
              onChange={(e) => {
                setDecisionState(e.target.value);
                if (triggerToast) triggerToast(`Audit Executive Decision set to: ${e.target.value}`);
              }}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option value="APPROVED">Set: APPROVED</option>
              <option value="APPROVED WITH CONDITIONS">Set: APPROVED WITH CONDITIONS</option>
              <option value="PENDING REVIEW">Set: PENDING REVIEW</option>
              <option value="REQUIRES CORRECTIVE ACTION">Set: REQUIRES CORRECTIVE ACTION</option>
              <option value="REJECTED">Set: REJECTED</option>
            </select>
            <button
              onClick={() => {
                if (triggerToast) triggerToast(`Official Audit Decision Certificate generated & dispatched.`);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md transition-all whitespace-nowrap"
            >
              Publish Decision
            </button>
          </div>
        </div>

        {/* 5 Key Metric Cards in Decision Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Overall Audit Score</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-0.5">88/100</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Network Grade: A</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Verification Score</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">92%</p>
            <span className="text-[10px] text-slate-600 dark:text-slate-300">High Confidence</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Approval Score</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums mt-0.5">87%</p>
            <span className="text-[10px] text-slate-600 dark:text-slate-300">Ready for Signoff</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Risk Level</span>
            <p className="text-2xl font-black text-amber-500 dark:text-amber-400 tabular-nums mt-0.5">MEDIUM</p>
            <span className="text-[10px] text-amber-600 dark:text-amber-300">2 Outlets High Risk</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Open Critical Issues</span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">2 Issues</p>
            <span className="text-[10px] text-rose-600 dark:text-rose-300">Action Plan Active</span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 2 & 3 & 15: VERIFICATION, APPROVAL, READINESS*/}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FEATURE 2: AUDIT VERIFICATION SCORE */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 flex flex-col justify-between shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                FEATURE 2 · VERIFICATION METRICS
              </span>
              {getScoreRatingBadge(overallVerificationScore)}
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Verification Score</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Confidence score generated from AI document scans and auditor verification.
            </p>

            <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-500/10 dark:to-blue-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Overall Score</p>
                <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">
                  92%
                </p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  EXCELLENT
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Target ≥90%</p>
              </div>
            </div>

            {/* Category Breakdown Bars */}
            <div className="space-y-2.5 text-xs">
              {verificationBreakdown.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                    <span className="font-bold tabular-nums text-slate-900 dark:text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURE 3: AUDIT APPROVAL SCORE */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 flex flex-col justify-between shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                FEATURE 3 · APPROVAL READINESS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400">
                Ready for Signoff
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Approval Score</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Measures readiness for multi-tier executive and GM authorization.
            </p>

            <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-200/60 dark:border-purple-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approval Readiness</p>
                <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight tabular-nums">
                  87%
                </p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300">
                  THRESHOLD MET
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Min Threshold: 85%</p>
              </div>
            </div>

            {/* Factor List */}
            <div className="space-y-2 text-xs">
              {approvalFactors.map((f) => (
                <div key={f.factor} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{f.factor}</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Weight: {f.weight}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">{f.score}%</span>
                    <span className={`block text-[10px] font-semibold ${f.status === "Pass" ? "text-emerald-600 dark:text-emerald-400" : f.status === "Pending" ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {f.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURE 15: AUDIT READINESS INDICATOR & BLOCKERS */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 flex flex-col justify-between shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                FEATURE 15 · AUDIT READINESS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400">
                84% Overall Readiness
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Audit Readiness Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identifies bottlenecks keeping network readiness below 100%.
            </p>

            <div className="my-3 space-y-2 text-xs">
              {[
                { label: "Evidence Submission", pct: 92, color: "bg-emerald-500" },
                { label: "Verification Progress", pct: 88, color: "bg-blue-500" },
                { label: "Compliance Baseline", pct: 81, color: "bg-indigo-500" },
                { label: "Documentation Status", pct: 76, color: "bg-amber-500" },
                { label: "Issue Resolution", pct: 83, color: "bg-purple-500" }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* What is preventing 100% readiness box */}
            <div className="mt-4 p-3 rounded-xl bg-rose-50/70 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 text-xs">
              <p className="font-bold text-rose-700 dark:text-rose-400 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldAlert size={13} /> Preventing 100% Readiness:
              </p>
              <div className="space-y-1.5">
                {readinessBlockers.map((b, idx) => (
                  <div key={idx} className="flex items-start justify-between text-[11px]">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <b.icon size={12} className="text-rose-500 shrink-0 mt-0.5" /> {b.text}
                    </span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0 ml-2 font-mono">{b.penalty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}