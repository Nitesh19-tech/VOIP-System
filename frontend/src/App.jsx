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
import RouteList from "./pages/admin/Routes/RouteList";
import TerminationList from "./pages/admin/termination/TerminationList";

export default function App() {

  // null = loading
  // false = not logged in
  // object = logged in
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // =====================================================
  // THEME STATE
  // =====================================================

  const [dark, setDark] = useState(
    localStorage.getItem("theme") !== "light"
  );

  const toggleTheme = () => {
    const newTheme = !dark;

    setDark(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  };

  useEffect(() => {

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

  }, [dark]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setAuthToken(null);

    setUser(false);

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // LOAD USER
  // =====================================================

  const loadUser = async () => {

    try {

      const res = await API.get(
        "auth/profile/"
      );

      if (res.data.force_password_change) {

        setUser(res.data);

        navigate(
          "/force-change-password"
        );

        return;
      }

      setUser(res.data);

    } catch (err) {

      console.error(
        "Load user failed",
        err
      );

      logout();
    }
  };

  // =====================================================
  // CHECK TOKEN ON APP LOAD
  // =====================================================

  useEffect(() => {

    const token =
      localStorage.getItem("access");

    if (token) {

      setAuthToken(token);

      loadUser();

    } else {

      setUser(false);

    }

  }, []);

  return (

    <Routes>

      {/* =====================================================
          PUBLIC
      ===================================================== */}

      <Route
        path="/login"
        element={
          <Login
            onLogin={loadUser}
          />
        }
      />

      {/* =====================================================
          PROTECTED
      ===================================================== */}

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

        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        <Route
          index
          element={
            <SipDashboard
              user={user}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <SipDashboard
              user={user}
            />
          }
        />

        {/* =====================================================
            CALLS
        ===================================================== */}

        <Route
          path="/calls"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
                "CLIENT",
              ]}
            >
              <Calls />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            BILLING
        ===================================================== */}

        <Route
          path="/billing"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "CLIENT",
                "COMPANY_ADMIN",
                "SUPER_ADMIN",
              ]}
            >
              <Billing />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SUPER ADMIN - COMPANIES
        ===================================================== */}

        <Route
          path="/superadmin/companies"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
              ]}
            >
              <Companies />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SIP USERS
        ===================================================== */}

        <Route
          path="/dashboard/sip-users"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <SipUsers />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ANALYTICS
        ===================================================== */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            ADMIN BILLING
        ===================================================== */}

        <Route
          path="/dashboard/billing"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <AdminBillingDashboard />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            RATES
        ===================================================== */}

        <Route
          path="/rates"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
              ]}
            >
              <RateManagement
                user={user}
              />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            FORCE PASSWORD CHANGE
        ===================================================== */}

        <Route
          path="/force-change-password"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "CLIENT",
              ]}
            >
              <ForcePasswordChange />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SETTINGS
        ===================================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
                "CLIENT",
              ]}
            >
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SUPER ADMIN - ADMIN USERS
        ===================================================== */}

        <Route
          path="/superadmin/admin-users"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
              ]}
            >
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CLIENTS
        ===================================================== */}

        <Route
          path="/dashboard/clients"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <Clients
                user={user}
              />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            NUMBER POOL
        ===================================================== */}

        <Route
          path="/dashboard/number-pool"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <NumberPool
                user={user}
              />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            COUNTRIES
        ===================================================== */}

        <Route
          path="/dashboard/countries"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
              ]}
            >
              <Countries />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            SIP ACCOUNTS
        ===================================================== */}

        <Route
          path="/dashboard/sip-accounts"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <SIPAccounts
                user={user}
              />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CDR
        ===================================================== */}

        <Route
          path="/cdr"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <CDRPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            PROVISION
        ===================================================== */}

        <Route
          path="/provision"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <ProvisionPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            TRUNKS
        ===================================================== */}

        <Route
          path="/dashboard/trunks"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <TrunkPage />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            CARRIERS
        ===================================================== */}

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

        {/* =====================================================
            ROUTING PLANS
        ===================================================== */}

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

        {/* =====================================================
            ROUTES
        ===================================================== */}

        <Route
          path="/dashboard/routes"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <RouteList />
            </ProtectedRoute>
          }
        />

        {/* =====================================================
            TERMINATIONS
        ===================================================== */}

        <Route
          path="/dashboard/terminations"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={[
                "SUPER_ADMIN",
                "COMPANY_ADMIN",
              ]}
            >
              <TerminationList />
            </ProtectedRoute>
          }
        />

      </Route>

    </Routes>
  );
}