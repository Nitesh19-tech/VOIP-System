import React, { useEffect, useState } from "react";
import {
  Phone,
  Activity,
  Server,
  Users,
  Clock,
  Smartphone,
  Cpu,
  Search,
  Bell,
  Menu
} from "lucide-react";

// --- IMPORT YOUR API SERVICES ---
// Ensure these files exist in your project structure
import { getSipUsers } from "../services/sip";
import {
  getActiveCalls,
  getCallLogs,
  getOnlineExtensions,
  getSystemStats
} from "../services/stats";

// --- REUSABLE UI COMPONENTS ---

const DashboardCard = ({ children, className = "" }) => (
  <div className={`bg-[#1e293b]/70 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

const IconBox = ({ icon: Icon, colorClass }) => (
  <div className={`p-3 rounded-xl ${colorClass} shadow-lg backdrop-blur-sm`}>
    <Icon size={24} className="opacity-90" />
  </div>
);

const ModernStatCard = ({ title, value, icon, colorClass, subtext }) => (
  <DashboardCard className="p-6 relative group transition-all duration-300 hover:border-slate-500/50 hover:bg-[#1e293b]/90">
    <div className="flex justify-between items-start z-10 relative">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {subtext && (
          <div className="flex items-center gap-1 mt-2">
            <span className={`w-2 h-2 rounded-full ${colorClass.split(' ')[0].replace('/10', '')} animate-pulse`}></span>
            <p className="text-slate-500 text-xs font-medium">{subtext}</p>
          </div>
        )}
      </div>
      <IconBox icon={icon} colorClass={colorClass} />
    </div>
    <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${colorClass.split(' ')[0].replace('/10', '')}`}></div>
  </DashboardCard>
);

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || "";
  let styles = "bg-slate-800 text-slate-400 border-slate-700";

  if (s === "completed") styles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (s === "missed") styles = "bg-rose-500/10 text-rose-400 border-rose-500/20";
  if (s === "busy") styles = "bg-orange-500/10 text-orange-400 border-orange-500/20";

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border ${styles} inline-flex items-center gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s === 'completed' ? 'bg-emerald-400' : s === 'missed' ? 'bg-rose-400' : 'bg-slate-400'}`}></span>
      {s}
    </span>
  );
};

// --- CHART COMPONENT ---

const BeautifulLineChart = ({ data, color = "#22d3ee", height = 250 }) => {
  if (!data || data.length < 2) return <div className="h-full flex items-center justify-center text-slate-600 text-sm">Waiting for data...</div>;

  const maxVal = Math.max(...data.map(d => d.value)) || 10;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxVal) * 80;
    return `${x},${y}`;
  }).join(" ");

  const areaPath = `M0,100 ${points.split(" ").map(p => `L${p}`).join(" ")} L100,100 Z`;

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ height: `${height}px` }}>
      {/* Background Grid */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full border-t border-slate-700/30 h-0" />
        ))}
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={`glow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path d={areaPath} fill={`url(#grad-${color})`} className="transition-all duration-500 ease-in-out" />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${color})`}
          className="transition-all duration-500 ease-in-out"
        />
        <circle cx="100" cy={100 - (data[data.length - 1].value / maxVal) * 80} r="2" fill="white" className="animate-ping opacity-75" />
        <circle cx="100" cy={100 - (data[data.length - 1].value / maxVal) * 80} r="2" fill="white" />
      </svg>
    </div>
  );
};


// --- MAIN DASHBOARD COMPONENT ---

export default function SipDashboard() {
  // Initial State: Charts pre-filled with 0s to maintain shape before data loads
  const [sipUsers, setSipUsers] = useState([]);
  const [activeCalls, setActiveCalls] = useState(0);
  const [callLogs, setCallLogs] = useState([]);
  const [extensions, setExtensions] = useState({ total: 0, online: 0, offline: 0 });

  // Charts need an array of objects: [{ value: 10 }, { value: 12 }...]
  const [chartData, setChartData] = useState(Array(15).fill({ value: 0 }));
  const [cpuData, setCpuData] = useState(Array(15).fill({ value: 0 }));
  const [memData, setMemData] = useState(Array(15).fill({ value: 0 }));

  // --- API DATA LOADING FUNCTIONS ---

  const fetchData = async () => {
    try {
      // 1. Fetch SIP Users
      const usersRes = await getSipUsers();
      if (usersRes?.data) setSipUsers(usersRes.data);

      // 2. Fetch Call Logs
      const logsRes = await getCallLogs();
      if (logsRes?.data) setCallLogs(logsRes.data);

      // 3. Fetch Extensions Status
      const extRes = await getOnlineExtensions();
      if (extRes?.data) setExtensions(extRes.data);

      // 4. Fetch Active Calls (For Live Chart)
      const callsRes = await getActiveCalls();
      const currentCalls = callsRes?.data?.active_calls || 0;
      setActiveCalls(currentCalls);

      // Update Live Call Chart (Keep last 15 points)
      setChartData(prev => {
        const newData = [...prev, { value: currentCalls }];
        return newData.slice(-15);
      });

      // 5. Fetch System Stats (For CPU/RAM Charts)
      const statsRes = await getSystemStats();
      const cpuVal = statsRes?.data?.cpu || 0;
      const memVal = statsRes?.data?.memory?.percent || 0;

      setCpuData(prev => [...prev, { value: cpuVal }].slice(-15));
      setMemData(prev => [...prev, { value: memVal }].slice(-15));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    // Avoid calling setState synchronously inside the effect body
    // by deferring the initial fetch to the next tick.
    const initTimer = setTimeout(() => fetchData(), 0);

    // Set up live polling (every 3 seconds)
    const interval = setInterval(fetchData, 3000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="text-slate-200 font-sans">

      {/* --- MAIN CONTENT --- */}
      <main className="space-y-8">
        {/* 1. STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModernStatCard
            title="Active Calls"
            value={activeCalls}
            icon={Phone}
            colorClass="bg-rose-500/10 text-rose-500"
            subtext="Live connections"
          />
          <ModernStatCard
            title="Online Extensions"
            value={`${extensions.online} / ${extensions.total}`}
            icon={Smartphone}
            colorClass="bg-emerald-500/10 text-emerald-500"
            subtext={`${extensions.offline} Offline`}
          />
          <ModernStatCard
            title="Total Users"
            value={sipUsers.length}
            icon={Users}
            colorClass="bg-blue-500/10 text-blue-500"
            subtext="Registered SIP accounts"
          />
        </div>

        {/* 2. CHARTS SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Main Chart (Live Call Volume) */}
          <DashboardCard className="xl:col-span-2 p-6 min-h-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity size={18} className="text-cyan-400" />
                  Live Call Volume
                </h3>
                <p className="text-slate-500 text-xs mt-1">Traffic monitoring (Real-time)</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500"></span> Incoming
              </div>
            </div>

            <div className="flex-1 w-full bg-[#0f172a]/30 rounded-xl border border-slate-700/30 p-4 relative">
              <BeautifulLineChart data={chartData} color="#22d3ee" height={300} />
            </div>
          </DashboardCard>

          {/* Side Charts (System Stats) */}
          <div className="flex flex-col gap-6 h-full">

            {/* CPU Chart */}
            <DashboardCard className="flex-1 p-5 min-h-47.5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Cpu size={16} className="text-sky-400" /> CPU Load
                </h4>
                <span className="text-xs font-mono text-sky-400">{cpuData[cpuData.length - 1]?.value}%</span>
              </div>
              <div className="flex-1 w-full mt-2">
                <BeautifulLineChart data={cpuData} color="#38bdf8" height={120} />
              </div>
            </DashboardCard>

            {/* RAM Chart */}
            <DashboardCard className="flex-1 p-5 min-h-47.5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Server size={16} className="text-pink-400" /> Memory Usage
                </h4>
                <span className="text-xs font-mono text-pink-400">{memData[memData.length - 1]?.value}%</span>
              </div>
              <div className="flex-1 w-full mt-2">
                <BeautifulLineChart data={memData} color="#f472b6" height={120} />
              </div>
            </DashboardCard>

          </div>
        </div>

        {/* 3. CALL LOGS TABLE */}
        <DashboardCard className="w-full">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Recent Call Logs</h3>
                <p className="text-slate-500 text-xs">Latest activity across all extensions</p>
              </div>
            </div>
            <button className="text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-all border border-slate-700">
              View Full History
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Caller</th>
                  <th className="px-6 py-4">Callee</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {callLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                      No call records found yet.
                    </td>
                  </tr>
                ) : (
                  callLogs.map((call) => (
                    <tr
                      key={call.id}
                      className="hover:bg-slate-700/20 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                          {(call.caller || "UNK").slice(0, 2)}
                        </div>
                        {call.caller}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono">
                        {call.callee}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-400">
                        {call.duration}s
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={call.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                        {new Date(call.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DashboardCard>

      </main>
    </div>
  );
}


