import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  user,
  dark,
  toggleTheme,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">

      <Sidebar
        open={sidebarOpen}
        onLogout={onLogout}
        user={user}
      />

      <div className="flex flex-1 flex-col">

        <Navbar
          user={user}
          dark={dark}
          toggleTheme={toggleTheme}
          onLogout={onLogout}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto pt-20 px-6">

          <div className="text-red-500 text-3xl mb-4">
            TEST
          </div>

          <Outlet context={{ user }} />

        </main>

      </div>

    </div>
  );
}