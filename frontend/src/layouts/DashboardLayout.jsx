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

      {/* Sidebar */}

      <Sidebar
        open={sidebarOpen}
        onLogout={onLogout}
        user={user}
      />

      {/* Main Section */}

      <div className="flex flex-1 flex-col overflow-hidden">

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

        <main
          className="
            flex-1
            overflow-y-auto

            pt-20
            pb-8

            px-4
            md:px-6
            xl:px-8
          "
        >

          <div
            className="
              w-full
              max-w-[1600px]
              mx-auto
            "
          >

            <Outlet context={{ user }} />

          </div>

        </main>

      </div>

    </div>
  );
}