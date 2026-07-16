export default function DashboardCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden

        rounded-2xl

        border
        border-slate-200
        dark:border-slate-800

        bg-white
        dark:bg-slate-900

        shadow-sm
        hover:shadow-2xl

        transition-all
        duration-300

        hover:-translate-y-1

        ${className}
      `}
    >
      {/* Top Accent Line */}

      <div
        className="
          absolute
          top-0
          left-0

          h-1
          w-full

          bg-gradient-to-r
          from-blue-600
          via-cyan-500
          to-blue-400
        "
      />

      {children}
    </div>
  );
}