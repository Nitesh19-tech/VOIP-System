import {
  LayoutDashboard,
  Phone,
  Users,
  Settings,
  Wallet,
  LogOut,
  BarChart3,
  Hash,
  ClipboardList,
  FileText,
  Globe2,
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
  // Dashboard
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
  // Administration
  // =====================================================

  {
    title: "Administration",

    items: [

      {
        name: "Admin",
        icon: Users,
        path: "/superadmin/admin-users",
        roles: ["SUPER_ADMIN"],
      },

      {
        name: "Clients",
        icon: Users,
        path: "/dashboard/clients",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

    ],
  },

  // =====================================================
  // Telephony
  // =====================================================

  {
    title: "Telephony",

    items: [

      {
        name: "Countries",
        icon: Globe2,
        path: "/dashboard/countries",
        roles: ["SUPER_ADMIN"],
      },

      {
        name: "Number Pool",
        icon: Hash,
        path: "/dashboard/number-pool",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "SIP Accounts",
        icon: Phone,
        path: "/dashboard/sip-accounts",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Carriers",
        icon: Network,
        path: "/dashboard/carriers",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Routing Plans",
        icon: ClipboardList,
        path: "/dashboard/routing-plans",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Routes",
        icon: Network,
        path: "/dashboard/routes",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Terminations",
        icon: Server,
        path: "/dashboard/terminations",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Trunks",
        icon: Server,
        path: "/dashboard/trunks",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Provision Jobs",
        icon: ClipboardList,
        path: "/provision",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

    ],
  },

  // =====================================================
  // Monitoring
  // =====================================================

  {
    title: "Monitoring",

    items: [

      {
        name: "Active Calls",
        icon: Phone,
        path: "/calls",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "CLIENT"],
      },

      {
        name: "CDR",
        icon: FileText,
        path: "/cdr",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Analytics",
        icon: BarChart3,
        path: "/analytics",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

    ],
  },
    // =====================================================
  // Rate Management
  // =====================================================

  {
    title: "Rate Management",

    items: [

      {
        name: "Rate Cards",
        icon: DollarSign,
        path: "/rates",
        roles: ["SUPER_ADMIN"],
      },

    ],
  },

  // =====================================================
  // Billing
  // =====================================================

  {
    title: "Billing",

    items: [

      {
        name: "Invoices",
        icon: Receipt,
        path: "/billing/invoices",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Payments",
        icon: CreditCard,
        path: "/billing/payments",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Wallet",
        icon: Wallet,
        path: "/billing/wallet",
        roles: ["CLIENT"],
      },

    ],
  },

  // =====================================================
  // Settings
  // =====================================================

  {
    title: "Settings",

    items: [

      {
        name: "Settings",
        icon: Settings,
        path: "/settings",
        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
          "CLIENT",
        ],
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

      {/* Logo */}

      <div className="px-6 py-5 border-b border-slate-800">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">

            <Phone className="text-white" size={22} />

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

      {/* User */}

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

                {user.role.replace("_", " ")}

              </p>

            </div>

            <ShieldCheck
              size={18}
              className="text-emerald-400"
            />

          </div>

        </div>

      </div>

      {/* Menu */}

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
                              className={`transition-transform duration-200 ${
                                isActive
                                  ? "scale-110"
                                  : "group-hover:scale-110"
                              }`}
                            />

                            <span className="text-sm font-medium">

                              {item.name}

                            </span>

                          </div>

                          <ChevronRight
                            size={16}
                            className={`transition-all duration-200 ${
                              isActive
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                            }`}
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
            {/* Footer */}

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