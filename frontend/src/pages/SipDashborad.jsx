import { useEffect, useState } from "react";

import {
  getDashboardOverview,
  getDashboardActiveCalls,
} from "../services/stats";

import OverviewCards from "../components/dashboard/OverviewCards";
import ActiveCallsTable from "../components/dashboard/ActiveCallsTable";

export default function SipDashboard() {
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
  });

  const [activeCalls, setActiveCalls] = useState([]);

  const loadDashboard = async () => {
    try {
      const [overviewRes, activeCallsRes] = await Promise.all([
        getDashboardOverview(),
        getDashboardActiveCalls(),
      ]);

      setOverview(overviewRes.data);
      setActiveCalls(activeCallsRes.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadDashboard();
      setLoading(false);
    };

    init();

    const timer = setInterval(loadDashboard, 30000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          VoIP System Overview
        </p>
      </div>

      <OverviewCards overview={overview} />

      <ActiveCallsTable calls={activeCalls} />

    </div>
  );
}