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

    <div className="h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">

      {/* Sidebar */}

      <Sidebar
        open={sidebarOpen}
        onLogout={onLogout}
        user={user}
      />

      {/* Main Wrapper */}

      <div
        className={`
          transition-all
          duration-300

          ${
            sidebarOpen
              ? "md:ml-72"
              : "md:ml-0"
          }
        `}
      >

        {/* Navbar */}

        <Navbar
          user={user}
          dark={dark}
          toggleTheme={toggleTheme}
          onLogout={onLogout}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Main Content */}

        <main
          className="
            h-screen
            overflow-y-auto

            pt-20
            pb-8

            px-6
            md:px-8
            lg:px-10

            bg-slate-100
            dark:bg-slate-950
          "
        >

          {/* Page */}

          <div
            className="
              max-w-[1800px]
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