import {
  LayoutDashboard,
  Phone,
  Users,
  Settings,
  Wallet,
  LogOut,
  Hash,
  ClipboardList,
  FileText,
  DollarSign,
  Receipt,
  CreditCard,
  Server,
  Network,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  // =====================================================
  // DASHBOARD
  // =====================================================

  {
    title: "Dashboard",

    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "CLIENT"],
      },
    ],
  },

  // =====================================================
  // ACCOUNTS
  // =====================================================

  {
    title: "Accounts",

    items: [
      {
        name: "Clients",
        icon: Users,
        path: "/dashboard/clients",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Sub Clients",
        icon: Users,
        path: "/dashboard/sub-clients",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Test Accounts",
        icon: ShieldCheck,
        path: "/dashboard/test-accounts",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // TELEPHONY
  // =====================================================

  {
    title: "Telephony",

    items: [
      {
        name: "Carriers",
        icon: Network,
        path: "/dashboard/carriers",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Terminations",
        icon: Server,
        path: "/dashboard/terminations",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Number Pool",
        icon: Hash,
        path: "/dashboard/number-pool",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Incoming Routing",
        icon: ClipboardList,
        path: "/dashboard/incoming-routing",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "SIP Accounts",
        icon: Phone,
        path: "/dashboard/sip-accounts",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // LIVE OPERATIONS
  // =====================================================

  {
    title: "Live Operations",

    items: [
      {
        name: "Live Access",
        icon: ShieldCheck,
        path: "/live-access",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Active Calls",
        icon: Phone,
        path: "/calls",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "CLIENT"],
      },
    ],
  },

  // =====================================================
  // REPORTS
  // =====================================================

  {
    title: "Reports",

    items: [
      {
        name: "CDR & Stats",
        icon: FileText,
        path: "/cdr",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Failed Reports",
        icon: FileText,
        path: "/reports/failed",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Profit Reports",
        icon: DollarSign,
        path: "/reports/profit",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Manager Reports",
        icon: ClipboardList,
        path: "/reports/manager",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // FINANCE
  // =====================================================

  {
    title: "Finance",

    items: [
      {
        name: "Credit Notes",
        icon: Receipt,
        path: "/finance/credit-notes",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Carrier Credit Notes",
        icon: Receipt,
        path: "/finance/carrier-credit-notes",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Payment Requests",
        icon: CreditCard,
        path: "/finance/payment-requests",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Adjustments",
        icon: Wallet,
        path: "/finance/adjustments",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Statements",
        icon: FileText,
        path: "/finance/statements",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // SETTINGS
  // =====================================================

  {
    title: "Settings",

    items: [
      {
        name: "IVR Files",
        icon: FileText,
        path: "/settings/ivr-files",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Notifications",
        icon: Settings,
        path: "/settings/notifications",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },
    ],
  },
];

export default function Sidebar({
  open,
  onLogout,
  user,
}) {
  if (!user) return null;

  return (
    <aside
      className={`
        ${open ? "w-72" : "w-0 overflow-hidden"}
        bg-slate-950
        border-r
        border-slate-800
        h-screen
        flex
        flex-col
        transition-all
        duration-300
        shadow-2xl
      `}
    >
      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <Phone
              className="text-white"
              size={22}
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              VoIP Switch
            </h1>

            <p className="text-xs text-slate-400">
              Wholesale Platform
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          USER
      ===================================================== */}

      <div className="px-4 py-5">

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">

          <div className="flex items-center gap-3">

            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-white text-sm font-semibold truncate">
                {user.email}
              </p>

              <p className="text-xs text-slate-400">
                {user.role?.replace("_", " ")}
              </p>

            </div>

            <ShieldCheck
              size={18}
              className="text-emerald-400"
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

      <div className="flex-1 overflow-y-auto px-4 pb-5">

        {menu.map((section) => {

          const items = section.items.filter((item) =>
            item.roles.includes(user.role)
          );

          if (!items.length) return null;

          return (
            <div
              key={section.title}
              className="mb-8"
            >

              <h3 className="px-3 mb-3 text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500">
                {section.title}
              </h3>

              <div className="space-y-1.5">

                {items.map((item) => {

                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        group
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3
                        rounded-xl
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                            : "text-slate-300 hover:bg-slate-900 hover:text-white hover:translate-x-1"
                        }
                        `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">

                            <Icon
                              size={20}
                              className={`
                                transition-transform
                                duration-200
                                ${
                                  isActive
                                    ? "scale-110"
                                    : "group-hover:scale-110"
                                }
                              `}
                            />

                            <span className="text-sm font-medium">
                              {item.name}
                            </span>

                          </div>

                          <ChevronRight
                            size={16}
                            className={`
                              transition-all
                              duration-200
                              ${
                                isActive
                                  ? "opacity-100 translate-x-0"
                                  : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                              }
                            `}
                          />

                        </>
                      )}
                    </NavLink>
                  );
                })}

              </div>

            </div>
          );
        })}

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="border-t border-slate-800 px-4 py-4">

        <button
          onClick={onLogout}
          className="
            group
            w-full
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-red-400
            transition-all
            duration-200
            hover:bg-red-500
            hover:text-white
            hover:shadow-lg
          "
        >

          <div className="flex items-center gap-3">

            <LogOut
              size={20}
              className="group-hover:rotate-12 transition-transform duration-200"
            />

            <span className="font-medium">
              Logout
            </span>

          </div>

          <ChevronRight
            size={16}
            className="opacity-70 group-hover:translate-x-1 transition-transform"
          />

        </button>

        <div className="mt-6 rounded-xl bg-slate-900 border border-slate-800 p-4">

          <p className="text-xs font-semibold text-slate-400">
            VoIP Wholesale Platform
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Version 1.0.0
          </p>

        </div>

      </div>

    </aside>
  );
}