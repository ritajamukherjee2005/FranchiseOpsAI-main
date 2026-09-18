import React, { useState, useEffect } from 'react';

export default function IntelligenceEnginePage({ dark = true }) {
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState('Mumbai — Downtown Flagship');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [hoveredDay, setHoveredDay] = useState(3);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // All 16 franchise network locations enlisted
  const outlets = [
    'Mumbai — Downtown Flagship',
    'Bengaluru – JP Nagar',
    'Bengaluru – Indiranagar',
    'Hyderabad – HITEC City',
    'Chennai — Anna Nagar Flagship',
    'New Delhi — Connaught Place',
    'Kolkata — Salt Lake Sector V',
    'Pune — Viman Nagar',
    'Jaipur — C-Scheme',
    'Kochi — Marine Drive',
    'Madurai — Madurai Junction',
    'Lucknow — Hazratganj',
    'Ahmedabad — SG Highway',
    'Nagpur — Sitabuldi',
    'Chandigarh — Sector 17',
    'Surat — Vesu'
  ];

  // Dynamic Data Generator to guarantee wildly different, perfectly synced data for ANY branch selected
  const getBranchData = (outletName) => {
    const idx = outlets.indexOf(outletName) >= 0 ? outlets.indexOf(outletName) : 0;
    const city = outletName.split(/ — | – /)[0] || outletName;

    // 1. MUMBAI PROFILE
    if (outletName.includes('Mumbai')) {
      return {
        healthScore: 93, status: 'OPTIMAL',
        weights: { 
          sales: { weight: 30, score: 97 }, 
          operations: { weight: 20, score: 98 }, 
          audit: { weight: 15, score: 94 }, 
          customer: { weight: 15, score: 94 }, 
          finance: { weight: 10, score: 100 }, 
          inventory: { weight: 10, score: 80 } 
        },
        weeklySales: [210000, 205000, 220000, 230000, 280000, 310000, 295000],
        networkRiskDistribution: [
          { location: 'Mumbai Flagship', probability: 12, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
          { location: 'Bengaluru JP Nagar', probability: 72, color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
          { location: 'Connaught Place', probability: 89, color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
          { location: 'Anna Nagar', probability: 28, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }
        ],
        risks: [
          { id: 1, title: 'Inventory Buffer Strain', probability: 48, severity: 'Medium', horizon: 'Next 14 days', description: 'Weekend footfall spikes creating stockout risk on premium SKUs.', rootCause: 'Supplier delivery window misaligned.' },
          { id: 2, title: 'Staff Shift Overtime', probability: 34, severity: 'Low', horizon: 'Next 7 days', description: 'Extended shifts during late-evening rush.', rootCause: 'Open positions pending recruitment.' },
          { id: 3, title: 'Minor Temp Log Gaps', probability: 22, severity: 'Low', horizon: 'Next 3 days', description: 'Incomplete digital temperature records.', rootCause: 'New staff unfamiliar with system.' }
        ],
        opportunities: [
          { id: 1, title: 'Late-Night D2C Expansion', estimatedGain: '+14% Rev', confidence: '91%', effort: 'Medium Effort', description: 'Untapped late-night order clustering within 3km.' },
          { id: 2, title: 'Weekend Beverage Potential', estimatedGain: '+12% Rev', confidence: '88%', effort: 'Low Effort', description: 'High footfall during weekends with strong demand.' },
          { id: 3, title: 'Loyalty Program Upsell', estimatedGain: '+8% Rev', confidence: '95%', effort: 'Low Effort', description: 'High volume of returning customers not enrolled in tier.' }
        ],
        recommendations: [
          { id: 1, priority: 'Priority 1 • Inventory', owner: 'Supply Lead', deadline: '3 Days', title: 'Increase Weekend Beverage Buffer by 15%', rationale: 'Eliminates peak-hour stockout flags and secures incremental weekend revenue.' },
          { id: 2, priority: 'Priority 2 • Facilities', owner: 'Store Manager', deadline: '5 Days', title: 'Schedule Preventative Maintenance', rationale: 'Avoids potential equipment failures during high-capacity shifts.' },
          { id: 3, priority: 'Priority 3 • Marketing', owner: 'CRM Manager', deadline: '7 Days', title: 'Activate Dormant Customer Campaign', rationale: 'Triggers automated discounts to Mumbai users who haven’t visited in 30+ days.' }
        ]
      };
    }

    // 2. BENGALURU JP NAGAR PROFILE
    if (outletName.includes('JP Nagar')) {
      return {
        healthScore: 72, status: 'WATCH',
        weights: { 
          sales: { weight: 30, score: 74 }, 
          operations: { weight: 20, score: 78 }, 
          audit: { weight: 15, score: 72 }, 
          customer: { weight: 15, score: 76 }, 
          finance: { weight: 10, score: 70 }, 
          inventory: { weight: 10, score: 62 } 
        },
        weeklySales: [140000, 135000, 130000, 145000, 160000, 180000, 165000],
        networkRiskDistribution: [
          { location: 'Bengaluru JP Nagar', probability: 28, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
          { location: 'Hyderabad HITEC', probability: 45, color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
          { location: 'Marine Drive', probability: 15, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
          { location: 'Mumbai Flagship', probability: 12, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }
        ],
        risks: [
          { id: 1, title: 'Inventory Shrinkage Variance', probability: 72, severity: 'High', horizon: 'Next 7 days', description: 'Manual write-off logs exceeding threshold.', rootCause: 'Delayed waste logging and untracked prep spoilage.' },
          { id: 2, title: 'Delivery SLA Breaches', probability: 81, severity: 'High', horizon: 'Immediate', description: 'High order cancellation rate from food delivery apps.', rootCause: 'Kitchen prep bottlenecks during the 1 PM lunch rush.' },
          { id: 3, title: 'Vendor Payment Delay', probability: 45, severity: 'Medium', horizon: 'Next 15 days', description: 'Outstanding invoices for fresh produce suppliers.', rootCause: 'Regional finance approval workflow bottleneck.' }
        ],
        opportunities: [
          { id: 1, title: 'Corporate Lunch Subscriptions', estimatedGain: '+18% Rev', confidence: '85%', effort: 'Medium Effort', description: 'High concentration of IT offices seeking team catering.' },
          { id: 2, title: 'Breakfast Combo Promotions', estimatedGain: '+9% Rev', confidence: '92%', effort: 'Low Effort', description: 'Early morning footfall is high but AOV is low.' },
          { id: 3, title: 'Aggregator Ads Optimization', estimatedGain: '+15% Rev', confidence: '78%', effort: 'Medium Effort', description: 'Competitors are outbidding on primary search keywords.' }
        ],
        recommendations: [
          { id: 1, priority: 'Critical • Operations', owner: 'Store Manager', deadline: '2 Days', title: 'Institute Dual-Signoff on Wastage Logs', rationale: 'Brings inventory shrinkage back into acceptable tolerance limits.' },
          { id: 2, priority: 'Priority 1 • Staffing', owner: 'Kitchen Lead', deadline: '4 Days', title: 'Reallocate Morning Prep Shifts', rationale: 'Ensures ingredients are prepped before the IT park corporate lunch rush.' },
          { id: 3, priority: 'Priority 2 • Finance', owner: 'Regional Ops', deadline: '10 Days', title: 'Audit Vendor Delivery Invoices', rationale: 'Identifies potential billing discrepancies causing local margin pressure.' }
        ]
      };
    }

    // 3. BENGALURU INDIRANAGAR PROFILE
    if (outletName.includes('Indiranagar')) {
      return {
        healthScore: 95, status: 'OPTIMAL',
        weights: { 
          sales: { weight: 30, score: 98 }, 
          operations: { weight: 20, score: 96 }, 
          audit: { weight: 15, score: 95 }, 
          customer: { weight: 15, score: 96 }, 
          finance: { weight: 10, score: 98 }, 
          inventory: { weight: 10, score: 88 } 
        },
        weeklySales: [250000, 245000, 260000, 280000, 340000, 390000, 350000],
        networkRiskDistribution: [
          { location: 'Indiranagar Central', probability: 5, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
          { location: 'Salt Lake Sector V', probability: 82, color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
          { location: 'Viman Nagar', probability: 55, color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
          { location: 'SG Highway', probability: 31, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' }
        ],
        risks: [
          { id: 1, title: 'Parking Congestion Feedback', probability: 41, severity: 'Medium', horizon: 'Weekends', description: 'Negative reviews citing lack of parking.', rootCause: 'High weekend volume overwhelming local infrastructure.' },
          { id: 2, title: 'Noise Level Complaints', probability: 28, severity: 'Low', horizon: 'Evenings', description: 'Dine-in customers complaining about acoustic echoes.', rootCause: 'Recent interior redesign removed soft furnishings.' },
          { id: 3, title: 'Premium Packaging Shortage', probability: 35, severity: 'Low', horizon: 'Next 10 days', description: 'Burn rate on premium takeaway boxes higher than expected.', rootCause: 'Surge in high-value delivery orders.' }
        ],
        opportunities: [
          { id: 1, title: 'Beverage Pairing Bundles', estimatedGain: '+16% Rev', confidence: '94%', effort: 'Low Effort', description: 'High dessert order conversion rate supports bundled beverage upsells.' },
          { id: 2, title: 'Valet Parking Tie-up', estimatedGain: '+5% CSAT', confidence: '99%', effort: 'Medium Effort', description: 'Partnering with local valet service for weekend evenings.' },
          { id: 3, title: 'Live Acoustic Evenings', estimatedGain: '+11% Rev', confidence: '82%', effort: 'High Effort', description: 'Pub-crowd overflow seeking relaxed pre-dinner environments.' }
        ],
        recommendations: [
          { id: 1, priority: 'Priority 1 • Revenue', owner: 'Marketing Lead', deadline: '5 Days', title: 'Launch Afternoon Coffee & Combo Pairing', rationale: 'Capitalizes on 2 PM - 5 PM co-working customer traffic in Indiranagar.' },
          { id: 2, priority: 'Priority 2 • Supply', owner: 'Inventory Lead', deadline: '7 Days', title: 'Expand Premium Pastry Assortment', rationale: 'Leverages high AOV trends observed at this specific location.' },
          { id: 3, priority: 'Priority 3 • HR', owner: 'Store Manager', deadline: '14 Days', title: 'Cross-Train Baristas on POS', rationale: 'Reduces queue wait times during Saturday evening pub-crowd peaks.' }
        ]
      };
    }

    // 4. HYDERABAD HITEC CITY PROFILE
    if (outletName.includes('HITEC')) {
      return {
        healthScore: 86, status: 'OPTIMAL',
        weights: { 
          sales: { weight: 30, score: 89 }, 
          operations: { weight: 20, score: 88 }, 
          audit: { weight: 15, score: 84 }, 
          customer: { weight: 15, score: 90 }, 
          finance: { weight: 10, score: 88 }, 
          inventory: { weight: 10, score: 76 } 
        },
        weeklySales: [180000, 195000, 190000, 205000, 230000, 170000, 160000], // IT park drops on weekends
        networkRiskDistribution: [
          { location: 'Hyderabad HITEC', probability: 14, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
          { location: 'Madurai Junction', probability: 92, color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
          { location: 'Connaught Place', probability: 89, color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
          { location: 'Sitabuldi', probability: 64, color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' }
        ],
        risks: [
          { id: 1, title: 'Staff Shift Overtime Fatigue', probability: 56, severity: 'Medium', horizon: 'Next 10 days', description: 'Extended shifts during late-evening tech park rush hours.', rootCause: 'Two open barista positions pending recruitment.' },
          { id: 2, title: 'Weekend Revenue Drop', probability: 88, severity: 'High', horizon: 'Ongoing', description: 'Massive sales drop on Sat/Sun.', rootCause: 'Tech park offices closed over the weekend.' },
          { id: 3, title: 'Espresso Machine Calibration', probability: 42, severity: 'Medium', horizon: 'Next 3 days', description: 'Slight dip in coffee quality scores.', rootCause: 'Heavy volume wearing down grinder burrs.' }
        ],
        opportunities: [
          { id: 1, title: 'Tech Hub Pre-Order Pickup', estimatedGain: '+12% Rev', confidence: '89%', effort: 'Low Effort', description: 'Mobile skip-the-line pre-ordering for time-sensitive office patrons.' },
          { id: 2, title: 'Office Catering Drop-offs', estimatedGain: '+22% Rev', confidence: '81%', effort: 'High Effort', description: 'Bulk delivery of coffee and pastries to corporate boardrooms.' },
          { id: 3, title: 'Weekend Delivery Radius Expansion', estimatedGain: '+8% Rev', confidence: '75%', effort: 'Medium Effort', description: 'Reach residential zones further away to offset weekend office closures.' }
        ],
        recommendations: [
          { id: 1, priority: 'Priority 1 • HR', owner: 'Regional HR', deadline: '6 Days', title: 'Expedite Barista Shift Onboarding', rationale: 'Reduces overtime burn and stabilizes peak-hour customer ticket times.' },
          { id: 2, priority: 'Priority 2 • Marketing', owner: 'Marketing Lead', deadline: '4 Days', title: 'Renew Corporate Campus Promo Codes', rationale: 'Re-engages nearby tech park employees for afternoon orders.' },
          { id: 3, priority: 'Priority 3 • Operations', owner: 'Store Manager', deadline: '2 Days', title: 'Calibrate Espresso Machines', rationale: 'Ensures optimal brew quality to maintain high CSAT scores among office workers.' }
        ]
      };
    }

    // 5. DYNAMIC FALLBACK FOR ALL OTHER 12 BRANCHES (Ensures entirely distinct numbers, bars, and texts for every click)
    const isCritical = ['New Delhi', 'Kolkata', 'Madurai'].includes(city);
    const isWatch = ['Pune', 'Jaipur', 'Lucknow', 'Nagpur', 'Chandigarh'].includes(city);
    
    let health = 88 - (idx % 10);
    let stat = 'OPTIMAL';
    let baseSales = 200000 + (idx * 5000);
    
    if (isCritical) {
      health = 38 + (idx % 12);
      stat = 'AT RISK';
      baseSales = 95000 + (idx * 2000);
    } else if (isWatch) {
      health = 62 + (idx % 15);
      stat = 'WATCH';
      baseSales = 140000 + (idx * 3000);
    }

    // Generate random-looking deterministic probabilities for the chart bars
    const p1 = (idx * 17) % 100;
    const p2 = (idx * 31) % 100;
    const p3 = (idx * 47) % 100;

    return {
      name: outletName,
      healthScore: health,
      status: stat,
      weights: {
        sales: { weight: 30, score: Math.min(100, health + (idx % 8)) },
        operations: { weight: 20, score: Math.min(100, health + 4) },
        audit: { weight: 15, score: Math.min(100, Math.max(10, health - 2)) },
        customer: { weight: 15, score: Math.min(100, health + 3) },
        finance: { weight: 10, score: Math.min(100, health + 5) },
        inventory: { weight: 10, score: Math.max(30, health - 6) }
      },
      weeklySales: [
        Math.round(baseSales * (0.85 + (idx % 3) * 0.05)),
        Math.round(baseSales * (0.90 - (idx % 2) * 0.04)),
        Math.round(baseSales * (0.95 + (idx % 4) * 0.02)),
        Math.round(baseSales * (1.00 + (idx % 5) * 0.03)),
        Math.round(baseSales * (1.20 + (idx % 3) * 0.06)),
        Math.round(baseSales * (1.35 - (idx % 2) * 0.05)),
        Math.round(baseSales * (1.25 + (idx % 4) * 0.04)),
      ],
      networkRiskDistribution: [
        { location: `${city} Outlet`, probability: Math.max(0, 100 - health), color: (100 - health) > 60 ? 'bg-rose-500' : (100 - health) > 30 ? 'bg-orange-500' : 'bg-emerald-500', text: (100 - health) > 60 ? 'text-rose-600 dark:text-rose-400' : (100 - health) > 30 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400' },
        { location: outlets[(idx + 1) % 16].split(/ — | – /)[0], probability: p1, color: p1 > 70 ? 'bg-rose-500' : p1 > 40 ? 'bg-orange-500' : 'bg-emerald-500', text: p1 > 70 ? 'text-rose-600 dark:text-rose-400' : p1 > 40 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400' },
        { location: outlets[(idx + 2) % 16].split(/ — | – /)[0], probability: p2, color: p2 > 70 ? 'bg-rose-500' : p2 > 40 ? 'bg-orange-500' : 'bg-emerald-500', text: p2 > 70 ? 'text-rose-600 dark:text-rose-400' : p2 > 40 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400' },
        { location: outlets[(idx + 3) % 16].split(/ — | – /)[0], probability: p3, color: p3 > 70 ? 'bg-rose-500' : p3 > 40 ? 'bg-orange-500' : 'bg-emerald-500', text: p3 > 70 ? 'text-rose-600 dark:text-rose-400' : p3 > 40 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400' }
      ],
      risks: [
        { id: 1, title: isCritical ? `Critical Revenue Drop in ${city}` : `${city} Stock Buffer Strain`, probability: isCritical ? 92 : 48 + (idx % 15), severity: isCritical ? 'Critical' : 'Medium', horizon: isCritical ? 'Immediate' : 'Next 14 days', description: isCritical ? `Sales volume has dropped significantly below the ${city} baseline.` : 'Weekend footfall spikes creating stockout risk on premium SKUs.', rootCause: isCritical ? 'Local competition combined with declining CSAT scores.' : 'Supplier delivery window misaligned with Friday peak demand.' },
        { id: 2, title: 'Compliance Audit Risk', probability: isCritical ? 88 : 34 + (idx % 20), severity: isCritical ? 'High' : 'Low', horizon: 'Next 5 days', description: 'Unresolved issues across safety and hygiene compliance modules.', rootCause: 'Staffing shortages leading to skipped maintenance logs.' },
        { id: 3, title: 'Cash Drawer Discrepancy', probability: 56 + (idx % 10), severity: 'Medium', horizon: 'Next 10 days', description: 'Unusual refund frequency detected during evening shifts.', rootCause: 'Unauthorized cashier overrides.' }
      ],
      opportunities: [
        { id: 1, title: `Late-Night Delivery in ${city}`, estimatedGain: `+${10 + (idx % 5)}% Rev`, confidence: `${85 + (idx % 10)}%`, effort: 'Low Effort', description: `Untapped late-night order clustering within a 3km delivery radius around ${city}.` },
        { id: 2, title: 'Weekend Beverage Potential', estimatedGain: `+${12 + (idx % 4)}% Rev`, confidence: '88%', effort: 'Low Effort', description: 'High footfall during weekends with strong untapped demand for premium drinks.' },
        { id: 3, title: 'Corporate Catering Expansion', estimatedGain: `+${15 + (idx % 6)}% Rev`, confidence: '85%', effort: 'Medium Effort', description: `High concentration of local offices in ${city} seeking structured team lunch catering.` }
      ],
      recommendations: [
        { id: 1, priority: isCritical ? 'Critical • Operations' : 'Priority 1 • Marketing', owner: isCritical ? 'Regional Ops' : 'Store Manager', deadline: isCritical ? '24 Hours' : `${(idx % 5) + 2} Days`, title: isCritical ? `Emergency Staffing Review for ${city}` : `Launch Geo-Targeted Ads for ${city}`, rationale: isCritical ? 'Addresses immediate compliance failures and acute understaffing.' : `Boosts local footfall by targeting within a 5km radius of the ${city} location.` },
        { id: 2, priority: 'Priority 2 • Staffing', owner: 'HR Lead', deadline: '7 Days', title: 'Optimize Weekend Roster', rationale: 'Aligns staff availability with expected peak hours.' },
        { id: 3, priority: 'Priority 3 • Procurement', owner: 'Supply Lead', deadline: '10 Days', title: `Audit Local Vendor Contracts in ${city}`, rationale: 'Ensures supplier SLAs are met and uncovers potential cost savings.' }
      ]
    };
  };

  useEffect(() => {
    setLoading(true);
    // Clearing data briefly creates a clean transition effect when selecting a new branch
    setIntelligenceData(null);
    const timer = setTimeout(() => {
      setIntelligenceData(getBranchData(selectedOutlet));
      setLoading(false);
    }, 450); // 450ms smooth transition delay
    return () => clearTimeout(timer);
  }, [selectedOutlet]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPTIMAL':
      case 'HEALTHY':
        return dark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'WATCH':
        return dark ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-amber-100 text-amber-700 border-amber-300';
      case 'AT RISK':
        return dark ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' : 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return dark ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-rose-100 text-rose-700 border-rose-300';
    }
  };

  const handleCopilotSubmit = (e) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;
    alert(`Supervisory Copilot query dispatched: "${copilotQuery}"`);
    setCopilotQuery('');
  };

  // Safe loading state prevents rendering errors before data is fully built
  if (loading || !intelligenceData) {
    return (
      <div className={`p-12 min-h-screen flex items-center justify-center ${dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold animate-pulse">Analyzing real-time agent telemetry for {selectedOutlet}...</p>
        </div>
      </div>
    );
  }

  const data = intelligenceData;

  // Fully synchronized dynamic vectors that update for every single branch instantly
  const dynamicVectors = [
    { name: 'Sales Velocity', score: data.weights.sales.score, status: data.weights.sales.score >= 85 ? 'Optimal' : data.weights.sales.score >= 60 ? 'Watch' : 'Critical', trend: data.weights.sales.score >= 85 ? '+4.2% vs last week' : data.weights.sales.score >= 60 ? '-1.8% vs last week' : '-6.5% vs last week', color: data.weights.sales.score >= 85 ? 'bg-emerald-500' : data.weights.sales.score >= 60 ? 'bg-amber-500' : 'bg-rose-500' },
    { name: 'Operations', score: data.weights.operations.score, status: data.weights.operations.score >= 85 ? 'Optimal' : data.weights.operations.score >= 60 ? 'Watch' : 'Critical', trend: data.weights.operations.score >= 85 ? '+2.1% vs last week' : 'Shift delay flags', color: data.weights.operations.score >= 85 ? 'bg-emerald-500' : data.weights.operations.score >= 60 ? 'bg-amber-500' : 'bg-rose-500' },
    { name: 'Audit Compliance', score: data.weights.audit.score, status: data.weights.audit.score >= 85 ? 'Optimal' : data.weights.audit.score >= 60 ? 'Stable' : 'Critical', trend: data.weights.audit.score >= 85 ? '0.0% stable' : 'Logs pending', color: data.weights.audit.score >= 85 ? 'bg-emerald-500' : data.weights.audit.score >= 60 ? 'bg-indigo-500' : 'bg-rose-500' },
    { name: 'Customer Satisfaction', score: data.weights.customer.score, status: data.weights.customer.score >= 85 ? 'Optimal' : data.weights.customer.score >= 60 ? 'Stable' : 'Critical', trend: data.weights.customer.score >= 85 ? '+1.5% rating up' : 'Review sentiment flag', color: data.weights.customer.score >= 85 ? 'bg-emerald-500' : data.weights.customer.score >= 60 ? 'bg-indigo-500' : 'bg-rose-500' },
    { name: 'Financial Health', score: data.weights.finance.score, status: data.weights.finance.score >= 85 ? 'Peak' : data.weights.finance.score >= 60 ? 'Watch' : 'Critical', trend: data.weights.finance.score >= 85 ? '+5.8% margins' : '-3.4% margin pressure', color: data.weights.finance.score >= 85 ? 'bg-emerald-500' : data.weights.finance.score >= 60 ? 'bg-amber-500' : 'bg-rose-500' },
    { name: 'Inventory Stability', score: data.weights.inventory.score, status: data.weights.inventory.score >= 85 ? 'Optimal' : data.weights.inventory.score >= 60 ? 'Watch' : 'Critical', trend: data.weights.inventory.score >= 85 ? 'Stock buffer intact' : '-4.1% buffer shrink', color: data.weights.inventory.score >= 85 ? 'bg-emerald-500' : data.weights.inventory.score >= 60 ? 'bg-amber-500' : 'bg-rose-500' }
  ];

  return (
    <div className={`p-6 min-h-screen space-y-6 transition-colors duration-300 ${dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* 1. Franchise AI Supervisory Copilot */}
      <div className={`border rounded-2xl p-4 shadow-sm transition-colors ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm">✨</span>
          <h2 className={`text-sm font-bold tracking-wide ${dark ? 'text-white' : 'text-slate-900'}`}>
            Franchise AI Supervisory Copilot
          </h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
            Natural Language Agent
          </span>
        </div>

        <form onSubmit={handleCopilotSubmit} className="flex gap-2">
          <input
            type="text"
            value={copilotQuery}
            onChange={(e) => setCopilotQuery(e.target.value)}
            placeholder="Ask e.g. 'Are all stores open right now?' or 'Which location has delayed opening times?'"
            className={`flex-1 border rounded-xl px-4 py-2.5 text-xs outline-none transition shadow-inner ${
              dark 
                ? 'bg-slate-950 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20"
          >
            Ask Copilot
          </button>
        </form>
      </div>

      {/* 2. Network Sales & Health Velocity Chart */}
      <div className={`border rounded-2xl p-6 shadow-sm transition-colors relative overflow-hidden ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className={`text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Network Sales & Health Velocity</h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time weekly aggregate telemetry for {selectedOutlet}</p>
          </div>
        </div>

        <div className="h-48 w-full relative mt-6">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160">
            {[0, 40, 80, 120, 160].map((y, i) => (
              <line key={i} x1="0" y1={y} x2="700" y2={y} stroke={dark ? '#1e293b' : '#f1f5f9'} strokeDasharray="4 4" strokeWidth="2" />
            ))}

            <path
              d={(() => {
                const sales = data.weeklySales;
                // Auto-scale chart based on max sales to prevent flatlining
                const maxSales = Math.max(...sales) * 1.1;
                const pts = sales.map((val, idx) => {
                  const cx = (idx / (days.length - 1)) * 680 + 10;
                  const cy = 160 - (val / maxSales) * 140;
                  return { x: cx, y: cy };
                });
                
                return pts.reduce((acc, pt, i) => {
                  if (i === 0) return `M ${pt.x} ${pt.y}`;
                  const prev = pts[i - 1];
                  const midX = (prev.x + pt.x) / 2;
                  return `${acc} Q ${prev.x} ${prev.y}, ${midX} ${(prev.y + pt.y) / 2} T ${pt.x} ${pt.y}`;
                }, '');
              })()}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
            />

            {/* Data points perfectly aligned to the path */}
            {data.weeklySales.map((val, idx) => {
              const maxSales = Math.max(...data.weeklySales) * 1.1;
              const cx = (idx / (days.length - 1)) * 680 + 10;
              const cy = 160 - (val / maxSales) * 140;
              const isHovered = hoveredDay === idx;
              return (
                <g key={idx} className="cursor-pointer" onClick={() => setHoveredDay(idx)}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? "6" : "4"}
                    className="transition-all duration-200"
                    fill={isHovered ? "#ffffff" : "#6366f1"}
                    stroke="#4f46e5"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>

          {hoveredDay !== null && (
            <div 
              className={`absolute border p-2.5 rounded-xl shadow-xl text-xs pointer-events-none transition-all duration-200 ${
                dark ? 'bg-slate-800/95 border-indigo-500/40 text-slate-100' : 'bg-white border-indigo-200 text-slate-800'
              }`}
              style={{
                left: `${(hoveredDay / (days.length - 1)) * 85 + 5}%`,
                top: '30%',
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="font-bold text-indigo-500 dark:text-indigo-300">{days[hoveredDay]}</div>
              <div className={`font-mono mt-0.5 font-medium ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
                Sales: ₹{data.weeklySales[hoveredDay].toLocaleString()}
              </div>
            </div>
          )}

          <div className={`flex justify-between text-[11px] font-semibold mt-2 px-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            {days.map((day, idx) => (
              <span 
                key={idx} 
                className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${
                  hoveredDay === idx 
                    ? (dark ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'bg-indigo-100 text-indigo-700 font-bold') 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`} 
                onClick={() => setHoveredDay(idx)}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Decision Support Header & Outlet Selector */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center pb-2 border-b gap-4 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div>
          <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-500 tracking-wider">Granular Agentic Intelligence & Multi-Vector Analysis</span>
          <h2 className={`text-xl font-bold mt-0.5 ${dark ? 'text-white' : 'text-slate-900'}`}>Franchise Decision-Support Dashboard</h2>
        </div>

        <div className="flex items-center gap-3">
          <label className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>SELECT OUTLET:</label>
          <select 
            value={selectedOutlet} 
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className={`border rounded-lg px-3 py-2 text-xs outline-none cursor-pointer transition shadow-sm ${
              dark 
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-indigo-500 focus:border-indigo-500' 
                : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-500 focus:border-indigo-500'
            }`}
          >
            {outlets.map((outlet, i) => (
              <option key={i} value={outlet}>{outlet}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Main Grid: Health Score & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Health Score Tile */}
        <div className={`lg:col-span-4 border rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-colors ${
          dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <span className={`text-xs uppercase font-bold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Franchise Health Score</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(data.status)}`}>
                {data.status}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className={`text-6xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{data.healthScore}</span>
              <span className={`text-lg font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>/ 100</span>
            </div>
            <p className={`text-xs mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Weighted aggregation across 6 specialized agents</p>

            <div className="mt-6 space-y-3">
              {Object.entries(data.weights).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className={`capitalize ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{key} ({val.weight}%)</span>
                    <span className={`font-bold ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>{val.score}%</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        val.score >= 75 ? 'bg-indigo-500' : val.score >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${val.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Risks & Growth Opportunities */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Operational Risks */}
          <div className={`border rounded-2xl p-5 shadow-sm transition-colors ${
            dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h2 className="text-sm font-bold text-rose-500 flex items-center gap-1.5">⚠️ Predicted Operational Risks</h2>
              <span className={`text-xs border px-2 py-0.5 rounded font-bold ${
                dark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {data.risks.length} Active
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {data.risks.map((risk) => (
                <div 
                  key={risk.id} 
                  onClick={() => setActiveModalItem({ ...risk, type: 'Risk' })}
                  className={`p-3 border rounded-xl cursor-pointer transition ${
                    dark 
                      ? 'bg-slate-950 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900' 
                      : 'bg-slate-50 border-slate-200 hover:border-rose-400 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className={dark ? 'text-rose-400' : 'text-rose-700'}>{risk.title}</span>
                    <span className="text-rose-500 font-mono">{risk.probability}% Prob.</span>
                  </div>
                  <p className={`text-xs mt-1 line-clamp-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{risk.description}</p>
                  <div className={`flex justify-between items-center mt-2 text-[11px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="font-medium">Horizon: {risk.horizon}</span>
                    <span className="text-indigo-500 font-bold hover:underline">View Details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className={`border rounded-2xl p-5 shadow-sm transition-colors ${
            dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h2 className="text-sm font-bold text-emerald-500 flex items-center gap-1.5">📈 Growth Opportunities</h2>
              <span className={`text-xs border px-2 py-0.5 rounded font-bold ${
                dark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {data.opportunities.length} Detected
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {data.opportunities.map((opp) => (
                <div 
                  key={opp.id} 
                  onClick={() => setActiveModalItem({ ...opp, type: 'Opportunity' })}
                  className={`p-3 border rounded-xl cursor-pointer transition ${
                    dark 
                      ? 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900' 
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className={dark ? 'text-emerald-400' : 'text-emerald-700'}>{opp.title}</span>
                    <span className="text-emerald-500 font-mono">{opp.estimatedGain}</span>
                  </div>
                  <p className={`text-xs mt-1 line-clamp-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{opp.description}</p>
                  <div className={`flex justify-between items-center mt-2 text-[11px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="font-medium">Conf: {opp.confidence} • {opp.effort}</span>
                    <span className="text-emerald-500 font-bold hover:underline">Details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 5. Bottom Grid: Risk Distribution Bar Chart & Agentic Vector Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Operational Risk Probability Distribution Bar Chart */}
        <div className={`border rounded-2xl p-6 shadow-sm transition-colors flex flex-col justify-between ${
          dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Operational Risk Probability Distribution</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                dark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-200'
              }`}>
                Comparative AI Forecasting
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Comparative risk probability index across supervised network locations</p>
          </div>

          <div className="h-44 flex items-end gap-4 pt-6 px-2 justify-around">
            {data.networkRiskDistribution.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <span className={`text-xs font-bold ${item.text}`}>{item.probability}%</span>
                <div className={`w-full ${item.color} rounded-t-lg transition-all duration-500 shadow-sm`} style={{ height: `${item.probability * 1.2}px` }}></div>
                <span className={`text-[10px] font-semibold text-center truncate w-full ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{item.location}</span>
              </div>
            ))}
          </div>

          <div className={`text-[11px] text-center pt-4 font-medium ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            Multi-branch risk correlation computed via automated telemetry sync.
          </div>
        </div>

        {/* Agentic Vector Performance Grid */}
        <div className={`border rounded-2xl p-6 shadow-sm transition-colors flex flex-col justify-between ${
          dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Agentic Vector Performance Grid</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                dark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                Normalized Indices
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Multi-vector operational telemetry for {selectedOutlet}</p>
          </div>

          <div className="space-y-3 my-3">
            {dynamicVectors.map((vec, idx) => (
              <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between ${dark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="space-y-1 flex-1 pr-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-bold ${dark ? 'text-slate-200' : 'text-slate-800'}`}>{vec.name}</span>
                    <span className={`font-mono text-xs font-bold ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>{vec.score}%</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${vec.color}`} style={{ width: `${vec.score}%` }}></div>
                  </div>
                </div>
                <div className={`text-right pl-2 border-l ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <span className={`text-[10px] block font-bold ${vec.status === 'Optimal' || vec.status === 'Peak' ? 'text-emerald-500' : vec.status === 'Watch' ? 'text-amber-500' : 'text-indigo-500'}`}>
                    {vec.status}
                  </span>
                  <span className={`text-[9px] font-mono font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{vec.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-[11px] text-center font-semibold pt-1 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Supervised multi-agent performance vector sync active.
          </div>
        </div>

      </div>

      {/* 6. Actionable Strategic Recommendations */}
      <div className={`border rounded-2xl p-6 shadow-sm transition-colors ${
        dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className={`pb-3 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
          <h2 className="text-base font-bold text-amber-500 flex items-center gap-2">💡 Actionable Strategic Recommendations</h2>
          <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Synthesized root-cause actions from all agent inputs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {data.recommendations.map((rec) => (
            <div 
              key={rec.id} 
              onClick={() => setActiveModalItem({ ...rec, type: 'Recommendation' })}
              className={`p-4 border rounded-xl flex flex-col justify-between cursor-pointer transition shadow-sm ${
                dark 
                  ? 'bg-slate-950 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900' 
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-bold uppercase ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>{rec.priority}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    dark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
                  }`}>
                    Due: {rec.deadline}
                  </span>
                </div>
                <h3 className={`text-sm font-bold mt-2.5 ${dark ? 'text-white' : 'text-slate-900'}`}>{rec.title}</h3>
                <p className={`text-xs mt-1.5 font-medium ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{rec.rationale}</p>
              </div>
              <div className={`mt-4 pt-3 border-t text-xs flex justify-between items-center ${
                dark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <span>Owner: <strong className={dark ? 'text-slate-200' : 'text-slate-800'}>{rec.owner}</strong></span>
                <span className="text-xs text-indigo-500 font-bold hover:underline">Assign &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Drawer / Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 ${
            dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                  dark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {activeModalItem.type} Details
                </span>
                <h3 className={`text-lg font-bold mt-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{activeModalItem.title}</h3>
              </div>
              <button 
                onClick={() => setActiveModalItem(null)}
                className={`text-xl font-bold px-2 rounded-lg transition-colors ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                &times;
              </button>
            </div>

            <div className={`space-y-2 text-xs p-4 rounded-xl border font-medium ${
              dark ? 'text-slate-300 bg-slate-950 border-slate-800' : 'text-slate-700 bg-slate-50 border-slate-200'
            }`}>
              <p><strong className={dark ? 'text-slate-100' : 'text-slate-900'}>Description:</strong> {activeModalItem.description || activeModalItem.rationale}</p>
              {activeModalItem.rootCause && (
                <p><strong className="text-rose-500">Identified Root Cause:</strong> {activeModalItem.rootCause}</p>
              )}
              {activeModalItem.owner && (
                <p><strong className={dark ? 'text-slate-100' : 'text-slate-900'}>Assigned Owner:</strong> {activeModalItem.owner} <span className="opacity-75">(Target: {activeModalItem.deadline})</span></p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setActiveModalItem(null)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  dark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert(`Action Plan confirmed for: ${activeModalItem.title}`);
                  setActiveModalItem(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/20 transition-all"
              >
                Dispatch Action Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}