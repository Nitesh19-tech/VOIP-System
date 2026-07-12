// import React from 'react';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Puzzle, // Using for Extensions
//   History, 
//   CreditCard, 
//   Settings, 
//   Phone, 
//   Bell, 
//   Search,
//   CheckCircle2,
//   XCircle,
//   HelpCircle,
//   MoreVertical
// } from 'lucide-react';

// const Dashboard = () => {
//   return (
//     <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-cyan-500/30">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#111827] border-r border-slate-800/50 flex flex-col">
//         {/* Logo */}
//         <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
//           <div className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
//             <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white">
//               <span className="text-lg">C</span>
//             </div>
//             CloudTalk <span className="text-cyan-400">VOIP</span>
//           </div>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex-1 px-4 py-6 space-y-2">
//           <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
//           <NavItem icon={<Users size={20} />} label="Users" />
//           <NavItem icon={<Puzzle size={20} />} label="Extensions" />
//           <NavItem icon={<History size={20} />} label="Call Logs" />
//           <NavItem icon={<CreditCard size={20} />} label="Billing" />
//           <NavItem icon={<Settings size={20} />} label="Settings" />
//         </nav>

//         {/* User Profile (Sidebar Bottom) */}
//         <div className="p-4 border-t border-slate-800/50">
//           <div className="flex items-center gap-3">
//             <img 
//               src="https://i.pravatar.cc/150?img=32" 
//               alt="User" 
//               className="w-10 h-10 rounded-full border-2 border-slate-700"
//             />
//             <div>
//               <p className="text-sm font-medium text-white">Client Admin</p>
//               <p className="text-xs text-slate-500">demo@telecom.com</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto bg-[#0f172a] p-8">
//         {/* Header */}
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-white">Dashboard</h1>
//           <div className="flex items-center gap-4">
//             <button className="p-2 text-slate-400 hover:text-white transition-colors">
//               <Search size={20} />
//             </button>
//             <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
//               <Bell size={20} />
//               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>
//             <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
//                <img src="https://i.pravatar.cc/150?img=32" alt="Profile" />
//             </div>
//           </div>
//         </header>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard 
//             title="Active Calls" 
//             value="24" 
//             icon={<Phone className="text-cyan-400" size={20} />} 
//           />
//           <StatCard 
//             title="Online Extensions" 
//             value="110/150" 
//             subValue="110" // For the green text
//             icon={<div className="text-green-400 text-xs font-bold bg-green-400/10 px-1 rounded">110</div>} 
//           />
//           <StatCard 
//             title="Today's Minutes" 
//             value="1,520" 
//             icon={<History className="text-green-400" size={20} />} 
//           />
//           <StatCard 
//             title="Credit Balance" 
//             value="$450.00" 
//             icon={<CreditCard className="text-blue-400" size={20} />} 
//           />
//         </div>

//         {/* Middle Section: Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           {/* Live Call Volume Chart */}
//           <div className="lg:col-span-2 bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm relative overflow-hidden">
//             <div className="flex justify-between items-start mb-6">
//               <h3 className="text-lg font-semibold text-slate-200">Live Call Volume</h3>
//             </div>
            
//             {/* Custom SVG Line Chart to match image exactly */}
//             <div className="h-64 w-full relative">
//                {/* Grid Lines */}
//                {[0, 25, 50, 75, 100].map((val, i) => (
//                  <div key={i} className="absolute w-full border-t border-slate-700/30 flex items-center" style={{ bottom: `${val}%` }}>
//                     <span className="text-xs text-slate-500 -ml-8 absolute">{val}</span>
//                  </div>
//                ))}
               
//                {/* Chart Area */}
//                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
//                   <defs>
//                     <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
//                       <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
//                       <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
//                     </linearGradient>
//                     <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
//                       <feGaussianBlur stdDeviation="2" result="blur" />
//                       <feComposite in="SourceGraphic" in2="blur" operator="over" />
//                     </filter>
//                   </defs>
                  
