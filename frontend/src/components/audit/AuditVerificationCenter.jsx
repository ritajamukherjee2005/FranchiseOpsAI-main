import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Search, Filter, Building2, User, Calendar,
  AlertTriangle, CheckCircle2, XCircle, Clock, ChevronRight,
  Eye, RefreshCw, Sparkles, FileText, ArrowUpDown
} from "lucide-react";

const initialAudits = [
  {
    id: "AUD-2026-101",
    outlet: "Connaught Place",
    category: "Inventory",
    auditor: "Rohan Sharma",
    date: "Aug 12, 2026",
    status: "Needs Review",
    evidenceStatus: "Partial",
    risk: "High",
    score: 68,
    lastUpdated: "Aug 13, 14:20",
    details: "14kg inventory shrinkage gap flagged during shift reconciliation."
  },
  {
    id: "AUD-2026-102",
    outlet: "Indiranagar Central",
    category: "Finance",
    auditor: "Priya Mehta",
    date: "Aug 11, 2026",
    status: "Verified",
    evidenceStatus: "Complete",
    risk: "Low",
    score: 96,
    lastUpdated: "Aug 12, 18:45",
    details: "POS z-report and digital payment gateway audit 100% matched."
  },
  {
    id: "AUD-2026-103",
    outlet: "Salt Lake Sector V",
    category: "Safety",
    auditor: "Vikram Malhotra",
    date: "Aug 10, 2026",
    status: "Partially Verified",
    evidenceStatus: "Expired",
    risk: "Critical",
    score: 54,
    lastUpdated: "Aug 13, 10:15",
    details: "Fire NOC renewal receipt pending from municipal authority."
  },
  {
    id: "AUD-2026-104",
    outlet: "Bandra West",
    category: "Hygiene",
    auditor: "AI Automated Auditor",
    date: "Aug 09, 2026",
    status: "Pending Verification",
    evidenceStatus: "Pending",
    risk: "Medium",
    score: 78,
    lastUpdated: "Aug 11, 12:30",
    details: "Cold-chain chiller temperature logging gaps require verification."
  },
  {
    id: "AUD-2026-105",
    outlet: "Hazratganj",
    category: "Operations",
    auditor: "Ananya Roy",
    date: "Aug 08, 2026",
    status: "Needs Review",
    evidenceStatus: "Partial",
    risk: "High",
    score: 71,
    lastUpdated: "Aug 12, 09:10",
    details: "Cash transaction surge without physical receipt attachments."
  },
  {
    id: "AUD-2026-106",
    outlet: "Anna Nagar Flagship",
    category: "Documentation",
    auditor: "Rohan Sharma",
    date: "Aug 07, 2026",
    status: "Verified",
    evidenceStatus: "Complete",
    risk: "Low",
    score: 98,
    lastUpdated: "Aug 10, 16:00",
    details: "All municipal, food safety, and trade licenses current and verified."
  },
  {
    id: "AUD-2026-107",
    outlet: "Viman Nagar",
    category: "Staff",
    auditor: "Priya Mehta",
    date: "Aug 06, 2026",
    status: "Rejected",
    evidenceStatus: "Missing",
    risk: "Critical",
    score: 42,
    lastUpdated: "Aug 09, 11:20",
    details: "Biometric clock-in location discrepancies detected across 3 staff members."
  },
  {
    id: "AUD-2026-108",
    outlet: "C-Scheme",
    category: "Finance",
    auditor: "AI Automated Auditor",
    date: "Aug 05, 2026",
    status: "Verified",
    evidenceStatus: "Complete",
    risk: "Low",
    score: 91,
    lastUpdated: "Aug 08, 15:40",
    details: "Petty cash voucher audit passed without discrepancies."
  }
];

