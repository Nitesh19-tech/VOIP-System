import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Companies from "./pages/superadmin/Companies/Companies";
import API, { setAuthToken } from "./services/api";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminUsers from "./pages/superadmin/AdminUsers/AdminUsers";
import SipDashboard from "./pages/SipDashborad";
import Calls from "./pages/Calls";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Clients from "./pages/admin/Clients/Clients";
import Analytics from "./pages/Analytics";
import ForcePasswordChange from "./pages/ForcePasswordChange";
import SipUsers from "./pages/admin/SipUsers";
import NumberPool from "./pages/admin/NumberPool/NumberPool";
import AdminBillingDashboard from "./pages/admin/AdminBillingDashboard";
import SIPAccounts from "./pages/admin/SIP/SIPAccounts";
import CDRPage from "./pages/cdr/CDRPage";
import ProvisionPage from "./pages/admin/Provision/ProvisionPage";
import Countries from "./pages/admin/Countries/Countries";
import RateManagement from "./pages/dashboard/rate/RateManagement";
import TrunkPage from "./pages/admin/Trunks";
import CarrierList from "./pages/admin/Carriers/CarrierList";
import RoutingPlanList from "./pages/admin/RoutingPlans/RoutingPlanList";
export default function App() {

  // null = loading, false = not logged in, object = logged in
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ------------------------------
  // 🌙 THEME STATE
  // ------------------------------
  const [dark, setDark] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // ------------------------------
  // 🔐 LOGOUT
  // ------------------------------
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuthToken(null);
    setUser(false);
    navigate("/login", { replace: true });
  };

  // ------------------------------
  // 👤 LOAD USER
  // ------------------------------
  const loadUser = async () => {
    try {
      const res = await API.get("auth/profile/");

      if (res.data.force_password_change) {
        setUser(res.data);
        navigate("/force-change-password");
        return;
      }

      setUser(res.data);

    } catch (err) {
      console.error("Load user failed", err);
      logout();
    }
  };

  // ------------------------------
  // 🔑 CHECK TOKEN ON APP LOAD
  // ------------------------------
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setUser(false);
    }
  }, []);

  return (
    <Routes>

      {/* Public */}
      <Route
        path="/superadmin/admin-users"
        element={
          <ProtectedRoute
            user={user}
            allowedRoles={["SUPER_ADMIN"]}
          >
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute
            user={user}
            allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}
          >
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rates"
        element={
          <ProtectedRoute
            user={user}
            allowedRoles={["SUPER_ADMIN"]}
          >
            <RateManagement user={user} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/force-change-password"
        element={
          <ProtectedRoute
            user={user}
            allowedRoles={["CLIENT"]}
          >
            <ForcePasswordChange />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute
            user={user}
            allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "CLIENT"]}
          >
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cdr"
        element={
          <ProtectedRoute
            user={user}
            allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}
          >
            <CDRPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provision"
        element={
          <ProtectedRoute
            user={user}
            allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}
          >
            <ProvisionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={<Login onLogin={loadUser} />}
      />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute user={user}>
            <DashboardLayout
              user={user}
              dark={dark}
              toggleTheme={toggleTheme}
              onLogout={logout}
            />
          </ProtectedRoute>
        }
      >

        <Route index element={<SipDashboard />} />
        <Route path="/dashboard" element={<SipDashboard />} />

        <Route
          path="/calls"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN", "CLIENT"]}
            >
              <Calls />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["CLIENT", "COMPANY_ADMIN", "SUPER_ADMIN"]}
            >
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/companies"
          element={
            <ProtectedRoute user={user} allowedRoles={["SUPER_ADMIN"]}>
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/sip-users"
          element={
            <ProtectedRoute user={user} allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}>
              <SipUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/billing"
          element={
            <ProtectedRoute user={user} allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}>
              <AdminBillingDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/clients"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}
            >
              <Clients user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/number-pool"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}
            >
              <NumberPool user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/countries"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["SUPER_ADMIN"]}
            >
              <Countries />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/sip-accounts"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}
            >
              <SIPAccounts user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/trunks"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["SUPER_ADMIN", "COMPANY_ADMIN"]}
            >
              <TrunkPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/carriers"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <CarrierList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/routing-plans"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <RoutingPlanList />
            </ProtectedRoute>
          }
        />
      </Route>

    </Routes>
  );
}