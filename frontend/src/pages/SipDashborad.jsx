import { useEffect, useState } from "react";

import {
  getDashboardOverview,
  getDashboardActiveCalls,
} from "../services/stats";

import OverviewCards from "../components/dashboard/OverviewCards";
import ActiveCallsTable from "../components/dashboard/ActiveCallsTable";

export default function SipDashboard({ user }) {
  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState({
    total_companies: 0,
    total_clients: 0,
    total_admins: 0,
    total_extensions: 0,
    registered_devices: 0,
    online_extensions: 0,
    offline_extensions: 0,
    active_calls: 0,
    today_calls: 0,
    answered_calls: 0,
    busy_calls: 0,
    failed_calls: 0,
    no_answer_calls: 0,
    total_duration: 0,
    average_duration: 0,
  });

  const [activeCalls, setActiveCalls] = useState([]);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard = async () => {
    try {
      const [
        overviewRes,
        activeCallsRes,
      ] = await Promise.all([
        getDashboardOverview(),
        getDashboardActiveCalls(),
      ]);

      setOverview(overviewRes.data || {});

      setActiveCalls(
        activeCallsRes.data || []
      );

    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );
    }
  };

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      await loadDashboard();

      setLoading(false);
    };

    init();

    const timer = setInterval(() => {
      loadDashboard();
    }, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">

        <div className="text-center">

          <div
            className="
              w-10
              h-10
              border-4
              border-blue-200
              border-t-blue-600
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p
            className="
              mt-4
              text-sm
              font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            Loading Dashboard...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="w-full p-6 space-y-6">

      {/* =====================================================
          DASHBOARD HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Dashboard
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Overview of your VoIP wholesale platform
          </p>

        </div>

        <div className="flex items-center gap-2">

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-emerald-500
              animate-pulse
            "
          />

          <span
            className="
              text-xs
              font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            Live
          </span>

        </div>

      </div>

      {/* =====================================================
          OVERVIEW CARDS
      ===================================================== */}

      <div className="w-full">

        <OverviewCards
          overview={overview}
          user={user}
        />

      </div>

      {/* =====================================================
          ACTIVE CALLS
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-800
          bg-white
          dark:bg-slate-900
          shadow-sm
        "
      >

        <ActiveCallsTable
          calls={activeCalls}
        />

      </div>

    </div>
  );
}