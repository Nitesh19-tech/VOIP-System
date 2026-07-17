import {
  Sun,
  Moon,
  Menu,
  Bell,
  Search,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

export default function Navbar({
  user,
  toggleSidebar,
  sidebarOpen,
}) {
  const { dark, toggleTheme } = useTheme();

  return (
    <header
      className={`
        fixed
        top-0
        right-0
        left-0
        h-16
        z-50

        flex
        items-center
        justify-between

        px-6

        bg-white/90
        dark:bg-slate-950/90

        backdrop-blur-xl

        border-b
        border-slate-200
        dark:border-slate-800

        transition-all
        duration-300

        ${sidebarOpen ? "md:left-72" : "md:left-0"}
      `}
    >
      {/* Left */}

      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="
            p-2
            rounded-lg
            text-slate-500
            dark:text-slate-400
            hover:bg-blue-600
            hover:text-white
            transition
          "
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Search */}

      <div className="hidden lg:flex flex-1 justify-center px-8">
        <div className="relative w-full max-w-lg">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              pl-10
              pr-4
              py-2.5

              rounded-xl

              bg-slate-100
              dark:bg-slate-900

              border
              border-slate-200
              dark:border-slate-800

              text-sm

              outline-none

              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3">
        <button
          className="
            relative
            p-2.5
            rounded-xl

            text-slate-500
            dark:text-slate-400

            hover:bg-slate-100
            dark:hover:bg-slate-900

            transition
          "
        >
          <Bell size={20} />

          <span
            className="
              absolute
              top-2
              right-2

              h-2
              w-2

              rounded-full

              bg-red-500
            "
          />
        </button>

        <button
          onClick={toggleTheme}
          className="
            p-2.5
            rounded-xl

            text-slate-500
            dark:text-slate-400

            hover:bg-slate-100
            dark:hover:bg-slate-900

            hover:text-yellow-500

            transition
          "
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div
          className="
            flex
            items-center
            gap-3

            pl-4

            border-l
            border-slate-300
            dark:border-slate-800
          "
        >
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.username}
            </p>

            <p className="text-xs uppercase tracking-wider text-slate-500">
              {user?.role?.replace("_", " ")}
            </p>
          </div>

          <div
            className="
              h-10
              w-10

              rounded-full

              bg-gradient-to-br
              from-blue-600
              to-cyan-500

              flex
              items-center
              justify-center

              text-white
              font-bold

              shadow-lg
            "
          >
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}