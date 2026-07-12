import React from "react";

const BeautifulLineChart = ({ data, color = "#22d3ee", height = 250 }) => {
  if (!data || data.length < 2) return <div className="h-full flex items-center justify-center text-slate-600 text-sm">Waiting for data...</div>;

  const maxVal = Math.max(...data.map(d => d.value)) || 10;
  
  // Map data points to SVG coordinates
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxVal) * 80; 
    return `${x},${y}`;
  }).join(" ");

  // Create area fill path
  const areaPath = `M0,100 ${points.split(" ").map(p => `L${p}`).join(" ")} L100,100 Z`;

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ height: `${height}px` }}>
      {/* Background Grid Lines */}
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

        {/* Fill Area */}
        <path d={areaPath} fill={`url(#grad-${color})`} className="transition-all duration-500 ease-in-out" />
        
        {/* Line Stroke */}
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

        {/* Pulsing Dot on Latest Point */}
        <circle cx="100" cy={100 - (data[data.length-1].value / maxVal) * 80} r="2" fill="white" className="animate-ping opacity-75" />
        <circle cx="100" cy={100 - (data[data.length-1].value / maxVal) * 80} r="2" fill="white" />
      </svg>
    </div>
  );
};

export default BeautifulLineChart;