//                   {/* The Line Path */}
//                   <path 
//                     d="M0 90 C 20 80, 40 85, 55 50 S 70 80, 80 80 S 90 70, 100 75" 
//                     fill="none" 
//                     stroke="#22d3ee" 
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     filter="url(#glow)"
//                   />
//                   {/* The Fill Path */}
//                   <path 
//                     d="M0 90 C 20 80, 40 85, 55 50 S 70 80, 80 80 S 90 70, 100 75 V 100 H 0 Z" 
//                     fill="url(#gradient)" 
//                     className="opacity-50"
//                   />
                  
//                   {/* The "Peak" Dot */}
//                   <circle cx="55" cy="50" r="1.5" fill="white" stroke="#22d3ee" strokeWidth="0.5" className="animate-pulse" />
//                </svg>
               
//                {/* X-Axis Labels */}
//                <div className="absolute -bottom-6 w-full flex justify-between text-xs text-slate-500">
//                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
//                </div>
//             </div>
//           </div>

//           {/* Server Health Gauges */}
//           <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700/50 shadow-sm flex flex-col justify-between">
//             <h3 className="text-lg font-semibold text-slate-200 mb-4">Server Health</h3>
            
//             <div className="flex gap-4 justify-around items-center h-full">
//               {/* CPU Gauge */}
//               <Gauge value={35} label="CPU" color="text-blue-500" stroke="#3b82f6" />
//               {/* RAM Gauge */}
//               <Gauge value={60} label="RAM" color="text-green-500" stroke="#22c55e" />
//             </div>
//           </div>
//         </div>

//         {/* Recent Call History Table */}
//         <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
//           <div className="p-6 border-b border-slate-700/50">
//             <h3 className="text-lg font-semibold text-slate-200">Recent Call History</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm text-slate-400">
//               <thead className="bg-[#111827] uppercase text-xs font-medium text-slate-500">
//                 <tr>
//                   <th className="px-6 py-4">Caller ID</th>
//                   <th className="px-6 py-4">Destination</th>
//                   <th className="px-6 py-4">Duration</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4">Timestamp</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-700/50">
//                 <TableRow caller="+7(12)435-3658" dest="To Navasrenioitio" dur="00:00:03" status="Completed" time="12/08/2023 17:33:06" />
//                 <TableRow caller="+7(12)422-2244" dest="To Attoinnaoo" dur="00:00:03" status="Completed" time="12/08/2023 17:30:06" />
//                 <TableRow caller="+7(12)437-7657" dest="Destination.fa" dur="00:00:03" status="Missed" time="12/08/2023 17:32:06" />
//                 <TableRow caller="+7(12)427-7879" dest="To Attorhnaoo" dur="00:00:05" status="Completed" time="12/08/2023 17:23:00" />
//                 <TableRow caller="+7(12)433-5020" dest="Destination" dur="00:00:23" status="Completed" time="12/08/2023 13:30:00" />
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// /* --- Helper Components --- */

// const NavItem = ({ icon, label, active = false }) => (
//   <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//     active 
//       ? 'bg-linear-to-r from-cyan-500/10 to-transparent text-cyan-400 border-l-2 border-cyan-400' 
//       : 'text-slate-400 hover:text-white hover:bg-slate-800'
//   }`}>
//     {icon}
//     <span className="font-medium text-sm">{label}</span>
//   </button>
// );

// const StatCard = ({ title, value, icon, subValue }) => (
//   <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700/50 shadow-sm relative group hover:border-slate-600 transition-colors">
//     <div className="flex justify-between items-start mb-4">
//       <h4 className="text-slate-400 font-medium text-sm">{title}</h4>
//       <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-slate-800 transition-colors">
//         {icon}
//       </div>
//     </div>
//     <div className="flex items-end gap-2">
//       <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
//       {/* Small badge for online extension count logic from image */}
//       {subValue && (
//         <span className="mb-1 text-[10px] font-bold text-white bg-green-500 rounded px-1">{subValue}</span>
//       )}
//     </div>
//   </div>
// );

