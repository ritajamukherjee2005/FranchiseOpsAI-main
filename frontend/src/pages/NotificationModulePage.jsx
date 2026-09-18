import React, { useState } from "react";
import { 
  Bell, Mail, MessageSquare, Smartphone, ShieldAlert, ArrowRight, 
  CheckCircle2, Clock, AlertTriangle, UserCheck, Layers, RefreshCw, Filter, Search, PlusCircle, X, BarChart3, PieChart, TrendingUp, Activity, GitCommit, ShieldCheck 
} from "lucide-react";

export default function NotificationModulePage({ dark = true }) {
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("alerts");
  
  // Modal state for full functionality
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIssue, setNewIssue] = useState("");
  const [newOutlet, setNewOutlet] = useState("BLR-014 (Indiranagar)");
  const [newOwner, setNewOwner] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  // Complete list of all 16 franchise network outlets/hubs
  const allOutlets = [
    "BLR-014 (Indiranagar)",
    "BLR-022 (Koramangala)",
    "BLR-031 (Whitefield)",
    "MUM-002 (Bandra West)",
    "MUM-011 (Andheri East)",
    "MUM-019 (Lower Parel)",
    "CHN-005 (Anna Nagar)",
    "CHN-012 (T. Nagar)",
    "DEL-009 (Connaught Place)",
    "DEL-015 (Saket)",
    "DEL-020 (Gurugram CyberHub)",
    "HYD-004 (Jubilee Hills)",
    "HYD-008 (Gachibowli)",
    "PUN-003 (Koregaon Park)",
    "KOL-001 (Park Street)",
    "AHM-007 (SG Highway)"
  ];

  // Comprehensive data set categorized by regional hubs
  const [notificationsData, setNotificationsData] = useState([
    // South Region
    { id: "NOTIF-101", event: "Critical Stock Shortage", outlet: "BLR-014 (Indiranagar)", region: "South", channel: "Push + SMS", priority: "CRITICAL", status: "Escalated to Manager", time: "12 mins ago", sla: "18m remaining" },
    { id: "NOTIF-103", event: "Weekly Outlet Performance Report", outlet: "CHN-005 (Anna Nagar)", region: "South", channel: "Email", priority: "LOW", status: "Delivered", time: "3 hours ago", sla: "Completed" },
    { id: "NOTIF-106", event: "Inventory Audit Discrepancy", outlet: "BLR-022 (Koramangala)", region: "South", channel: "Email", priority: "HIGH", status: "Owner Notified", time: "1 hour ago", sla: "3h remaining" },
    { id: "NOTIF-107", event: "Staff Attendance Deficit", outlet: "HYD-008 (Gachibowli)", region: "South", channel: "Push", priority: "MEDIUM", status: "Acknowledged", time: "2 hours ago", sla: "6h remaining" },
    { id: "NOTIF-108", event: "POS Billing System Latency", outlet: "BLR-031 (Whitefield)", region: "South", channel: "Push + SMS", priority: "CRITICAL", status: "Escalated to Manager", time: "25 mins ago", sla: "12m remaining" },
    { id: "NOTIF-110", event: "Local Marketing Promo Approval", outlet: "CHN-012 (T. Nagar)", region: "South", channel: "Email", priority: "LOW", status: "Delivered", time: "4 hours ago", sla: "Completed" },
    { id: "NOTIF-113", event: "Food Safety Audit Warning", outlet: "HYD-004 (Jubilee Hills)", region: "South", channel: "Email", priority: "HIGH", status: "Owner Notified", time: "1 hour ago", sla: "2h remaining" },

    // West Region
    { id: "NOTIF-102", event: "Compliance Checklist Overdue", outlet: "MUM-002 (Bandra West)", region: "West", channel: "Email", priority: "HIGH", status: "Owner Notified", time: "45 mins ago", sla: "2h remaining" },
    { id: "NOTIF-105", event: "Refrigeration Temperature Spike", outlet: "MUM-011 (Andheri East)", region: "West", channel: "Push + SMS", priority: "CRITICAL", status: "Escalated to Regional", time: "8 mins ago", sla: "5m remaining" },
    { id: "NOTIF-109", event: "Vendor Delivery Delay Warning", outlet: "MUM-019 (Lower Parel)", region: "West", channel: "Email", priority: "MEDIUM", status: "Owner Notified", time: "3 hours ago", sla: "5h remaining" },
    { id: "NOTIF-114", event: "Staff Overtime Threshold Reached", outlet: "PUN-003 (Koregaon Park)", region: "West", channel: "Push", priority: "MEDIUM", status: "Acknowledged", time: "3 hours ago", sla: "4h remaining" },
    { id: "NOTIF-116", event: "Cash Drawer Reconciliation Mismatch", outlet: "AHM-007 (SG Highway)", region: "West", channel: "Push + SMS", priority: "CRITICAL", status: "Escalated to Manager", time: "5 mins ago", sla: "10m remaining" },

    // North Region
    { id: "NOTIF-104", event: "Unusual Margin Drop Detected", outlet: "DEL-009 (Connaught Place)", region: "North", channel: "Push", priority: "MEDIUM", status: "Acknowledged", time: "5 hours ago", sla: "4h remaining" },
    { id: "NOTIF-111", event: "HVAC Maintenance Overdue", outlet: "DEL-015 (Saket)", region: "North", channel: "Push", priority: "HIGH", status: "Owner Notified", time: "50 mins ago", sla: "1h remaining" },
    { id: "NOTIF-112", event: "Customer Escalation Incident", outlet: "DEL-020 (Gurugram CyberHub)", region: "North", channel: "Push + SMS", priority: "CRITICAL", status: "Escalated to Regional", time: "15 mins ago", sla: "8m remaining" },

    // East Region
    { id: "NOTIF-115", event: "Power Backup Generator Check", outlet: "KOL-001 (Park Street)", region: "East", channel: "Email", priority: "LOW", status: "Delivered", time: "6 hours ago", sla: "Completed" }
  ]);

  const [actionPlansData, setActionPlansData] = useState([
    { id: "AP-301", issue: "Stock replenishment for Coffee Beans & Milk", outlet: "BLR-014 (Indiranagar)", owner: "Rohan Verma", deadline: "Today, 6:00 PM", status: "In Progress", progress: 65 },
    { id: "AP-302", issue: "Sanitation corrective action re-audit", outlet: "MUM-002 (Bandra West)", owner: "Priya Sharma", deadline: "Sep 7, 2026", status: "Pending Verification", progress: 90 },
    { id: "AP-303", issue: "Overtime shift roster adjustment", outlet: "CHN-005 (Anna Nagar)", owner: "Amit Kumar", deadline: "Sep 8, 2026", status: "Assigned", progress: 20 },
    { id: "AP-304", issue: "Emergency refrigeration repair", outlet: "MUM-011 (Andheri East)", owner: "Vikram Malhotra", deadline: "Today, 3:00 PM", status: "In Progress", progress: 40 },
    { id: "AP-305", issue: "Staff roster realignment for weekend footfall", outlet: "HYD-008 (Gachibowli)", owner: "Sneha Reddy", deadline: "Sep 9, 2026", status: "Assigned", progress: 10 },
    { id: "AP-306", issue: "POS network node hardware replacement", outlet: "BLR-031 (Whitefield)", owner: "Karan Joshi", deadline: "Today, 4:30 PM", status: "In Progress", progress: 50 },
    { id: "AP-307", issue: "HVAC filter replacement and duct sanitization", outlet: "DEL-015 (Saket)", owner: "Deepak Sharma", deadline: "Sep 10, 2026", status: "Assigned", progress: 15 },
    { id: "AP-308", issue: "Customer service escalation mediation log", outlet: "DEL-020 (Gurugram CyberHub)", owner: "Ananya Sen", deadline: "Tomorrow, 12:00 PM", status: "Pending Verification", progress: 85 },
    { id: "AP-309", issue: "Cash drawer balance verification and reconciliation log", outlet: "AHM-007 (SG Highway)", owner: "Minesh Patel", deadline: "Sep 11, 2026", status: "In Progress", progress: 45 }
  ]);

  const handleCreateActionPlan = (e) => {
    e.preventDefault();
    if (!newIssue || !newOwner || !newDeadline) {
      alert("Please fill in all required fields for the action plan.");
      return;
    }

    const newPlan = {
      id: `AP-30${actionPlansData.length + 1}`,
      issue: newIssue,
      outlet: newOutlet,
      owner: newOwner,
      deadline: newDeadline,
      status: "Assigned",
      progress: 10
    };

    setActionPlansData([newPlan, ...actionPlansData]);
    setNewIssue("");
    setNewOwner("");
    setNewDeadline("");
    setIsModalOpen(false);
    setActiveTab("actions");
  };

  const metrics = [
    { label: "Total Notifications Sent", value: "1,420", change: "+12.4% vs last week", color: "text-indigo-400" },
    { label: "Acknowledgement Rate", value: "94.2%", change: "Target > 90%", color: "text-emerald-400" },
    { label: "Open Actions", value: actionPlansData.length.toString(), change: "Tracked live", color: "text-amber-400" },
    { label: "SLA Breaches", value: "4", change: "Escalated to Regional", color: "text-rose-400" }
  ];

  // Helper to render a smaller regional table
  const renderRegionalTable = (regionName, regionColor) => {
    const filteredRows = notificationsData.filter(
      item => item.region === regionName && (priorityFilter === "ALL" || item.priority === priorityFilter)
    );

    if (filteredRows.length === 0) return null;

    return (
      <div className={`p-5 rounded-2xl border shadow-md space-y-3 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
        <div className="flex justify-between items-center pb-2 border-b border-indigo-500/20">
          <h4 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${regionColor}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></span>
            {regionName} Region Hubs ({filteredRows.length} Active Alerts)
          </h4>
          <span className="text-[10px] font-mono font-bold text-indigo-400">Live Telemetry Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${dark ? 'text-indigo-200 border-indigo-500/20' : 'text-indigo-950 font-extrabold border-indigo-200'}`}>
              <tr>
                <th className="pb-2 px-2">EVENT ID</th>
                <th className="pb-2 px-2">OPERATIONAL EXCEPTION</th>
                <th className="pb-2 px-2">OUTLET / NODE</th>
                <th className="pb-2 px-2">CHANNEL</th>
                <th className="pb-2 px-2">PRIORITY</th>
                <th className="pb-2 px-2">SLA STATUS</th>
                <th className="pb-2 px-2">CURRENT STATE</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-indigo-500/10 text-slate-100' : 'divide-indigo-100 text-slate-900 font-semibold'}`}>
              {filteredRows.map((item, idx) => (
                <tr key={idx} className="hover:bg-indigo-500/10 transition">
                  <td className="py-2.5 px-2 font-mono text-indigo-500 dark:text-indigo-400 font-extrabold">{item.id}</td>
                  <td className="py-2.5 px-2 font-bold">{item.event}</td>
                  <td className="py-2.5 px-2 font-semibold opacity-90">{item.outlet}</td>
                  <td className="py-2.5 px-2 font-mono font-bold text-indigo-600 dark:text-indigo-300">{item.channel}</td>
                  <td className="py-2.5 px-2">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                      item.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30' :
                      item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-mono font-bold opacity-90">{item.sla}</td>
                  <td className="py-2.5 px-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-6 min-h-screen space-y-6 transition-colors duration-300 ${dark ? 'bg-slate-950 text-white' : 'bg-indigo-50/30 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className={`flex flex-col xl:flex-row justify-between items-start xl:items-center pb-4 border-b gap-4 ${dark ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Notification & Workflow Control Center</h1>
          </div>
          <p className="text-xs mt-1 font-medium opacity-80">
            Manage multi-channel communications, automated SLA escalations, and trackable franchise action plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-semibold rounded-xl shadow-lg transition cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Create Action Plan</span>
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border shadow-md backdrop-blur-md ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100 shadow-indigo-100'}`}>
            <div className="text-[11px] font-bold opacity-80">{m.label}</div>
            <div className="text-2xl font-extrabold mt-1 tracking-tight">{m.value}</div>
            <div className={`text-[10px] font-bold mt-1 ${m.color}`}>{m.change}</div>
          </div>
        ))}
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className={`flex flex-wrap items-center gap-2 border-b pb-3 ${dark ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "alerts"
              ? 'bg-indigo-600 text-white shadow-md'
              : dark ? 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-500/20' : 'bg-white text-indigo-900 border border-indigo-200 font-semibold'
          }`}
        >
          <Bell size={14} />
          <span>Live Notification Feed & Channels</span>
        </button>

        <button
          onClick={() => setActiveTab("actions")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "actions"
              ? 'bg-indigo-600 text-white shadow-md'
              : dark ? 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-500/20' : 'bg-white text-indigo-900 border border-indigo-200 font-semibold'
          }`}
        >
          <CheckCircle2 size={14} />
          <span>Franchise Action Plans Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab("escalations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "escalations"
              ? 'bg-indigo-600 text-white shadow-md'
              : dark ? 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60 border border-indigo-500/20' : 'bg-white text-indigo-900 border border-indigo-200 font-semibold'
          }`}
        >
          <ShieldCheck size={14} />
          <span>SLA Escalations & Routing</span>
        </button>
      </div>

      {/* TAB CONTENT 1: LIVE NOTIFICATION FEED & CHANNELS */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span className="flex items-center gap-1.5"><BarChart3 size={16} /> 1. Channel Distribution (Bar)</span>
                <span className="font-mono text-[10px] opacity-70">1,420 Total</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Email Alerts</span><span className="font-mono">766 (54%)</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-indigo-500 h-full rounded-full" style={{ width: '54%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Mobile Push</span><span className="font-mono">440 (31%)</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-purple-500 h-full rounded-full" style={{ width: '31%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>SMS Urgent</span><span className="font-mono">214 (15%)</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5"><PieChart size={16} /> 2. Regional Share (Proportion)</span>
                <span className="font-mono text-[10px] opacity-70">16 Outlets</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>South Region Hubs</span><span className="font-mono">44%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '44%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>West Region Hubs</span><span className="font-mono">31%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-teal-500 h-full rounded-full" style={{ width: '31%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>North & East Hubs</span><span className="font-mono">25%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-cyan-500 h-full rounded-full" style={{ width: '25%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span className="flex items-center gap-1.5"><TrendingUp size={16} /> 3. Priority Severity Ratio</span>
                <span className="font-mono text-[10px] text-rose-400 font-bold">4 Critical</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Critical (Immediate)</span><span className="font-mono">25%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-rose-500 h-full rounded-full" style={{ width: '25%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>High Priority</span><span className="font-mono">35%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Medium / Low</span><span className="font-mono">40%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span className="flex items-center gap-1.5"><Activity size={16} /> 4. SLA Closure Efficiency</span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">94.2% On-Time</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Closed Within SLA Target</span><span className="font-mono">94.2%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.2%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Escalated to Regional Authority</span><span className="font-mono">5.8%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-rose-500 h-full rounded-full" style={{ width: '5.8%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 md:col-span-2 xl:col-span-2 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5"><GitCommit size={16} /> 5. Escalation Workflow State Progress Matrix</span>
                <span className="font-mono text-[10px] text-amber-400 font-bold">Active Tracking</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className={`p-3 rounded-xl border ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200'}`}>
                  <div className="text-[10px] uppercase font-bold opacity-70">Step 1</div>
                  <div className="font-extrabold mt-0.5">Issue Created</div>
                  <div className="text-indigo-400 font-mono text-[11px] mt-1">100% Logged</div>
                </div>
                <div className={`p-3 rounded-xl border ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200'}`}>
                  <div className="text-[10px] uppercase font-bold opacity-70">Step 2</div>
                  <div className="font-extrabold mt-0.5">Owner Notified</div>
                  <div className="text-emerald-400 font-mono text-[11px] mt-1">94% Acknowledged</div>
                </div>
                <div className={`p-3 rounded-xl border ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200'}`}>
                  <div className="text-[10px] uppercase font-bold opacity-70">Step 3</div>
                  <div className="font-extrabold mt-0.5">Manager Escalation</div>
                  <div className="text-amber-400 font-mono text-[11px] mt-1">4 Active Cases</div>
                </div>
                <div className={`p-3 rounded-xl border ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200'}`}>
                  <div className="text-[10px] uppercase font-bold opacity-70">Step 4</div>
                  <div className="font-extrabold mt-0.5">Regional Resolution</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">2 Pending Review</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex justify-between items-center p-4 rounded-xl border shadow-sm ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Bell size={16} className="text-indigo-400" /> Multi-Channel Alert Dispatch — Regional Breakdown
            </h3>
            
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold opacity-80">Filter Priority:</span>
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`border rounded-lg px-2.5 py-1.5 font-bold outline-none cursor-pointer ${dark ? 'bg-indigo-950 border-indigo-500/40 text-indigo-200' : 'bg-indigo-50 border-indigo-300 text-indigo-950'}`}
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {renderRegionalTable("South", "text-indigo-400")}
          {renderRegionalTable("West", "text-amber-400")}
          {renderRegionalTable("North", "text-blue-400")}
          {renderRegionalTable("East", "text-emerald-400")}
        </div>
      )}

      {/* TAB CONTENT 2: ACTION PLANS TRACKER */}
      {activeTab === "actions" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span className="flex items-center gap-1.5"><BarChart3 size={16} /> 1. Action Status Distribution</span>
                <span className="font-mono text-[10px] opacity-70">9 Total Plans</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>In Progress</span><span className="font-mono">44%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-indigo-500 h-full rounded-full" style={{ width: '44%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Assigned</span><span className="font-mono">33%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-amber-500 h-full rounded-full" style={{ width: '33%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Pending Verification</span><span className="font-mono">23%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '23%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5"><PieChart size={16} /> 2. Regional Completion Share</span>
                <span className="font-mono text-[10px] opacity-70">Multi-Hub</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>South Hubs Progress</span><span className="font-mono">75%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>West Hubs Progress</span><span className="font-mono">60%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-teal-500 h-full rounded-full" style={{ width: '60%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>North/East Progress</span><span className="font-mono">45%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-cyan-500 h-full rounded-full" style={{ width: '45%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span className="flex items-center gap-1.5"><TrendingUp size={16} /> 3. Avg Resolution Time</span>
                <span className="font-mono text-[10px] text-rose-400 font-bold">Speed Index</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Critical Priority (2.4h)</span><span className="font-mono">85%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-rose-500 h-full rounded-full" style={{ width: '85%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>High Priority (6.1h)</span><span className="font-mono">70%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-amber-500 h-full rounded-full" style={{ width: '70%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Medium Priority (18h)</span><span className="font-mono">90%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-blue-500 h-full rounded-full" style={{ width: '90%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span className="flex items-center gap-1.5"><Activity size={16} /> 4. Weekly Workflow Velocity</span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">+18% Efficiency</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Plans Completed</span><span className="font-mono">24 Plans</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Plans Initiated</span><span className="font-mono">30 Plans</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                <span className="flex items-center gap-1.5"><Layers size={16} /> 5. Owner Workload Share</span>
                <span className="font-mono text-[10px] opacity-70">Active Owners</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Rohan & Priya (Leads)</span><span className="font-mono">45%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-purple-500 h-full rounded-full" style={{ width: '45%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Operations & Field Staff</span><span className="font-mono">55%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-indigo-500 h-full rounded-full" style={{ width: '55%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5"><GitCommit size={16} /> 6. Deadline Risk Matrix</span>
                <span className="font-mono text-[10px] text-amber-400 font-bold">Risk Audit</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>On Track (Safe)</span><span className="font-mono">78%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>At Risk (Due Today)</span><span className="font-mono">22%</span></div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-amber-500 h-full rounded-full" style={{ width: '22%' }}></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-indigo-500/20">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-400" /> Franchise Action Plans & Accountability Tracker
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400">{actionPlansData.length} Active Plans</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {actionPlansData.map((plan, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 shadow-sm ${dark ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono text-indigo-400 font-bold mb-2">
                      <span>{plan.id}</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">{plan.status}</span>
                    </div>
                    <h4 className="text-sm font-extrabold">{plan.issue}</h4>
                    <p className="text-xs mt-1 font-semibold opacity-90">Outlet: <strong className="font-bold">{plan.outlet}</strong></p>
                    <p className="text-xs font-semibold opacity-90">Assigned Owner: <strong className="font-bold">{plan.owner}</strong></p>
                  </div>

                  <div className={`space-y-2 pt-2 border-t ${dark ? 'border-indigo-500/20' : 'border-indigo-100'}`}>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold opacity-80">Deadline: {plan.deadline}</span>
                      <span className="font-mono font-extrabold text-indigo-400">{plan.progress}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-100'}`}>
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${plan.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SLA ESCALATIONS & ROUTING */}
      {activeTab === "escalations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span className="flex items-center gap-1.5"><ShieldCheck size={15} /> 1. SLA Thresholds</span>
                <span className="font-mono text-[10px] opacity-70">Target Met</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>15m Critical Window</span><span className="font-mono">92%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>2h High Priority Window</span><span className="font-mono">96%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-indigo-500 h-full rounded-full" style={{ width: '96%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span className="flex items-center gap-1.5"><Smartphone size={15} /> 2. Routing Channels</span>
                <span className="font-mono text-[10px] opacity-70">Dispatch</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Push + SMS (Critical)</span><span className="font-mono">40%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-rose-500 h-full rounded-full" style={{ width: '40%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Email / Dashboard</span><span className="font-mono">60%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5"><TrendingUp size={15} /> 3. Regional Escalations</span>
                <span className="font-mono text-[10px] opacity-70">Active Load</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>South Hubs Load</span><span className="font-mono">35%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>West & North Hubs</span><span className="font-mono">55%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-purple-500 h-full rounded-full" style={{ width: '55%' }}></div></div>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border shadow-md space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-100'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5"><Activity size={15} /> 4. Handoff Efficiency</span>
                <span className="font-mono text-[10px] opacity-70">Tier Index</span>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Tier-1 Manager Ack</span><span className="font-mono">88%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-[11px] font-semibold"><span>Regional Director Handoff</span><span className="font-mono">12%</span></div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-indigo-950' : 'bg-indigo-50'}`}><div className="bg-cyan-500 h-full rounded-full" style={{ width: '12%' }}></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-indigo-500/20">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-400" /> SLA Escalations & Multi-Channel Routing Rules
              </h3>
              <span className="text-xs font-mono font-bold text-rose-400">4 Active Escalations</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className={`p-4 rounded-xl border space-y-3 ${dark ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
                <div className="flex justify-between items-center text-xs font-bold text-rose-400">
                  <span>CRITICAL SLA BREACH PROTOCOL</span>
                  <span className="font-mono text-[10px]">15m Threshold</span>
                </div>
                <p className="text-xs opacity-90 font-medium">
                  When a critical stock shortage, POS system latency, or refrigeration failure occurs, notifications are instantly routed via **Push + SMS** to the Outlet Manager and automatically escalated to the Regional Director if unacknowledged within 15 minutes.
                </p>
                <div className="text-[11px] font-mono text-indigo-400">Status: Active across all 16 Hubs</div>
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${dark ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
                <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                  <span>HIGH PRIORITY ESCALATION</span>
                  <span className="font-mono text-[10px]">2h Threshold</span>
                </div>
                <p className="text-xs opacity-90 font-medium">
                  Compliance checklist delays and audit discrepancies trigger automated **Email & Dashboard alerts** directed to assigned owners with a mandatory 2-hour resolution window before secondary supervisor notification.
                </p>
                <div className="text-[11px] font-mono text-indigo-400">Status: 94.2% On-Time Resolution</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE CREATE ACTION PLAN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 ${dark ? 'bg-slate-900 border-indigo-500/40 text-white' : 'bg-white border-indigo-200 text-slate-900'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-indigo-500/20">
              <h3 className="text-base font-bold flex items-center gap-2">
                <PlusCircle size={18} className="text-indigo-400" /> Create New Franchise Action Plan
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="opacity-70 hover:opacity-100 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateActionPlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1 opacity-90">Issue / Operational Exception Description *</label>
                <input 
                  type="text"
                  placeholder="e.g., Low refrigeration temperature at storage"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-semibold ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 opacity-90">Select Outlet / Hub *</label>
                  <select 
                    value={newOutlet}
                    onChange={(e) => setNewOutlet(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none cursor-pointer font-semibold ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
                  >
                    {allOutlets.map((outletName, i) => (
                      <option key={i} value={outletName}>{outletName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 opacity-90">Assigned Owner *</label>
                  <input 
                    type="text"
                    placeholder="e.g., Rajesh Kumar"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none font-semibold ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 opacity-90">Target Deadline *</label>
                <input 
                  type="text"
                  placeholder="e.g., Tomorrow, 5:00 PM"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-semibold ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-indigo-500/20">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border font-bold cursor-pointer transition ${dark ? 'border-indigo-500/30 text-indigo-200 hover:bg-indigo-950' : 'border-indigo-300 text-indigo-900 hover:bg-indigo-50'}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer transition"
                >
                  Save & Assign Action Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}