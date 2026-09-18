import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import {
  Award, TrendingUp, TrendingDown, RefreshCw, Layers, Sparkles,
  BarChart2, FileSpreadsheet, ChevronRight, CheckCircle2, AlertTriangle
} from "lucide-react";

const scorecardCategories = [
  { category: "Safety", current: 94, previous: 88, status: "Compliant" },
  { category: "Hygiene", current: 88, previous: 82, status: "Compliant" },
  { category: "Inventory", current: 75, previous: 84, status: "At Risk" },
  { category: "Finance", current: 92, previous: 90, status: "Compliant" },
  { category: "Staff", current: 86, previous: 78, status: "Compliant" },
  { category: "Documentation", current: 79, previous: 89, status: "At Risk" },
  { category: "Operations", current: 90, previous: 87, status: "Compliant" },
];

const historyComparisonChartData = [
  { metric: "Compliance", current: 88, previous: 81, outletAvg: 85 },
  { metric: "Risk (Inv)", current: 22, previous: 31, outletAvg: 26 },
  { metric: "Verification", current: 92, previous: 84, outletAvg: 88 },
  { metric: "Approval", current: 87, previous: 79, outletAvg: 83 },
  { metric: "Resolved Issues", current: 80, previous: 65, outletAvg: 72 },
];

export default function ScorecardAndHistory({ triggerToast }) {
  const [comparisonPeriod, setComparisonPeriod] = useState("Q3 2026 vs Q2 2026");

  const getScorecardBadge = (status) => {
    const styles = {
      Compliant: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
      "At Risk": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
      "Non-Compliant": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400"
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || "bg-slate-100"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* ==================================================== */}
      {/* FEATURE 10: COMPLIANCE SCORECARD                    */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                FEATURE 10 · COMPLIANCE SCORECARD
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="text-blue-600 dark:text-blue-400" size={20} /> Detailed Compliance Scorecard
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Breakdown across 7 core operational pillars with historic period comparison.
              </p>
            </div>

            {/* Comparison Selector */}
            <select
              value={comparisonPeriod}
              onChange={(e) => {
                setComparisonPeriod(e.target.value);
                if (triggerToast) triggerToast(`Scorecard baseline shifted to: ${e.target.value}`);
              }}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
            >
              <option value="Q3 2026 vs Q2 2026">Baseline: Q3 2026 vs Q2 2026</option>
              <option value="Q3 2026 vs Q1 2026">Baseline: Q3 2026 vs Q1 2026</option>
              <option value="Q3 2026 vs Network Avg">Baseline: vs Network Avg</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead className="bg-slate-100/90 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Current Score</th>
                  <th className="py-2.5 px-3 text-center">Previous Score</th>
                  <th className="py-2.5 px-3 text-center">Change %</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white/40 dark:bg-slate-900/30">
                {scorecardCategories.map((row) => {
                  const diff = row.current - row.previous;
                  const pctChange = ((diff / row.previous) * 100).toFixed(1);
                  const isPos = diff >= 0;

                  return (
                    <tr key={row.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {row.category}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white tabular-nums">
                        {row.current}%
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400 font-mono tabular-nums">
                        {row.previous}%
                      </td>
                      <td className="py-3 px-3 text-center tabular-nums">
                        <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {isPos ? `+${pctChange}%` : `${pctChange}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">{getScorecardBadge(row.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 11: AUDIT HISTORY & COMPARISON               */}
      {/* ==================================================== */}
      <div className="xl:col-span-6 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                FEATURE 11 · AUDIT BENCHMARKING
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="text-purple-500" size={20} /> Audit History & Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparative analysis across Current Audit, Previous Audit, and Outlet Network Average.
              </p>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="mb-4">
            <p className="text-[11px] font-medium text-slate-400 mb-2">Comparative Metrics (%)</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={historyComparisonChartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" vertical={false} />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "1px solid #334155", color: "#fff", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="current" name="Current Audit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" name="Previous Audit" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outletAvg" name="Outlet Avg" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Current Audit</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400 tabular-nums">88%</span>
              <span className="text-[10px] text-emerald-600 block font-semibold">+7% vs prev</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50/60 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Previous Audit</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400 tabular-nums">81%</span>
              <span className="text-[10px] text-slate-400 block font-mono">Jul 12, 2026</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Outlet Average</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">85%</span>
              <span className="text-[10px] text-slate-400 block font-mono">16 Outlets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