// const TableRow = ({ caller, dest, dur, status, time }) => {
//   const isMissed = status === 'Missed';
//   return (
//     <tr className="hover:bg-slate-800/30 transition-colors">
//       <td className="px-6 py-4 font-medium text-slate-300">{caller}</td>
//       <td className="px-6 py-4">{dest}</td>
//       <td className="px-6 py-4 font-mono text-slate-400">{dur}</td>
//       <td className="px-6 py-4">
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
//           isMissed 
//             ? 'bg-red-500/10 text-red-400 border-red-500/20' 
//             : 'bg-green-500/10 text-green-400 border-green-500/20'
//         }`}>
//           {isMissed ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
//           {status}
//         </span>
//       </td>
//       <td className="px-6 py-4 text-slate-400 text-xs">{time}</td>
//     </tr>
//   );
// };

// const Gauge = ({ value, label, color, stroke }) => (
//   <div className="flex flex-col items-center">
//     <div className="relative w-32 h-20 overflow-hidden">
//       {/* Background Arc */}
//       <svg className="w-full h-full" viewBox="0 0 100 50">
//         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
//         {/* Fill Arc (Calculated based on value) */}
//         <path 
//           d="M 10 50 A 40 40 0 0 1 90 50" 
//           fill="none" 
//           stroke={stroke} 
//           strokeWidth="8" 
//           strokeLinecap="round"
//           strokeDasharray="126"
//           strokeDashoffset={126 - (126 * value) / 100} // Simple arc math for SVG
//           className="transition-all duration-1000 ease-out"
//         />
//       </svg>
//       {/* Needle (Simple CSS Rotation) */}
//       <div 
//         className="absolute bottom-0 left-1/2 w-1 h-12 bg-slate-300 origin-bottom rounded-full"
//         style={{ transform: `translateX(-50%) rotate(${(value / 100) * 180 - 90}deg)` }}
//       >
//         <div className="w-3 h-3 bg-white rounded-full absolute -bottom-1 -left-1 shadow-lg" />
//       </div>
//     </div>
//     <div className="mt-2 text-center">
//       <span className={`text-sm font-bold ${color}`}>{label}: {value}%</span>
//     </div>
//   </div>
// );

// export default Dashboard;




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
            <span className={`w-2 h-2 rounded-full ${colorClass.split(' ')[0].replace('/10','')} animate-pulse`}></span>
            <p className="text-slate-500 text-xs font-medium">{subtext}</p>
          </div>
        )}
      </div>
      <IconBox icon={icon} colorClass={colorClass} />
    </div>
    <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${colorClass.split(' ')[0].replace('/10','')}`}></div>
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
        <circle cx="100" cy={100 - (data[data.length-1].value / maxVal) * 80} r="2" fill="white" className="animate-ping opacity-75" />
        <circle cx="100" cy={100 - (data[data.length-1].value / maxVal) * 80} r="2" fill="white" />
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
      if(usersRes?.data) setSipUsers(usersRes.data);

      // 2. Fetch Call Logs
      const logsRes = await getCallLogs();
      if(logsRes?.data) setCallLogs(logsRes.data);

      // 3. Fetch Extensions Status
      const extRes = await getOnlineExtensions();
      if(extRes?.data) setExtensions(extRes.data);

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
    fetchData(); // Load immediately on mount

    // Set up live polling (every 3 seconds)
    const interval = setInterval(fetchData, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-cyan-500/30 pb-12">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/60 sticky top-0 z-50 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            VoIP<span className="font-light text-slate-500">Panel</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            System Online
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><Bell size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-400 mx-auto p-4 md:p-8 space-y-8">

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
                <span className="text-xs font-mono text-sky-400">{cpuData[cpuData.length-1]?.value}%</span>
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
                <span className="text-xs font-mono text-pink-400">{memData[memData.length-1]?.value}%</span>
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
                          {(call.caller || "UNK").slice(0,2)}
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


