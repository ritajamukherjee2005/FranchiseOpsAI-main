import React, { useState, useEffect } from "react";
import { 
  Settings, Bell, Shield, Globe, Sliders, CheckCircle2, Smartphone, Mail, MessageSquare, Save, RefreshCw, Database, Cpu, MailCheck, ShieldAlert, Lock, Clock, Radio, Power 
} from "lucide-react";

export default function SettingsPage({ dark = true }) {
  // Settings state configurations loaded from localStorage if available
  const [emailAlerts, setEmailAlerts] = useState(() => JSON.parse(localStorage.getItem("franchise_emailAlerts")) ?? true);
  const [smsAlerts, setSmsAlerts] = useState(() => JSON.parse(localStorage.getItem("franchise_smsAlerts")) ?? true);
  const [pushAlerts, setPushAlerts] = useState(() => JSON.parse(localStorage.getItem("franchise_pushAlerts")) ?? true);
  const [criticalThreshold, setCriticalThreshold] = useState(() => localStorage.getItem("franchise_criticalThreshold") || "15");
  const [highThreshold, setHighThreshold] = useState(() => localStorage.getItem("franchise_highThreshold") || "120");
  const [autoEscalate, setAutoEscalate] = useState(() => JSON.parse(localStorage.getItem("franchise_autoEscalate")) ?? true);
  
  // Advanced Controlling Facilities State
  const [auditArchiveFreq, setAuditArchiveFreq] = useState(() => localStorage.getItem("franchise_auditArchiveFreq") || "weekly");
  const [dailyDigest, setDailyDigest] = useState(() => JSON.parse(localStorage.getItem("franchise_dailyDigest")) ?? true);
  const [aiRootCause, setAiRootCause] = useState(() => JSON.parse(localStorage.getItem("franchise_aiRootCause")) ?? true);
  const [retryLimit, setRetryLimit] = useState(() => localStorage.getItem("franchise_retryLimit") || "3");

  // Newly Added Facilities State
  const [autoLockdown, setAutoLockdown] = useState(() => JSON.parse(localStorage.getItem("franchise_autoLockdown")) ?? false);
  const [fallbackChannel, setFallbackChannel] = useState(() => localStorage.getItem("franchise_fallbackChannel") || "whatsapp");
  const [syncInterval, setSyncInterval] = useState(() => localStorage.getItem("franchise_syncInterval") || "realtime");
  const [quietHours, setQuietHours] = useState(() => JSON.parse(localStorage.getItem("franchise_quietHours")) ?? false);

  // Regional scopes
  const [regions, setRegions] = useState(() => {
    const savedRegions = localStorage.getItem("franchise_regions");
    return savedRegions ? JSON.parse(savedRegions) : { south: true, west: true, north: true, east: true };
  });

  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    
    // Save all configurations to localStorage
    localStorage.setItem("franchise_emailAlerts", JSON.stringify(emailAlerts));
    localStorage.setItem("franchise_smsAlerts", JSON.stringify(smsAlerts));
    localStorage.setItem("franchise_pushAlerts", JSON.stringify(pushAlerts));
    localStorage.setItem("franchise_criticalThreshold", criticalThreshold);
    localStorage.setItem("franchise_highThreshold", highThreshold);
    localStorage.setItem("franchise_autoEscalate", JSON.stringify(autoEscalate));
    localStorage.setItem("franchise_auditArchiveFreq", auditArchiveFreq);
    localStorage.setItem("franchise_dailyDigest", JSON.stringify(dailyDigest));
    localStorage.setItem("franchise_aiRootCause", JSON.stringify(aiRootCause));
    localStorage.setItem("franchise_retryLimit", retryLimit);
    localStorage.setItem("franchise_autoLockdown", JSON.stringify(autoLockdown));
    localStorage.setItem("franchise_fallbackChannel", fallbackChannel);
    localStorage.setItem("franchise_syncInterval", syncInterval);
    localStorage.setItem("franchise_quietHours", JSON.stringify(quietHours));
    localStorage.setItem("franchise_regions", JSON.stringify(regions));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={`p-6 min-h-screen space-y-6 transition-colors duration-300 ${dark ? 'bg-slate-950 text-white' : 'bg-indigo-50/30 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className={`flex flex-col xl:flex-row justify-between items-start xl:items-center pb-4 border-b gap-4 ${dark ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Control Center Settings & Configurations</h1>
          </div>
          <p className="text-xs mt-1 font-medium opacity-80">
            Manage multi-channel notification routing preferences, SLA escalation thresholds, and regional oversight rules[cite: 1].
          </p>
        </div>

        <div>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl animate-pulse">
              <CheckCircle2 size={14} /> Settings Saved & Persisted Successfully
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-5xl">
        
        {/* SECTION 1: NOTIFICATION CHANNEL PREFERENCES */}
        <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
          <div className="flex items-center gap-2 pb-3 border-b border-indigo-500/20">
            <Bell size={18} className="text-indigo-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">1. Multi-Channel Communication Preferences</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${dark ? 'bg-indigo-950/40 border-indigo-500/20 hover:bg-indigo-900/40' : 'bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50'}`}>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400" />
                <div>
                  <div className="text-xs font-bold">Email Notifications</div>
                  <div className="text-[10px] opacity-70">Detailed reports & summaries[cite: 1]</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts} 
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>

            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${dark ? 'bg-indigo-950/40 border-indigo-500/20 hover:bg-indigo-900/40' : 'bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50'}`}>
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-amber-400" />
                <div>
                  <div className="text-xs font-bold">SMS Urgent Alerts</div>
                  <div className="text-[10px] opacity-70">Critical high-priority notices[cite: 1]</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={smsAlerts} 
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>

            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${dark ? 'bg-indigo-950/40 border-indigo-500/20 hover:bg-indigo-900/40' : 'bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50'}`}>
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-purple-400" />
                <div>
                  <div className="text-xs font-bold">Mobile App Push</div>
                  <div className="text-[10px] opacity-70">Real-time device routing[cite: 1]</div>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={pushAlerts} 
                onChange={(e) => setPushAlerts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* SECTION 2: SLA THRESHOLD CUSTOMIZATION */}
        <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
          <div className="flex items-center gap-2 pb-3 border-b border-indigo-500/20">
            <Sliders size={18} className="text-indigo-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">2. SLA Escalation Threshold Controls</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            <div className="space-y-2">
              <label className="block font-bold opacity-90">Critical Incident Breach Window (Minutes)</label>
              <select 
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-semibold outline-none cursor-pointer ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
              >
                <option value="10">10 Minutes (Aggressive)</option>
                <option value="15">15 Minutes (Standard Protocol)</option>
                <option value="30">30 Minutes (Relaxed)</option>
              </select>
              <p className="text-[10px] opacity-70">Time allowed before unacknowledged critical events escalate to regional directors[cite: 1].</p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold opacity-90">High Priority Resolution Window (Minutes)</label>
              <select 
                value={highThreshold}
                onChange={(e) => setHighThreshold(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-semibold outline-none cursor-pointer ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
              >
                <option value="60">60 Minutes (1 Hour)</option>
                <option value="120">120 Minutes (2 Hours)</option>
                <option value="240">240 Minutes (4 Hours)</option>
              </select>
              <p className="text-[10px] opacity-70">Resolution threshold for checklist overtimes and inventory audit discrepancies[cite: 1].</p>
            </div>
          </div>

          <div className="pt-2">
            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <div>
                <div className="text-xs font-bold">Automated Secondary Escalation Routing</div>
                <div className="text-[10px] opacity-70">Automatically assign supervisors when primary owners miss deadlines[cite: 1].</div>
              </div>
              <input 
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* SECTION 3: ADVANCED WORKFLOW & TELEMETRY CONTROLS */}
        <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
          <div className="flex items-center gap-2 pb-3 border-b border-indigo-500/20">
            <Cpu size={18} className="text-indigo-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">3. Advanced Workflow & Telemetry Controls</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
            <div className="space-y-2">
              <label className="block font-bold opacity-90">Audit Log Archive Frequency</label>
              <select 
                value={auditArchiveFreq}
                onChange={(e) => setAuditArchiveFreq(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-semibold outline-none cursor-pointer ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
              >
                <option value="daily">Daily Compression</option>
                <option value="weekly">Weekly Archive Cycle</option>
                <option value="monthly">Monthly Deep Archive</option>
              </select>
              <p className="text-[10px] opacity-70">Frequency for packaging historical dispatch telemetry logs.</p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold opacity-90">Max Webhook / Dispatch Retry Limit</label>
              <select 
                value={retryLimit}
                onChange={(e) => setRetryLimit(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-semibold outline-none cursor-pointer ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
              >
                <option value="1">1 Attempt Only</option>
                <option value="3">3 Retries (Standard)</option>
                <option value="5">5 Retries (High Reliability)</option>
              </select>
              <p className="text-[10px] opacity-70">Maximum failure retry attempts for SMS and Push dispatch gateways.</p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold opacity-90">Secondary Fallback Notification Channel</label>
              <select 
                value={fallbackChannel}
                onChange={(e) => setFallbackChannel(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-semibold outline-none cursor-pointer ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
              >
                <option value="whatsapp">WhatsApp Business API Webhook</option>
                <option value="slack">Slack Operational Channel Bot</option>
                <option value="pagerduty">PagerDuty Incident Dispatch</option>
              </select>
              <p className="text-[10px] opacity-70">Backup alert transmission method if primary SMS/Push gateways fail.</p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold opacity-90">Franchise Data Sync Polling Interval</label>
              <select 
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-semibold outline-none cursor-pointer ${dark ? 'bg-indigo-950/60 border-indigo-500/30 text-white' : 'bg-indigo-50/50 border-indigo-300 text-slate-900'}`}
              >
                <option value="realtime">Real-Time WebSockets (Recommended)</option>
                <option value="5min">Every 5 Minutes (Polling)</option>
                <option value="15min">Every 15 Minutes (Low Bandwidth)</option>
              </select>
              <p className="text-[10px] opacity-70">Frequency of telemetry data updates from the 16 network hubs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <div className="flex items-center gap-3">
                <MailCheck size={18} className="text-emerald-400" />
                <div>
                  <div className="text-xs font-bold">Automated Daily Digest Email</div>
                  <div className="text-[10px] opacity-70">Send summary report to leadership at 08:00 AM</div>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>

            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <div className="flex items-center gap-3">
                <ShieldAlert size={18} className="text-rose-400" />
                <div>
                  <div className="text-xs font-bold">AI-Assisted Root Cause Diagnosis</div>
                  <div className="text-[10px] opacity-70">Automatically analyze critical anomalies during breaches</div>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={aiRootCause}
                onChange={(e) => setAiRootCause(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>

            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-amber-400" />
                <div>
                  <div className="text-xs font-bold">SLA Breach Auto-Lockdown Mode</div>
                  <div className="text-[10px] opacity-70">Freeze non-critical POS updates on unresolved critical breaches</div>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={autoLockdown}
                onChange={(e) => setAutoLockdown(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>

            <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-cyan-400" />
                <div>
                  <div className="text-xs font-bold">Quiet Hours Notification Suppressor</div>
                  <div className="text-[10px] opacity-70">Suppress non-urgent alerts between 11 PM and 6 AM</div>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={quietHours}
                onChange={(e) => setQuietHours(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* SECTION 4: REGIONAL HUB SCOPE */}
        <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${dark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200'}`}>
          <div className="flex items-center gap-2 pb-3 border-b border-indigo-500/20">
            <Globe size={18} className="text-indigo-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider">4. Regional Network Hub Visibility Scope (16 Outlets)[cite: 1]</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <span className="text-xs font-bold">South Region</span>
              <input type="checkbox" checked={regions.south} onChange={(e) => setRegions({...regions, south: e.target.checked})} className="accent-indigo-600" />
            </label>
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <span className="text-xs font-bold">West Region</span>
              <input type="checkbox" checked={regions.west} onChange={(e) => setRegions({...regions, west: e.target.checked})} className="accent-indigo-600" />
            </label>
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <span className="text-xs font-bold">North Region</span>
              <input type="checkbox" checked={regions.north} onChange={(e) => setRegions({...regions, north: e.target.checked})} className="accent-indigo-600" />
            </label>
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${dark ? 'bg-indigo-950/40 border-indigo-500/20' : 'bg-indigo-50/40 border-indigo-200'}`}>
              <span className="text-xs font-bold">East Region</span>
              <input type="checkbox" checked={regions.east} onChange={(e) => setRegions({...regions, east: e.target.checked})} className="accent-indigo-600" />
            </label>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
          >
            <Save size={16} />
            <span>Save Configuration Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}