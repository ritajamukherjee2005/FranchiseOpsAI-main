import React, { useState } from "react";
import { 
  Sparkles, TrendingUp, Store, Boxes, Users, Megaphone, ShieldCheck, 
  BarChart3, ArrowRight, Activity, AlertTriangle, CheckCircle2, RefreshCw, PieChart, ShieldAlert, Search, Layers, Brain, Cpu, Zap 
} from "lucide-react";

export default function DashboardPage({ dark = true }) {
  const [period, setPeriod] = useState("30D");
  const [region, setRegion] = useState("All Regions");
  const [activeTab, setActiveTab] = useState("Unified");
  const [searchQuery, setSearchQuery] = useState("");
  const [executingId, setExecutingId] = useState(null);
  const [resolvedIds, setResolvedIds] = useState([]);

  const handleExecuteRecommendation = (id) => {
    setExecutingId(id);
    setTimeout(() => {
      setExecutingId(null);
      setResolvedIds(prev => [...prev, id]);
    }, 1200);
  };

  const recommendations = [
    {
      id: "AI-REC-501",
      title: "Automated Stock Rebalancing",
      outlet: "BLR-014 (Indiranagar) → CHN-005 (Anna Nagar)",
      impact: "High Revenue Protection",
      confidence: "98.4%",
      description: "Predicted surplus of dark roast coffee beans in South-East cluster. Recommend automatic transfer of 45 units to prevent localized stock-out.",
      category: "Inventory Agent",
      priority: "CRITICAL"
    },
    {
      id: "AI-REC-502",
      title: "Dynamic Staff Shift Realignment",
      outlet: "MUM-002 (Bandra West)",
      impact: "Labor Cost Optimization (-14%)",
      confidence: "94.1%",
      description: "Footfall analytics indicate a 30% dip between 2PM-5PM on weekdays. Suggest trimming 2 shift slots to optimize labor expenditure.",
      category: "Staff Agent",
      priority: "MEDIUM"
    },
    {
      id: "AI-REC-503",
      title: "Compliance Risk Mitigation Protocol",
      outlet: "DEL-015 (Saket)",
      impact: "Audit Penalties Avoidance",
      confidence: "96.8%",
      description: "HVAC maintenance logs are overdue by 3 days. Initiate automated vendor dispatch ticket to prevent health safety compliance score drop.",
      category: "AI Audit Agent",
      priority: "HIGH"
    }
  ];

  // Dynamic dataset for Channel Spend vs Revenue Visualization
  const marketingData = [
    { channel: "Social", spend: 35000, spendLabel: "₹35K", rev: 160000, revLabel: "₹1.6L", ratio: 80, roas: "4.6x", color: "bg-purple-500" },
    { channel: "Search", spend: 45000, spendLabel: "₹45K", rev: 240000, revLabel: "₹2.4L", ratio: 95, roas: "5.3x", color: "bg-indigo-500" },
    { channel: "Email", spend: 12000, spendLabel: "₹12K", rev: 75000, revLabel: "₹75K", ratio: 65, roas: "6.25x", color: "bg-blue-500" },
    { channel: "In-Store", spend: 20000, spendLabel: "₹20K", rev: 90000, revLabel: "₹90K", ratio: 70, roas: "4.5x", color: "bg-emerald-500" }
  ];

  // Dynamic dataset for Regional Revenue Contribution
  const regionalData = [
    { region: "South (42%)", amount: "₹5.60L", width: "85%", color: "bg-indigo-600", hex: "#4f46e5" },
    { region: "North (28%)", amount: "₹3.74L", width: "65%", color: "bg-amber-500", hex: "#f59e0b" },
    { region: "West (20%)", amount: "₹2.67L", width: "45%", color: "bg-rose-500", hex: "#f43f5e" },
    { region: "East (10%)", amount: "₹1.33L", width: "25%", color: "bg-emerald-500", hex: "#10b981" }
  ];

  // Dynamic dataset for Outlet Leaderboard
  const outletData = [
    { name: "Bandra West", region: "West", revLabel: "₹1.60L", health: 85, color: "bg-indigo-600" },
    { name: "Indiranagar", region: "South", revLabel: "₹1.45L", health: 92, color: "bg-emerald-500" },
    { name: "Anna Nagar", region: "South", revLabel: "₹1.25L", health: 80, color: "bg-purple-500" },
    { name: "Koramangala", region: "South", revLabel: "₹1.10L", health: 86, color: "bg-blue-500" },
    { name: "Andheri East", region: "West", revLabel: "₹95K", health: 88, color: "bg-teal-500" }
  ];

  // Dynamic dataset for Inventory Stock Cover
  const inventoryData = [
    { name: "Coffee Beans", cover: 5.8, coverLabel: "5.8x", status: "Optimal", color: "bg-emerald-500" },
    { name: "Orange Juice", cover: 6.2, coverLabel: "6.2x", status: "Optimal", color: "bg-emerald-500" },
    { name: "Green Tea", cover: 4.5, coverLabel: "4.5x", status: "Stable", color: "bg-indigo-500" },
    { name: "Cream Milk", cover: 2.4, coverLabel: "2.4x", status: "Low", color: "bg-amber-500" },
    { name: "Sandwich Bread", cover: 1.8, coverLabel: "1.8x", status: "Critical", color: "bg-rose-500" }
  ];

  // Dynamic dataset for Weekly Attendance vs Productivity
  const workforceData = [
    { day: "Mon", attendance: 95, productivity: 91 },
    { day: "Tue", attendance: 92, productivity: 89 },
    { day: "Wed", attendance: 98, productivity: 94 },
    { day: "Thu", attendance: 90, productivity: 85 },
    { day: "Fri", attendance: 96, productivity: 93 },
    { day: "Sat", attendance: 99, productivity: 97 },
    { day: "Sun", attendance: 94, productivity: 90 }
  ];

  // Dynamic dataset for Audit Issues
  const auditData = [
    { label: "Food Safety & Storage", score: 92, color: "bg-emerald-500" },
    { label: "Hygiene & Sanitation", score: 88, color: "bg-emerald-500" },
    { label: "Standard Operating Procedures", score: 84, color: "bg-indigo-500" },
    { label: "Cash & Billing Audit", score: 79, color: "bg-amber-500" }
  ];

  return (
    <div className={`p-6 min-h-screen space-y-6 transition-colors duration-300 ${dark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER SECTION */}
      <div className={`flex flex-col xl:flex-row justify-between items-start xl:items-center pb-4 border-b gap-4 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Franchise Analytics Control Center</h1>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold shadow-sm border border-indigo-500">
              {activeTab === "Unified" ? "Module 1–7 Enterprise Unified" : `${activeTab} Focus Mode`}
            </span>
          </div>
          <p className={`text-xs mt-1 font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Real-time macro telemetry, cross-module risk logs, and multi-pillar operational analytics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search global network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs font-semibold rounded-xl border outline-none ${
                dark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div className={`flex rounded-xl border p-1 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
            {['7D', '30D', '90D', 'YTD'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  period === p 
                    ? 'bg-indigo-600 text-white shadow' 
                    : dark ? 'text-slate-300 hover:text-white' : 'text-slate-800 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`border rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer ${
              dark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="All Regions">All Regions (16 Hubs)</option>
            <option value="North Region">North Region (4)</option>
            <option value="South Region">South Region (6)</option>
            <option value="West Region">West Region (4)</option>
            <option value="East Region">East Region (2)</option>
          </select>
        </div>
      </div>

      {/* QUICK-JUMP MODULE ANCHOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "Unified", label: "Unified View", icon: Layers },
          { id: "Outlet", label: "Outlet Performance", icon: Store },
          { id: "Inventory", label: "Inventory Intelligence", icon: Boxes },
          { id: "Workforce", label: "Workforce", icon: Users },
          { id: "Marketing", label: "Marketing", icon: Megaphone },
          { id: "Audit", label: "AI Audit", icon: ShieldCheck },
          { id: "BI", label: "Franchise BI", icon: BarChart3 },
          { id: "Decision", label: "AI Decision Support", icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : dark ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* LIVE TELEMETRY STATUS BAR */}
      <div className={`px-4 py-2 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-4 font-semibold ${
        dark ? 'bg-slate-800/40 border-slate-700/80 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">PostgreSQL Live Telemetry Connected</span>
          <span className="text-slate-400">|</span>
          <span>Scope: <strong>16 Active Franchise Nodes</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono font-bold">
          <span>Latency: 14ms</span>
          <span>DB Pool: 18/20 Active</span>
          <span>Agent Loop: Nominal</span>
        </div>
      </div>

      {/* TOP HEADLINE KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className={`p-4 rounded-2xl border shadow-md ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>TOTAL REVENUE</div>
          <div className={`text-xl font-extrabold mt-1 ${dark ? 'text-white' : 'text-slate-950'}`}>₹13.34L</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">↑ +14.8% vs prior</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>REVENUE GROWTH</div>
          <div className={`text-xl font-extrabold mt-1 ${dark ? 'text-white' : 'text-slate-950'}`}>+14.8%</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">Exceeding +12% goal</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>TARGET GOAL</div>
          <div className={`text-xl font-extrabold mt-1 ${dark ? 'text-white' : 'text-slate-950'}`}>96.4%</div>
          <div className="w-full bg-slate-300 dark:bg-slate-700 h-1 rounded-full mt-2">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '96.4%' }}></div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>HEALTH SCORE</div>
          <div className={`text-xl font-extrabold mt-1 ${dark ? 'text-white' : 'text-slate-950'}`}>81<span className="text-xs font-bold text-slate-500">/100</span></div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">9 Healthy Outlets</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>STOCK COVER</div>
          <div className={`text-xl font-extrabold mt-1 ${dark ? 'text-white' : 'text-slate-950'}`}>4.2x</div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold mt-1">3 SKUs at Risk</div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-md ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className={`text-[11px] font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>COMPLIANCE</div>
          <div className={`text-xl font-extrabold mt-1 ${dark ? 'text-white' : 'text-slate-950'}`}>94.2%</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">12 Total Exceptions</div>
        </div>
      </div>

      {/* TAB 7: AI DECISION SUPPORT VIEW */}
      {activeTab === "Decision" && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className={`p-6 rounded-3xl border shadow-lg relative overflow-hidden ${dark ? 'bg-slate-800/80 border-indigo-500/30' : 'bg-white border-indigo-100 shadow-indigo-50'}`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Brain size={120} className="text-indigo-400" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                  <Sparkles size={16} />
                  <span>NEURAL PRESCRIPTIVE ENGINE • ACTIVE TELEMETRY</span>
                </div>
                <h2 className={`text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>AI Decision Support & Autonomous Action Hub</h2>
                <p className={`text-xs font-semibold mt-1 max-w-2xl ${dark ? 'text-slate-200' : 'text-slate-900'}`}>
                  Synthesizing real-time data streams across all 16 franchise nodes to deliver autonomous operational recommendations, risk preemptions, and automated workflow triggers[cite: 1].
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Model Accuracy: 97.2%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border shadow-sm ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className={`text-[11px] font-bold uppercase ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Active Prescriptions</div>
              <div className="text-2xl font-extrabold mt-1 text-indigo-400">3 Pending Actions</div>
              <div className={`text-[10px] font-semibold mt-1 ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Ready for executive authorization</div>
            </div>

            <div className={`p-4 rounded-2xl border shadow-sm ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className={`text-[11px] font-bold uppercase ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Autonomous Interventions</div>
              <div className="text-2xl font-extrabold mt-1 text-emerald-400">142 Executed Today</div>
              <div className={`text-[10px] font-semibold mt-1 ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Zero human intervention required</div>
            </div>

            <div className={`p-4 rounded-2xl border shadow-sm ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className={`text-[11px] font-bold uppercase ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Estimated Financial Recovery</div>
              <div className="text-2xl font-extrabold mt-1 text-amber-400">₹1.84L Saved</div>
              <div className={`text-[10px] font-semibold mt-1 ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Through automated stock & shift balancing</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className={`text-sm font-extrabold tracking-wide uppercase flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
                <Cpu size={16} className="text-indigo-400" /> Prescriptive Action Items
              </h3>
              <span className={`text-xs font-mono font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Sorted by Confidence Weight</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => {
                const isResolved = resolvedIds.includes(rec.id);
                const isExecuting = executingId === rec.id;

                return (
                  <div 
                    key={rec.id} 
                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                      isResolved 
                        ? 'opacity-60 bg-emerald-500/5 border-emerald-500/30' 
                        : dark ? 'bg-slate-800/80 border-indigo-500/20 hover:border-indigo-500/50' : 'bg-white border-slate-300 shadow-sm hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-extrabold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                            {rec.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                            rec.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            rec.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {rec.priority}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            Confidence: {rec.confidence}
                          </span>
                          <span className={`text-xs font-bold ml-auto ${dark ? 'text-slate-300' : 'text-slate-900'}`}>{rec.category}</span>
                        </div>

                        <h4 className={`text-base font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>{rec.title}</h4>
                        <p className={`text-xs font-bold ${dark ? 'text-slate-200' : 'text-slate-900'}`}>{rec.description}</p>
                        <p className="text-[11px] text-indigo-300 font-mono">Target Node: <strong>{rec.outlet}</strong> • Projected Impact: <span className="text-emerald-400 font-extrabold">{rec.impact}</span></p>
                      </div>

                      <div className="shrink-0 w-full md:w-auto flex justify-end">
                        {isResolved ? (
                          <span className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 w-full md:w-auto justify-center">
                            <CheckCircle2 size={16} /> Action Executed Successfully
                          </span>
                        ) : (
                          <button
                            disabled={isExecuting}
                            onClick={() => handleExecuteRecommendation(rec.id)}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-extrabold rounded-xl shadow-lg transition cursor-pointer w-full md:w-auto disabled:opacity-50"
                          >
                            {isExecuting ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Deploying AI Protocol...</span>
                              </>
                            ) : (
                              <>
                                <Zap size={14} />
                                <span>Execute Recommendation</span>
                                <ArrowRight size={14} />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ROW 1: MARKETING SPEND VS REVENUE & REGIONAL REVENUE */}
      {(activeTab === "Unified" || activeTab === "Marketing" || activeTab === "BI") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Item 1: Channel Spend vs Revenue */}
          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
                <BarChart3 size={16} className="text-indigo-600 dark:text-indigo-400" /> Channel Spend vs Revenue Visualization
              </h3>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-extrabold">Avg ROAS: 3.72x</span>
            </div>

            <div className="space-y-4 pt-1">
              {marketingData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-extrabold ${dark ? 'text-slate-200' : 'text-slate-950'}`}>{item.channel}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">Spend: <strong className="text-rose-600 dark:text-rose-400">{item.spendLabel}</strong> | Rev: <strong className="text-emerald-700 dark:text-emerald-400">{item.revLabel}</strong></span>
                  </div>
                  <div className={`w-full rounded-full h-2.5 overflow-hidden ${dark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                    <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.ratio}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-5 p-5 rounded-xl border ${dark ? 'bg-slate-900/70 border-slate-700/80' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${dark ? 'text-indigo-400' : 'text-indigo-800'}`}>Channel ROI Multiplier & Comparison</span>
                  <span className={`text-[11px] font-bold mt-0.5 block ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Enlarged view — Higher multiplier indicates better return per rupee spent</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold shadow-sm">Live telemetry</span>
              </div>

              <div className="grid grid-cols-4 gap-4 items-end h-52 pt-8 pb-3 border-b border-slate-200 dark:border-slate-700/50 px-2">
                {marketingData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40 shadow-sm">
                      {d.roas}
                    </span>
                    <div className="w-full flex items-end justify-center gap-2 h-32">
                      <div className="w-7 bg-rose-500 rounded-t-md transition-all duration-300 shadow" style={{ height: `${(d.spend / 50000) * 100}%` }} title={`Spend: ${d.spendLabel}`}></div>
                      <div className="w-7 bg-emerald-500 rounded-t-md transition-all duration-300 shadow" style={{ height: `${(d.rev / 250000) * 100}%` }} title={`Revenue: ${d.revLabel}`}></div>
                    </div>
                    <span className={`text-xs truncate w-full text-center font-extrabold pt-1.5 ${dark ? 'text-slate-200' : 'text-slate-950'}`}>{d.channel}</span>
                  </div>
                ))}
              </div>

              <div className={`flex flex-wrap justify-between items-center text-[11px] pt-3 font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Marketing Spend</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Revenue Generated</span>
                </div>
                <span>Scale: 1x to 6.25x Return</span>
              </div>
            </div>

          </div>

          {/* Item 2: Regional Gross Revenue Contribution */}
          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
                <PieChart size={16} className="text-indigo-600 dark:text-indigo-400" /> Regional Gross Revenue Contribution
              </h3>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">Velocity: +16.4%</span>
            </div>

            <div className="space-y-4 pt-1">
              {[
                { region: "South Region Cluster (42%)", amount: "₹5.60L", width: "85%", color: "bg-indigo-600" },
                { region: "North Region Hub (28%)", amount: "₹3.74L", width: "65%", color: "bg-amber-500" },
                { region: "West Region Flagships (20%)", amount: "₹2.67L", width: "45%", color: "bg-rose-500" },
                { region: "East Region Outlets (10%)", amount: "₹1.33L", width: "25%", color: "bg-emerald-500" }
              ].map((reg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-extrabold ${dark ? 'text-slate-200' : 'text-slate-950'}`}>{reg.region}</span>
                    <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-300">{reg.amount}</span>
                  </div>
                  <div className={`w-full rounded-full h-2.5 overflow-hidden ${dark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                    <div className={`h-2.5 rounded-full ${reg.color}`} style={{ width: reg.width }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-5 p-5 rounded-xl border ${dark ? 'bg-slate-900/70 border-slate-700/80' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${dark ? 'text-indigo-400' : 'text-indigo-800'}`}>Regional Distribution Share</span>
                  <span className={`text-[11px] font-bold mt-0.5 block ${dark ? 'text-slate-300' : 'text-slate-900'}`}>Enlarged view — Gross revenue breakdown across all hubs</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold shadow-sm">Total: ₹13.34L</span>
              </div>

              <div className="flex items-center justify-around h-48 pt-2 pb-2 border-b border-slate-200 dark:border-slate-700/50 px-2">
                <div className="space-y-3 text-sm">
                  {regionalData.map((r, i) => (
                    <div key={i} className="flex items-center justify-between gap-6">
                      <span className={`flex items-center gap-2.5 font-extrabold ${dark ? 'text-slate-200' : 'text-slate-950'}`}>
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: r.hex }}></span>
                        {r.region}
                      </span>
                      <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-300 text-base">{r.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-300 dark:text-slate-700" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#4f46e5" strokeWidth="4" strokeDasharray="42, 58" strokeDashoffset="0" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#f59e0b" strokeWidth="4" strokeDasharray="28, 72" strokeDashoffset="-42" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#f43f5e" strokeWidth="4" strokeDasharray="20, 80" strokeDashoffset="-70" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path stroke="#10b981" strokeWidth="4" strokeDasharray="10, 90" strokeDashoffset="-90" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-extrabold block text-slate-950 dark:text-white">₹13.34L</span>
                    <span className={`text-[10px] font-mono font-bold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>Gross Total</span>
                  </div>
                </div>
              </div>

              <div className={`flex justify-between items-center text-[11px] pt-3 font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Regional Telemetry Sync</span>
                <span>4 Active Hub Clusters</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ROW 2: OUTLET LEADERBOARD & INVENTORY STOCK COVER */}
      {(activeTab === "Unified" || activeTab === "Outlet" || activeTab === "Inventory") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
                <Store size={16} className="text-indigo-600 dark:text-indigo-400" /> Outlet Performance Leaderboard
              </h3>
              <span className={`text-xs font-mono font-extrabold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>9 Monitored Hubs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b ${dark ? 'text-slate-300 border-slate-700/40' : 'text-slate-900 font-extrabold border-slate-300'}`}>
                  <tr>
                    <th className="pb-2 px-3 font-bold">RANK</th>
                    <th className="pb-2 px-3 font-bold">OUTLET NAME</th>
                    <th className="pb-2 px-3 font-bold">REGION</th>
                    <th className="pb-2 px-3 font-bold">REVENUE</th>
                    <th className="pb-2 px-3 font-bold">HEALTH</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${dark ? 'divide-slate-700/30 text-slate-200' : 'divide-slate-300 text-slate-950 font-bold'}`}>
                  {outletData.slice(0, 4).map((o, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-mono text-indigo-500 dark:text-indigo-400 font-extrabold">#{idx + 1}</td>
                      <td className={`py-2.5 px-3 font-extrabold ${dark ? 'text-white' : 'text-slate-950'}`}>{o.name} Store</td>
                      <td className={`py-2.5 px-3 font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>{o.region}</td>
                      <td className="py-2.5 px-3 font-mono font-extrabold">{o.revLabel}</td>
                      <td className="py-2.5 px-3"><span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{o.health}/100</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5mm' }} className={`p-4 rounded-xl border ${dark ? 'bg-slate-900/70 border-slate-700/80' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${dark ? 'text-indigo-400' : 'text-indigo-800'}`}>Top Hub Tiered Health & Revenue Milestones</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold shadow-sm">Milestone Track</span>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                {outletData.map((o, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border flex flex-col justify-between ${dark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-300 shadow-sm'}`}>
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-indigo-400 font-extrabold mb-1">
                        <span>#{i+1}</span>
                        <span className="font-extrabold text-emerald-400 text-[11px]">{o.health}pts</span>
                      </div>
                      {/* Wrapped outlet name so full names break cleanly without ellipsis */}
                      <div className={`text-[11px] font-extrabold leading-tight whitespace-normal break-words ${dark ? 'text-white' : 'text-slate-950'}`}>
                        {o.name}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className={`flex justify-between text-[10px] font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                        <span>Rev</span>
                        <span className="font-mono font-extrabold text-indigo-400 text-[10px]">{o.revLabel}</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${o.health}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`flex justify-between items-center text-xs pt-2 font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                <span>Milestone Node Verification</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">All Nodes Operational</span>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
                <Boxes size={16} className="text-indigo-600 dark:text-indigo-400" /> Inventory Stock Cover & Risk
              </h3>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-extrabold">Avg Stock Cover: 4.2x</span>
            </div>

            <div className="space-y-3 pt-1">
              {inventoryData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-extrabold ${dark ? 'text-slate-200' : 'text-slate-950'}`}>{item.name}</span>
                    <span className={`font-mono font-extrabold ${item.status === 'Critical' ? 'text-rose-500' : item.status === 'Low' ? 'text-amber-500' : 'text-emerald-400'}`}>
                      {item.coverLabel} Cover ({item.status})
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${(item.cover / 7) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-4 p-4 rounded-xl border ${dark ? 'bg-slate-900/70 border-slate-700/80' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${dark ? 'text-indigo-400' : 'text-indigo-800'}`}>SKU Safety Stock Pillar Distribution</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-extrabold shadow-sm">3 SKUs at Risk</span>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                {inventoryData.map((inv, i) => (
                  <div key={i} className={`p-2 rounded-xl border flex flex-col items-center text-center justify-between ${dark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-300 shadow-sm'}`}>
                    <span className="text-[10px] font-mono font-extrabold text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 mb-1.5">
                      {inv.coverLabel}
                    </span>
                    <div className={`w-full h-14 rounded-lg relative overflow-hidden flex items-end justify-center mb-1.5 ${dark ? 'bg-slate-700/30' : 'bg-slate-200'}`}>
                      <div className={`w-full rounded-t ${inv.color}`} style={{ height: `${(inv.cover / 7) * 100}%` }}></div>
                    </div>
                    {/* Wrapped SKU name so full names break cleanly without ellipsis */}
                    <span className={`text-[10px] font-mono font-bold leading-tight whitespace-normal break-words w-full ${dark ? 'text-slate-200' : 'text-slate-900'}`}>
                      {inv.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className={`flex justify-between items-center text-[11px] pt-2 font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-rose-500"></span> Critical &lt; 2.0x</span>
                <span className="text-emerald-500 font-extrabold">Optimal &gt; 4.0x</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROW 3: WORKFORCE TRENDS & AUDIT BREAKDOWN */}
      {(activeTab === "Unified" || activeTab === "Workforce" || activeTab === "Audit") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
                <Users size={16} className="text-indigo-600 dark:text-indigo-400" /> Weekly Attendance vs Productivity Trend
              </h3>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">Avg Attendance: 95%</span>
            </div>

            <div className="space-y-3 pt-1">
              {workforceData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className={`w-8 font-extrabold font-mono ${dark ? 'text-slate-300' : 'text-slate-900'}`}>{d.day}</span>
                  <div className="flex-1 mx-3 space-y-1">
                    <div className={`w-full h-1.5 rounded-full overflow-hidden flex ${dark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
                      <div className="bg-indigo-600 h-full" style={{ width: `${d.attendance}%` }}></div>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden flex ${dark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
                      <div className="bg-purple-500 h-full" style={{ width: `${d.productivity}%` }}></div>
                    </div>
                  </div>
                  <div className={`w-20 text-right font-mono text-[11px] font-extrabold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                    <span className="text-indigo-400">{d.attendance}%</span> / <span className="text-purple-400">{d.productivity}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-4 p-4 rounded-xl border ${dark ? 'bg-slate-900/70 border-slate-700/80' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${dark ? 'text-indigo-400' : 'text-indigo-800'}`}>Rolling Efficiency Sparkline Wave</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold shadow-sm">7-Day Trend Curve</span>
              </div>
              <div className="h-36 pt-4 pb-2 border-b border-slate-200 dark:border-slate-700/50 relative flex items-end justify-between px-2">
                {workforceData.map((w, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end flex-1">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      <span className="text-[10px] font-mono font-extrabold text-indigo-300">{w.attendance}%</span>
                    </div>
                    <div className={`w-full flex justify-center items-end h-20 rounded-t border-t ${dark ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-100 border-indigo-300'}`}>
                      <div className="w-3 bg-indigo-600 rounded-t" style={{ height: `${w.attendance}%` }}></div>
                    </div>
                    <span className={`text-[10px] font-mono font-extrabold ${dark ? 'text-slate-200' : 'text-slate-900'}`}>{w.day}</span>
                  </div>
                ))}
              </div>
              <div className={`flex justify-between items-center text-[11px] pt-2 font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-indigo-600"></span> Attendance Wave Curve</span>
                <span className="text-emerald-500 font-extrabold">Peak Performance: Saturday (99%)</span>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/50">
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
                <ShieldAlert size={16} className="text-indigo-600 dark:text-indigo-400" /> Audit Issue Severity Breakdown
              </h3>
              <span className="text-xs font-mono text-rose-500 font-extrabold">12 Total Exceptions</span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center pt-1">
              <div className={`p-3 rounded-xl border ${dark ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50 border-rose-300 shadow-sm'}`}>
                <div className="text-[10px] text-rose-500 uppercase font-extrabold">Critical</div>
                <div className="text-xl font-extrabold text-rose-500 mt-1">1</div>
              </div>
              <div className={`p-3 rounded-xl border ${dark ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50 border-amber-300 shadow-sm'}`}>
                <div className="text-[10px] text-amber-500 uppercase font-extrabold">High</div>
                <div className="text-xl font-extrabold text-amber-500 mt-1">2</div>
              </div>
              <div className={`p-3 rounded-xl border ${dark ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50 border-blue-300 shadow-sm'}`}>
                <div className="text-[10px] text-blue-400 uppercase font-extrabold">Medium</div>
                <div className="text-xl font-extrabold text-blue-500 mt-1">4</div>
              </div>
              <div className={`p-3 rounded-xl border ${dark ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50 border-emerald-300 shadow-sm'}`}>
                <div className="text-[10px] text-emerald-400 uppercase font-extrabold">Low</div>
                <div className="text-xl font-extrabold text-emerald-500 mt-1">5</div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {auditData.map((aud, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-extrabold ${dark ? 'text-slate-200' : 'text-slate-950'}`}>{aud.label}</span>
                    <span className="font-mono font-extrabold text-emerald-400">{aud.score}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className={`${aud.color} h-full rounded-full`} style={{ width: `${aud.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-4 p-4 rounded-xl border ${dark ? 'bg-slate-900/70 border-slate-700/80' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${dark ? 'text-indigo-400' : 'text-indigo-800'}`}>Exception Severity Weight Spectrum</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold shadow-sm">12 Exceptions Logged</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3 pt-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <div className={`p-3 rounded-xl border text-center ${dark ? 'bg-rose-950/30 border-rose-900/50' : 'bg-rose-100 border-rose-300'}`}>
                  <span className="text-xs font-extrabold text-rose-500 block mb-1">1 Case</span>
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-extrabold">Critical Risk</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${dark ? 'bg-amber-950/30 border-amber-900/50' : 'bg-amber-100 border-amber-300'}`}>
                  <span className="text-xs font-extrabold text-amber-500 block mb-1">2 Cases</span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-extrabold">High Priority</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${dark ? 'bg-blue-950/30 border-blue-900/50' : 'bg-blue-100 border-blue-300'}`}>
                  <span className="text-xs font-extrabold text-blue-500 block mb-1">4 Cases</span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-extrabold">Medium Risk</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${dark ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-emerald-100 border-emerald-300'}`}>
                  <span className="text-xs font-extrabold text-emerald-500 block mb-1">5 Cases</span>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-extrabold">Low Concern</span>
                </div>
              </div>

              <div className={`flex justify-between items-center text-[11px] pt-2 font-bold ${dark ? 'text-slate-300' : 'text-slate-900'}`}>
                <span>Total Audit Compliance Score</span>
                <span className="text-emerald-400 font-extrabold">94.2% Operational Index</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}