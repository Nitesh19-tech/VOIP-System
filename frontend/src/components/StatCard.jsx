import React from "react";
import DashboardCard from "./DashboardCard";

const IconBox = ({ icon: Icon, colorClass }) => (
  <div className={`p-3 rounded-xl ${colorClass} shadow-lg backdrop-blur-sm`}>
    <Icon size={24} className="opacity-90" />
  </div>
);

const StatCard = ({ title, value, icon, colorClass, subtext }) => {
  // Extract base color for glow effects (e.g. "bg-rose-500/10" -> "bg-rose-500")
  const baseColor = colorClass.split(' ')[0].replace('/10', '');

  return (
    <DashboardCard className="p-6 relative group transition-all duration-300 hover:border-slate-500/50 hover:bg-[#1e293b]/90">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtext && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`w-2 h-2 rounded-full ${baseColor} animate-pulse`}></span>
              <p className="text-slate-500 text-xs font-medium">{subtext}</p>
            </div>
          )}
        </div>
        <IconBox icon={icon} colorClass={colorClass} />
      </div>
      
      {/* Decorative Glow Blob */}
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${baseColor}`}></div>
    </DashboardCard>
  );
};

export default StatCard;