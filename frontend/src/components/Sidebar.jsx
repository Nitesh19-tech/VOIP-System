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

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
          "CLIENT",
        ],
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

        roles: [
          "SUPER_ADMIN",
        ],
      },

      {
        name: "Clients",

        icon: Users,

        path: "/dashboard/clients",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
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

        path: "//countries",

        roles: [
          "SUPER_ADMIN",
        ],
      },

      {
        name: "Number Pool",

        icon: Hash,

        path: "/dashboard/number-pool",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "SIP Accounts",

        icon: Phone,

        path: "/dashboard/sip-accounts",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "Carriers",

        icon: Network,

        path: "/dashboard/carriers",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "Routing Plans",

        icon: ClipboardList,

        path: "/dashboard/routing-plans",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "Trunks",

        icon: Server,

        path: "/dashboard/trunks",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "Provision Jobs",

        icon: ClipboardList,

        path: "/provision",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
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

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
          "CLIENT",
        ],
      },

      {
        name: "CDR",

        icon: FileText,

        path: "/cdr",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "Analytics",

        icon: BarChart3,

        path: "/analytics",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
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

        roles: [
          "SUPER_ADMIN",
        ],
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

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "Payments",

        icon: CreditCard,

        path: "/billing/payments",

        roles: [
          "SUPER_ADMIN",
          "COMPANY_ADMIN",
        ],
      },

      {
        name: "Wallet",

        icon: Wallet,

        path: "/billing/wallet",

        roles: [
          "CLIENT",
        ],
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
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        h-screen
        flex
        flex-col
        transition-all
        duration-300
        ${open ? "w-64" : "w-0 overflow-hidden"}
      `}
    >

      {/* Logo */}

      <div className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center px-6">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">

            V

          </div>

          <div>

            <h1 className="font-bold text-lg text-slate-900 dark:text-white">

              VoIP

            </h1>

            <p className="text-xs text-slate-500">

              Management System

            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-3 py-5">

        {menu.map((section) => {

          const items = section.items.filter((item) =>
            item.roles.includes(user.role)
          );

          if (!items.length) return null;

          return (

            <div
              key={section.title}
              className="mb-6"
            >

              <p className="px-3 mb-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">

                {section.title}

              </p>

              <div className="space-y-1">

                {items.map((item) => {

                  const Icon = item.icon;

                  return (

                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3
                        px-3 py-3
                        rounded-xl
                        transition-all

                        ${isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }
                      `
                      }
                    >

                      <Icon size={19} />

                      <span>

                        {item.name}

                      </span>

                    </NavLink>

                  );

                })}

              </div>

            </div>

          );

        })}

      </div>

      {/* Logout */}

      <div className="border-t border-slate-200 dark:border-slate-800 p-4">

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>

  );

}