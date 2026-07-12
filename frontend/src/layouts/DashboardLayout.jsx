import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({
  user,
  dark,
  toggleTheme,
  onLogout
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onLogout={onLogout}   
          user={user}
        />

        <div className="flex flex-col flex-1">

          {/* Navbar */}
          <Navbar
            user={user}
            dark={dark}
            toggleTheme={toggleTheme}
            onLogout={onLogout}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />

          {/* Content */}
          <main className="flex-1 pt-20 overflow-y-auto px-6">
            <Outlet  context={{ user }} />
          </main>

        </div>
      </div>
    </>
  );
}
