import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, ShieldAlert, CheckCircle2, XCircle, AlertTriangle,
  Clock, Search, Filter, Sparkles, Upload, RefreshCw, User, Calendar,
  FileCheck, AlertCircle, ArrowUpRight
} from "lucide-react";

const initialEvidenceList = [
  {
    id: "EVD-201",
    name: "Supplier Purchase Invoice #INV-8842",
    type: "Invoice",
    outlet: "Indiranagar Central",
    submittedBy: "Rajesh Kumar (Store Mgr)",
    uploadDate: "Aug 08, 2026",
    expiryDate: "N/A",
    score: 96,
    status: "Verified"
  },
  {
    id: "EVD-202",
    name: "Weekly Physical Stock Log",
    type: "Inventory Records",
    outlet: "Connaught Place",
    submittedBy: "Anil Saxena (Inventory Supervisor)",
    uploadDate: "Aug 09, 2026",
    expiryDate: "N/A",
    score: 64,
    status: "Pending"
  },
  {
    id: "EVD-203",
    name: "Municipal Fire Safety NOC Certificate",
    type: "Safety Certificate",
    outlet: "Salt Lake Sector V",
    submittedBy: "Anita Sen (Safety Lead)",
    uploadDate: "Aug 01, 2026",
    expiryDate: "Jul 31, 2026 (EXPIRED)",
    score: 32,
    status: "Expired"
  },
  {
    id: "EVD-204",
    name: "Kitchen Staff Medical Health Clearance",
    type: "Employee Documents",
    outlet: "Bandra West",
    submittedBy: "Pooja Hegde (HR Spec)",
    uploadDate: "Aug 05, 2026",
    expiryDate: "Sep 15, 2026",
    score: 88,
    status: "Verified"
  },
  {
    id: "EVD-205",
    name: "Daily Chiller Sanitation Checklist",
    type: "Hygiene Checklist",
    outlet: "Bandra West",
    submittedBy: "Suresh P. (Kitchen Lead)",
    uploadDate: "Aug 10, 2026",
    expiryDate: "N/A",
    score: 58,
    status: "Invalid"
  },
  {
    id: "EVD-206",
    name: "Cold Storage Maintenance Photo Scan",
    type: "Outlet Photos",
    outlet: "Hazratganj",
    submittedBy: "Manoj T.",
    uploadDate: "Pending",
    expiryDate: "N/A",
    score: 20,
    status: "Missing"
  },
  {
    id: "EVD-207",
    name: "Monthly POS Z-Report Reconciliation",
    type: "Sales Reports",
    outlet: "Koramangala",
    submittedBy: "Vikas R.",
    uploadDate: "Aug 10, 2026",
    expiryDate: "N/A",
    score: 98,
    status: "Verified"
  },
  {
    id: "EVD-208",
    name: "FSSAI Commercial Food License",
    type: "License Documents",
    outlet: "SG Highway",
    submittedBy: "Devendra S.",
    uploadDate: "Aug 02, 2026",
    expiryDate: "Dec 31, 2027",
    score: 94,
    status: "Verified"
  }
];

const initialExpiryDocs = [
  {
    id: "DOC-101",
    document: "Municipal Fire Safety NOC Certificate",
    outlet: "Salt Lake Sector V",
    expiryDate: "Aug 01, 2026",
    daysRemaining: -12,
    status: "Expired",
    riskLevel: "Critical"
  },
  {
    id: "DOC-102",
    document: "FSSAI Annual Food Safety License",
    outlet: "Connaught Place",
    expiryDate: "Aug 17, 2026",
    daysRemaining: 4,
    status: "Expiring in 7 days",
    riskLevel: "High"
  },
  {
    id: "DOC-103",
    document: "Commercial Trade & Operations License",
    outlet: "Hazratganj",
    expiryDate: "Aug 28, 2026",
    daysRemaining: 15,
    status: "Expiring in 30 days",
    riskLevel: "Medium"
  },
  {
    id: "DOC-104",
    document: "Employee Medical Fitness Clearance",
    outlet: "Bandra West",
    expiryDate: "Sep 10, 2026",
    daysRemaining: 28,
    status: "Expiring in 30 days",
    riskLevel: "Medium"
  },
  {
    id: "DOC-105",
    document: "High-Voltage Electrical Safety NOC",
    outlet: "Anna Nagar Flagship",
    expiryDate: "Dec 15, 2027",
    daysRemaining: 489,
    status: "Valid",
    riskLevel: "Low"
  },
  {
    id: "DOC-106",
    document: "Municipal Water Sanitation Audit Cert",
    outlet: "Indiranagar Central",
    expiryDate: "Oct 30, 2026",
    daysRemaining: 78,
    status: "Valid",
    riskLevel: "Low"
  }
];

