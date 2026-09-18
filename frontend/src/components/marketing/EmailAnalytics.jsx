import React from 'react';
import { Mail, CheckCircle2, MousePointer, AlertCircle, UserMinus, ShieldAlert, Clock } from 'lucide-react';
import { EMAIL_ANALYTICS } from '../../mock/marketingData';

export const EmailAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Automated Email CRM & Drip Campaign Analytics
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Deliverability monitoring, open rates, CTRs, and recipient engagement time heatmaps.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="glass-card bg-white dark:bg-transparent p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Sent</span>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{EMAIL_ANALYTICS.sent}</div>
        </div>

        <div className="glass-card bg-white dark:bg-transparent p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Delivered</span>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{EMAIL_ANALYTICS.delivered}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{EMAIL_ANALYTICS.deliveryRate} Rate</span>
        </div>

        <div className="glass-card bg-white dark:bg-transparent p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Opened</span>
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">{EMAIL_ANALYTICS.opened}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{EMAIL_ANALYTICS.openRate} Open Rate</span>
        </div>

        <div className="glass-card bg-white dark:bg-transparent p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Clicked</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{EMAIL_ANALYTICS.clicked}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{EMAIL_ANALYTICS.clickRate} Click Rate</span>
        </div>

        <div className="glass-card bg-white dark:bg-transparent p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Bounced</span>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">{EMAIL_ANALYTICS.bounced}</div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">1.5% Bounce Rate</span>
        </div>

        <div className="glass-card bg-white dark:bg-transparent p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Unsubscribed</span>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-300 mt-1">{EMAIL_ANALYTICS.unsubscribed}</div>
          <span className="text-[10px] text-slate-500 font-semibold">0.24% Rate</span>
        </div>

        <div className="glass-card bg-white dark:bg-transparent p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Spam Reports</span>
          <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">{EMAIL_ANALYTICS.spamReports}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Under 0.05% Cap</span>
        </div>
      </div>

      {/* Hourly Open Heatmap */}
      <div className="glass-card bg-white dark:bg-transparent rounded-xl p-5 border border-slate-200 dark:border-slate-700/60 space-y-3 shadow-md dark:shadow-none">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Recipient Hourly Open Rate Heatmap (%)
        </h3>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {EMAIL_ANALYTICS.heatmap.map((item) => (
            <div key={item.hour} className="text-center space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.hour}</span>
              <div
                className="h-20 rounded-lg flex items-center justify-center font-bold text-xs transition-transform hover:scale-105 shadow-sm"
                style={{
                  backgroundColor: `rgba(99, 102, 241, ${item.openPct / 80})`,
                  color: item.openPct > 40 ? '#ffffff' : 'inherit',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                }}
              >
                <span className={item.openPct > 40 ? 'text-white' : 'text-slate-600 dark:text-slate-300'}>{item.openPct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};