export default function AuditVerificationCenter({ triggerToast }) {
  const [audits, setAudits] = useState(initialAudits);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [outletFilter, setOutletFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [auditorFilter, setAuditorFilter] = useState("All");
  const [selectedAudit, setSelectedAudit] = useState(null);

  const outlets = useMemo(() => ["All", ...new Set(initialAudits.map((a) => a.outlet))], []);
  const auditors = useMemo(() => ["All", ...new Set(initialAudits.map((a) => a.auditor))], []);

  const filteredAudits = useMemo(() => {
    return audits.filter((item) => {
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      const matchOutlet = outletFilter === "All" || item.outlet === outletFilter;
      const matchRisk = riskFilter === "All" || item.risk === riskFilter;
      const matchAuditor = auditorFilter === "All" || item.auditor === auditorFilter;
      const matchSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.outlet.toLowerCase().includes(search.toLowerCase()) ||
        item.auditor.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchOutlet && matchRisk && matchAuditor && matchSearch;
    });
  }, [audits, search, statusFilter, outletFilter, riskFilter, auditorFilter]);

  const handleUpdateStatus = (id, newStatus) => {
    setAudits((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus, lastUpdated: "Just now" } : a))
    );
    if (triggerToast) triggerToast(`Audit ${id} status updated to: ${newStatus}`);
    if (selectedAudit && selectedAudit.id === id) {
      setSelectedAudit((prev) => ({ ...prev, status: newStatus, lastUpdated: "Just now" }));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Verified: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      "Pending Verification": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      "Partially Verified": "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
      "Needs Review": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      Rejected: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status] || "bg-slate-100 text-slate-600"}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {status}
      </span>
    );
  };

  const getRiskBadge = (risk) => {
    const styles = {
      Low: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
      Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
      High: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400",
      Critical: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400"
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles[risk] || "bg-slate-100 text-slate-600"}`}>
        {risk}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1">
            <Sparkles size={11} /> FEATURE 1 · AUDIT GOVERNANCE ENGINE
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-blue-600 dark:text-blue-400" size={22} /> Audit Verification Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized hub for verifying franchise store audits, evidence completeness, and risk classifications.
          </p>
        </div>

        {/* Quick Filter Pill Stats */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            Total Audits: <strong className="text-blue-600 dark:text-blue-400">{audits.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200/60 dark:border-emerald-500/20">
            Verified: {audits.filter((a) => a.status === "Verified").length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200/60 dark:border-amber-500/20">
            Needs Review: {audits.filter((a) => a.status === "Needs Review" || a.status === "Pending Verification").length}
          </span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5 p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Audit ID, Outlet, Auditor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">Filter Status: All</option>
            <option value="Verified">Verified</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Partially Verified">Partially Verified</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Outlet Filter */}
        <div>
          <select
            value={outletFilter}
            onChange={(e) => setOutletFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            {outlets.map((o) => (
              <option key={o} value={o}>
                Outlet: {o}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Filter */}
        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="All">Risk Level: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Auditor Filter */}
        <div>
          <select
            value={auditorFilter}
            onChange={(e) => setAuditorFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            {auditors.map((a) => (
              <option key={a} value={a}>
                Auditor: {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN AUDIT TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
        <table className="w-full text-xs text-left min-w-[1000px]">
          <thead className="bg-slate-100/90 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">Audit ID</th>
              <th className="py-3 px-4">Outlet</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Auditor</th>
              <th className="py-3 px-4">Audit Date</th>
              <th className="py-3 px-4">Verification Status</th>
              <th className="py-3 px-4">Evidence</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white/40 dark:bg-slate-900/30">
            {filteredAudits.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  No audits match the selected filters.
                </td>
              </tr>
            ) : (
              filteredAudits.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/40 dark:hover:bg-blue-500/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedAudit(item)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {item.outlet}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {item.auditor}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {item.date}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.evidenceStatus === "Complete" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : item.evidenceStatus === "Partial" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"}`}>
                      {item.evidenceStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">{getRiskBadge(item.risk)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold tabular-nums ${item.score >= 90 ? "text-emerald-600 dark:text-emerald-400" : item.score >= 70 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {item.score}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedAudit(item)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "Verified")}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-100"
                      >
                        Verify
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL FOR SELECTED AUDIT */}
      <AnimatePresence>
        {selectedAudit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase font-mono">
                    {selectedAudit.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Audit Details — {selectedAudit.outlet}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAudit(null)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl">
                <div>
                  <p className="text-slate-400">Category:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedAudit.category}</p>
                </div>
                <div>
                  <p className="text-slate-400">Assigned Auditor:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedAudit.auditor}</p>
                </div>
                <div>
                  <p className="text-slate-400">Audit Date:</p>
                  <p className="font-mono text-slate-800 dark:text-slate-200">{selectedAudit.date}</p>
                </div>
                <div>
                  <p className="text-slate-400">Last Updated:</p>
                  <p className="font-mono text-slate-800 dark:text-slate-200">{selectedAudit.lastUpdated}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-400 font-medium mb-1">Auditor Notes & Findings:</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  {selectedAudit.details}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center gap-2">
                  <span>Verification Score:</span>
                  <span className="font-black text-sm text-blue-600 dark:text-blue-400">{selectedAudit.score}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedAudit.id, "Rejected")}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-400 font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAudit.id, "Needs Review")}
                    className="px-3 py-1.5 rounded-xl border border-amber-200 text-amber-600 dark:border-amber-500/30 dark:text-amber-400 font-semibold"
                  >
                    Flag Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedAudit.id, "Verified")}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-xs"
                  >
                    Mark Verified
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
