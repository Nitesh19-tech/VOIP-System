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
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500 text-lg font-medium">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <OverviewCards overview={overview} />

      <ActiveCallsTable calls={activeCalls} />

    </div>
  );
}