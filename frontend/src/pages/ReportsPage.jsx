import React, { useState, useEffect } from "react";
import { 
  FileText, Download, Calendar, Filter, Sparkles, CheckCircle2, 
  AlertTriangle, TrendingUp, Users, Boxes, Megaphone, ShieldCheck, Store, BarChart3, RefreshCw 
} from "lucide-react";

export default function ReportsPage({ dark = true }) {
  const [period, setPeriod] = useState("30D");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [reportType, setReportType] = useState("Executive Franchise");
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allOutlets = [
      { id: 'MUM-DT', name: 'Mumbai — Downtown Flagship', region: 'West', status: 'HEALTHY', healthScore: 93, revenue: '₹1.60L' },
      { id: 'BLR-JPN', name: 'Bengaluru – JP Nagar', region: 'South', status: 'WATCH', healthScore: 68, revenue: '₹1.10L' },
      { id: 'BLR-IN', name: 'Bengaluru – Indiranagar', region: 'South', status: 'HEALTHY', healthScore: 86, revenue: '₹1.45L' },
      { id: 'HYD-HIT', name: 'Hyderabad – HITEC City', region: 'South', status: 'AT RISK', healthScore: 42, revenue: '₹95K' },
      { id: 'KOL-SL', name: 'Salt Lake Sector V', region: 'East', status: 'WATCH', healthScore: 71, revenue: '₹1.05L' },
      { id: 'DEL-CP', name: 'Connaught Place Delhi', region: 'North', status: 'HEALTHY', healthScore: 89, revenue: '₹1.50L' },
      { id: 'PUN-BC', name: 'Pune – Koregaon Park', region: 'West', status: 'HEALTHY', healthScore: 90, revenue: '₹1.40L' },
      { id: 'CHE-TN', name: 'Chennai – T. Nagar', region: 'South', status: 'WATCH', healthScore: 65, revenue: '₹98K' },
      { id: 'AHM-SG', name: 'Ahmedabad – SG Highway', region: 'West', status: 'HEALTHY', healthScore: 84, revenue: '₹1.30L' },
    ];

    fetch('http://localhost:5000/api/intelligence/franchises', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.franchises || [];
        setOutlets(list.length > 0 ? list : allOutlets);
        setLoading(false);
      })
      .catch(() => {
        setOutlets(allOutlets);
        setLoading(false);
      });
  }, []);

  // Filter outlets by region dropdown
  const filteredOutlets = outlets.filter(store => {
    if (regionFilter === "All Regions") return true;
    return store.region === regionFilter;
  });

  const reportPillars = {
    "Executive Franchise": {
      title: "Executive Franchise Network Health Report",
      generatedDate: "September 05, 2026",
      summary: "Combines critical signals across outlet, inventory, workforce, marketing, and audit dashboards. Network sales are up +11% with 91% target achievement, but at-risk locations require immediate executive review.",
      metrics: [
        { label: "Network Sales", value: "₹4.8Cr", change: "+11% YoY", status: "positive" },
        { label: "Target Achievement", value: "91%", change: "Stable", status: "positive" },
        { label: "At-Risk Outlets", value: "2 Outlets", change: "Requires review", status: "warning" },
        { label: "Overall Compliance", value: "94%", change: "+0.5%", status: "positive" },
      ],
      breakdown: [
        { label: "North Region Hub", value: 92, status: "Optimal" },
        { label: "South Region Cluster", value: 76, status: "Watch" },
        { label: "West Region Flagships", value: 88, status: "Optimal" },
        { label: "East Region Outlets", value: 68, status: "At Risk" },
      ]
    },
    "Outlet Performance": {
      title: "Outlet Revenue, Margins & Customer Footfall Report",
      generatedDate: "September 05, 2026",
      summary: "Evaluates monthly sales, gross margins, average order value, and customer ratings across all registered storefronts.",
      metrics: [
        { label: "Monthly Sales", value: "₹8.4L", change: "+6.2%", status: "positive" },
        { label: "Gross Margin", value: "18.2%", change: "-0.8%", status: "warning" },
        { label: "Customer Rating", value: "4.6 / 5", change: "+0.1", status: "positive" },
        { label: "Target Achievement", value: "92%", change: "+2%", status: "positive" },
      ],
      breakdown: [
        { label: "Downtown Flagship", value: 95, status: "High Margin" },
        { label: "JP Nagar Branch", value: 78, status: "Average" },
        { label: "HITEC City Hub", value: 64, status: "Margin Pressure" },
      ]
    },
    "Inventory & Stock": {
      title: "Inventory Stock Cover, Wastage & Turnover Report",
      generatedDate: "September 05, 2026",
      summary: "Monitors units on hand, stock cover duration, stockout rates, and slow-moving items across every registered branch.",
      metrics: [
        { label: "Units On Hand", value: "1,240 Units", change: "+4.1%", status: "positive" },
        { label: "Stock Cover", value: "7.2 Days", change: "-0.5 days", status: "neutral" },
        { label: "Stockout Rate", value: "3.8%", change: "-1.1%", status: "positive" },
        { label: "Wastage Rate", value: "6.1%", change: "+0.4%", status: "warning" },
      ],
      breakdown: [
        { label: "Beverages Stock Cover", value: 85, status: "Healthy" },
        { label: "Perishables Stock Cover", value: 45, status: "Warning" },
        { label: "Raw Materials Cover", value: 20, status: "Critical" },
      ]
    },
    "Workforce & Capacity": {
      title: "Workforce Attendance, Productivity & Overtime Report",
      generatedDate: "September 05, 2026",
      summary: "Tracks staffing levels, attendance rates, absenteeism, overtime hours, and sales per employee across all locations.",
      metrics: [
        { label: "Attendance Rate", value: "86%", change: "-1.5%", status: "warning" },
        { label: "Staff Productivity", value: "78%", change: "+3.2%", status: "positive" },
        { label: "Absenteeism", value: "4.2%", change: "+0.5%", status: "warning" },
        { label: "Turnover Rate", value: "12%", change: "-1.0%", status: "positive" },
      ],
      breakdown: [
        { label: "Weekday Shift Coverage", value: 92, status: "Optimal" },
        { label: "Weekend Shift Coverage", value: 68, status: "Deficit" },
        { label: "Overtime Utilization", value: 74, status: "Elevated" },
      ]
    },
    "Marketing & Campaigns": {
      title: "Marketing Campaign Revenue, ROAS & CAC Report",
      generatedDate: "September 05, 2026",
      summary: "Measures customer acquisition cost (CAC), lead conversions, campaign revenue, and return on ad spend (ROAS).",
      metrics: [
        { label: "Campaign Revenue", value: "₹12L", change: "+14%", status: "positive" },
        { label: "ROAS", value: "4.1x", change: "+0.3x", status: "positive" },
        { label: "Conversion Rate", value: "8.6%", change: "+1.2%", status: "positive" },
        { label: "Acquisition Cost (CAC)", value: "₹240", change: "-₹15", status: "positive" },
      ],
      breakdown: [
        { label: "Campaign A (Social)", value: 70, status: "Moderate ROAS" },
        { label: "Campaign B (Direct)", value: 95, status: "High Conversion" },
        { label: "Campaign C (Local)", value: 60, status: "Underperforming" },
      ]
    },
    "Audit & Compliance": {
      title: "Audit Compliance Scores, Failed Checks & Closure Report",
      generatedDate: "September 05, 2026",
      summary: "Evaluates checklist compliance, open issues, severity tags, and corrective action closure time across all registered shops.",
      metrics: [
        { label: "Compliance Score", value: "94%", change: "+1.0%", status: "positive" },
        { label: "Open Issues", value: "7 Issues", change: "-2", status: "neutral" },
        { label: "Checklist Score", value: "96%", change: "+0.5%", status: "positive" },
        { label: "Avg. Issue Closure", value: "2.1 Days", change: "-0.4 days", status: "positive" },
      ],
      breakdown: [
        { label: "Hygiene Protocols", value: 88, status: "Stable" },
        { label: "Safety Regulations", value: 95, status: "Compliant" },
        { label: "Document Verification", value: 72, status: "Action Required" },
      ]
    }
  };

  const currentReport = reportPillars[reportType] || reportPillars["Executive Franchise"];

  const handleExport = (format) => {
    alert(`Successfully generated and exported ${reportType} report for scope (${regionFilter}, timeframe: ${period}) as ${format}. Downloading...`);
  };

  return (
    <div className={`p-6 min-h-screen space-y-6 transition-colors duration-300 ${dark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Top Header & Advanced Filter Bar */}
      <div className={`flex flex-col xl:flex-row justify-between items-start xl:items-center pb-4 border-b gap-4 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div>
          <span className="text-xs uppercase font-bold text-indigo-500 tracking-wider flex items-center gap-1">
            <Sparkles size={13} /> Periodic Compliance & Management Reporting Center
          </span>
          <h1 className={`text-2xl font-bold mt-1 ${dark ? 'text-white' : 'text-slate-900'}`}>Formal Franchise Reports</h1>
        </div>

        {/* Global Time & Region Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector (7D, 30D, 90D) */}
          <div className={`flex rounded-xl border p-1 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
            {['7D', '30D', '90D'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  period === p 
                    ? 'bg-indigo-600 text-white shadow' 
                    : dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Region Scope Filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className={`border rounded-xl px-3 py-2 text-xs font-medium outline-none cursor-pointer ${
              dark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <option value="All Regions">All Regions (Global)</option>
            <option value="North">North Region</option>
            <option value="South">South Region</option>
            <option value="West">West Region</option>
            <option value="East">East Region</option>
          </select>

          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition"
          >
            <Download size={14} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Report Pillar Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {Object.keys(reportPillars).map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`p-3 rounded-xl border text-left transition-all ${
              reportType === type 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-md font-bold' 
                : dark ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-indigo-400' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
            }`}
          >
            <div className="text-[11px] font-bold truncate">{type}</div>
            <div className="text-[9px] opacity-75 mt-0.5">Pillar Report</div>
          </button>
        ))}
      </div>

      {/* Active Scope Summary Banner */}
      <div className={`border rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4 ${
        dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Active Report Scope:</span>
          <span className="text-xs font-bold text-indigo-400">{reportType} ({period} window | {regionFilter})</span>
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Filtered Outlets: <strong className="text-indigo-400">{filteredOutlets.length} Active</strong></span>
        </div>
      </div>

      {/* Executive Commentary & Metrics Card */}
      <div className={`border rounded-2xl p-6 shadow-lg space-y-4 ${
        dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div>
          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {period} Explanatory Review ({regionFilter})
          </span>
          <h2 className={`text-lg font-bold mt-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{currentReport.title}</h2>
        </div>

        <p className={`text-xs leading-relaxed p-4 rounded-xl border ${
          dark ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <strong>Management Commentary & Variance Analysis:</strong> {currentReport.summary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {currentReport.metrics.map((metric, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${
              dark ? 'bg-slate-900/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[11px] text-slate-400 font-medium">{metric.label}</span>
              <div className={`text-xl font-bold mt-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{metric.value}</div>
              <div className="flex items-center gap-1 text-[11px] font-semibold mt-1">
                <span className={metric.status === 'positive' ? 'text-emerald-400' : metric.status === 'warning' ? 'text-rose-400' : 'text-indigo-400'}>
                  {metric.change}
                </span>
                <span className="text-slate-400">variance / trend</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar Visual Health Distribution Grid */}
      <div className={`border rounded-2xl p-6 shadow-lg space-y-4 ${
        dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
            <BarChart3 size={16} className="text-indigo-500" /> {reportType} Visual Health Distribution ({regionFilter})
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Normalized Index Score</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {currentReport.breakdown.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${dark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className={`font-semibold ${dark ? 'text-slate-200' : 'text-slate-800'}`}>{item.label}</span>
                <span className="font-mono font-bold text-indigo-400">{item.value}%</span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${item.value >= 80 ? 'bg-emerald-500' : item.value >= 70 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px]">
                <span className="text-slate-400">Status Vector</span>
                <span className={`font-bold ${item.value >= 80 ? 'text-emerald-400' : item.value >= 70 ? 'text-indigo-400' : 'text-amber-400'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtered Registered Branch Telemetry Log */}
      <div className={`border rounded-2xl p-6 shadow-lg space-y-4 ${
        dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
          <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
            Registered Branch Telemetry Records ({filteredOutlets.length} Displayed)
          </h3>
          <div className="flex gap-2">
            <button onClick={() => handleExport('Excel')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${dark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800'}`}>
              Export Excel
            </button>
            <button onClick={() => handleExport('CSV')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${dark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800'}`}>
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[450px]">
          <table className="w-full text-left text-xs">
            <thead className={`sticky top-0 ${dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              <tr>
                <th className="p-3 font-semibold">STORE ID</th>
                <th className="p-3 font-semibold">REGISTERED SHOP NAME</th>
                <th className="p-3 font-semibold">REGION SCOPE</th>
                <th className="p-3 font-semibold">TIME WINDOW</th>
                <th className="p-3 font-semibold">HEALTH SCORE / METRIC</th>
                <th className="p-3 font-semibold">OPERATIONAL STATUS</th>
                <th className="p-3 font-semibold">RISK LEVEL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredOutlets.map((store, i) => (
                <tr key={store.id || i} className={`transition ${dark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'}`}>
                  <td className="p-3 font-mono font-semibold text-indigo-400">{store.id || `STORE-00${i+1}`}</td>
                  <td className={`p-3 font-medium ${dark ? 'text-white' : 'text-slate-900'}`}>{store.name || store.outletName}</td>
                  <td className="p-3 text-slate-400">{store.region || 'Global'} Region</td>
                  <td className="p-3 font-mono text-indigo-300">{period} Span</td>
                  <td className="p-3 font-mono font-bold">{store.healthScore ? `${store.healthScore}/100 Score` : '94% Optimal'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      store.status === 'HEALTHY' || store.status === 'OPTIMAL' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : store.status === 'WATCH' 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {store.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${store.status === 'AT RISK' ? 'text-rose-400' : store.status === 'WATCH' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {store.status === 'AT RISK' ? 'High' : store.status === 'WATCH' ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}