export default function EvidenceAndExpiryTracker({ triggerToast }) {
  const [evidenceItems, setEvidenceItems] = useState(initialEvidenceList);
  const [evidenceFilter, setEvidenceFilter] = useState("All");
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState("All");
  const [evidenceSearch, setEvidenceSearch] = useState("");

  const [expiryDocs, setExpiryDocs] = useState(initialExpiryDocs);
  const [expiryFilter, setExpiryFilter] = useState("All");

  /* Evidence Filter Logic */
  const filteredEvidence = useMemo(() => {
    return evidenceItems.filter((evd) => {
      const matchStatus = evidenceFilter === "All" || evd.status === evidenceFilter;
      const matchType = evidenceTypeFilter === "All" || evd.type === evidenceTypeFilter;
      const matchSearch =
        evd.name.toLowerCase().includes(evidenceSearch.toLowerCase()) ||
        evd.outlet.toLowerCase().includes(evidenceSearch.toLowerCase()) ||
        evd.submittedBy.toLowerCase().includes(evidenceSearch.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [evidenceItems, evidenceFilter, evidenceTypeFilter, evidenceSearch]);

  const handleEvidenceAction = (id, newStatus) => {
    setEvidenceItems((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: newStatus,
              score: newStatus === "Verified" ? Math.max(90, e.score + 25) : newStatus === "Invalid" ? 25 : e.score
            }
          : e
      )
    );
    if (triggerToast) triggerToast(`Evidence ${id} marked as: ${newStatus}`);
  };

  /* Expiry Filter Logic */
  const filteredExpiry = useMemo(() => {
    if (expiryFilter === "All") return expiryDocs;
    return expiryDocs.filter((d) => d.status === expiryFilter);
  }, [expiryDocs, expiryFilter]);

  const handleRequestRenewal = (docId) => {
    if (triggerToast) triggerToast(`Renewal notice dispatched to store manager for ${docId}`);
  };

  const getEvidenceBadge = (status) => {
    const styles = {
      Verified: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
      Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400",
      Invalid: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400",
      Expired: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400",
      Missing: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400"
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
      {/* FEATURE 5: EVIDENCE VERIFICATION PANEL               */}
      {/* ==================================================== */}
      <div className="xl:col-span-7 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                FEATURE 5 · EVIDENCE VERIFICATION
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="text-blue-600 dark:text-blue-400" size={20} /> Evidence Verification Panel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify invoices, safety certificates, checklists, and store photo evidence.
              </p>
            </div>

            <div className="relative w-full sm:w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={evidenceSearch}
                onChange={(e) => setEvidenceSearch(e.target.value)}
                placeholder="Search evidence..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:outline-none focus:border-blue-400 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit text-xs">
            {["All", "Verified", "Pending", "Invalid", "Expired", "Missing"].map((st) => (
              <button
                key={st}
                onClick={() => setEvidenceFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${evidenceFilter === st ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Evidence List */}
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {filteredEvidence.map((evd) => (
              <div
                key={evd.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{evd.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded shrink-0">
                        {evd.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>Outlet: <strong className="text-slate-700 dark:text-slate-200">{evd.outlet}</strong></span>
                      <span>By: {evd.submittedBy}</span>
                      <span>Uploaded: {evd.uploadDate}</span>
                      {evd.expiryDate !== "N/A" && <span className="text-rose-500 font-semibold">Expiry: {evd.expiryDate}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    {getEvidenceBadge(evd.status)}
                    <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      Score: <strong className={evd.score >= 85 ? "text-emerald-500" : evd.score >= 60 ? "text-amber-500" : "text-rose-500"}>{evd.score}%</strong>
                    </span>
                  </div>

                  {/* Actions: Verify, Reject, Request Evidence */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEvidenceAction(evd.id, "Verified")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shadow-xs"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleEvidenceAction(evd.id, "Invalid")}
                      className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-400 font-semibold text-[10px]"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleEvidenceAction(evd.id, "Pending")}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[10px]"
                    >
                      Req Evidence
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FEATURE 6: DOCUMENT EXPIRY TRACKER                   */}
      {/* ==================================================== */}
      <div className="xl:col-span-5 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                FEATURE 6 · DOCUMENT EXPIRY
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="text-amber-500" size={20} /> Compliance Document Expiry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monitors statutory permits, licenses & safety certificates expiration dates.
              </p>
            </div>
          </div>

          {/* Expiry Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs">
            {["All", "Expired", "Expiring in 7 days", "Expiring in 30 days", "Valid"].map((st) => (
              <button
                key={st}
                onClick={() => setExpiryFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${expiryFilter === st ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Document Expiry Cards */}
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {filteredExpiry.map((doc) => (
              <div
                key={doc.id}
                className={`p-3.5 rounded-xl border transition-all text-xs ${doc.status === "Expired" ? "bg-rose-50/70 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20" : doc.status === "Expiring in 7 days" ? "bg-amber-50/70 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20" : "bg-white/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {doc.status === "Expired" && <AlertCircle size={14} className="text-rose-600 animate-pulse" />}
                      {doc.status === "Expiring in 7 days" && <AlertTriangle size={14} className="text-amber-600" />}
                      <span className="font-bold text-slate-900 dark:text-white">{doc.document}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Outlet: <strong className="text-slate-800 dark:text-slate-200">{doc.outlet}</strong>
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${doc.status === "Expired" ? "bg-rose-600 text-white" : doc.status === "Expiring in 7 days" ? "bg-amber-500 text-white" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"}`}>
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-200/50 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    Expiry Date: <strong className="font-mono text-slate-800 dark:text-slate-200">{doc.expiryDate}</strong>
                  </span>
                  <span className={`font-mono font-bold ${doc.daysRemaining < 0 ? "text-rose-600 dark:text-rose-400" : doc.daysRemaining <= 7 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {doc.daysRemaining < 0 ? `${Math.abs(doc.daysRemaining)} days overdue` : `${doc.daysRemaining} days remaining`}
                  </span>
                </div>

                {(doc.status === "Expired" || doc.status === "Expiring in 7 days") && (
                  <button
                    onClick={() => handleRequestRenewal(doc.id)}
                    className="w-full mt-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[11px] font-bold shadow-xs hover:opacity-90 transition-opacity"
                  >
                    Request Urgent Document Renewal
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
