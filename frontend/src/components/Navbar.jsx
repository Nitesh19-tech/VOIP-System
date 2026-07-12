import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({
  user,
  toggleSidebar,
  sidebarOpen
}) {
  const { dark, toggleTheme } = useTheme();
  return (
    <header
      className={`
        fixed top-0 right-0 h-16 z-50 flex justify-between items-center
        px-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 backdrop-blur-sm border-b border-slate-800
        transition-all duration-300
        ${sidebarOpen ? "md:left-64" : "md:left-0"}
        left-0
      `}
    >

      {/* Left: Sidebar Toggle & Breadcrumb/Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <Menu size={20} />
        </button>

        <span className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">
          Dashboard
        </span>
      </div>

      {/* Right: Theme & User Profile */}
      <div className="flex items-center gap-4">

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-yellow-400 transition"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-slate-900 dark:text-white">{user?.username}</div>
            <div className="text-xs text-slate-500 uppercase">{user?.role}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

      </div>

    </header>
  );
}