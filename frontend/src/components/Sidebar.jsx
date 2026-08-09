import { useState } from "react";

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
    icon: LayoutDashboard,
    direct: true,

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
  // ADMINISTRATION
  // =====================================================

  {
    title: "Administration",
    icon: Users,

    items: [
      {
        name: "Admin",
        icon: Users,
        path: "/superadmin/admin-users",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },

  // =====================================================
  // ACCOUNTS
  // =====================================================

  {
    title: "Accounts",
    icon: Users,

    items: [
      {
        name: "Clients",
        icon: Users,
        path: "/dashboard/clients",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Test Accounts",
        icon: ShieldCheck,
        path: "/dashboard/test-accounts",
        roles: ["COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // TELEPHONY
  // =====================================================

  {
    title: "Telephony",
    icon: Phone,

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
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Number Pool",
        icon: Hash,
        path: "/dashboard/number-pool",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Assign",
        icon: ShieldCheck,
        path: "/dashboard/assign",
        roles: ["COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // LIVE OPERATIONS
  // =====================================================

  {
    title: "Live Operations",
    icon: Phone,

    items: [
      {
        name: "Live Access",
        icon: ShieldCheck,
        path: "/live-access",
        roles: ["COMPANY_ADMIN"],
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
    icon: FileText,

    items: [
      {
        name: "CDR & Stats",
        icon: FileText,
        path: "/cdr",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Failed Reports",
        icon: FileText,
        path: "/reports/failed",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Profit Reports",
        icon: DollarSign,
        path: "/reports/profit",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Manager Reports",
        icon: ClipboardList,
        path: "/reports/manager",
        roles: ["COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // FINANCE
  // =====================================================

  {
    title: "Finance",
    icon: Wallet,

    items: [
      {
        name: "Credit Notes",
        icon: Receipt,
        path: "/finance/credit-notes",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Carrier Credit Notes",
        icon: Receipt,
        path: "/finance/carrier-credit-notes",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Payment Requests",
        icon: CreditCard,
        path: "/finance/payment-requests",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Adjustments",
        icon: Wallet,
        path: "/finance/adjustments",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Statements",
        icon: FileText,
        path: "/finance/statements",
        roles: ["COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // SETTINGS
  // =====================================================

  {
    title: "Settings",
    icon: Settings,

    items: [
      {
        name: "IVR Files",
        icon: FileText,
        path: "/settings/ivr-files",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Notifications",
        icon: Settings,
        path: "/settings/notifications",
        roles: ["COMPANY_ADMIN"],
      },

      {
        name: "Settings",
        icon: Settings,
        path: "/settings",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "CLIENT"],
      },
    ],
  },
];

export default function Sidebar({
  open,
  onLogout,
  user,
}) {
  const [hoveredSection, setHoveredSection] = useState(null);

  const [submenuPosition, setSubmenuPosition] = useState({
    top: 0,
    left: 0,
    direction: "down",
  });

  const [submenuOpen, setSubmenuOpen] = useState(false);

  if (!user) return null;

  const openSubmenu = (event, section, items) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const submenuHeight = Math.min(
      items.length * 52 + 55,
      window.innerHeight - 24
    );

    const spaceBelow = window.innerHeight - rect.top;

    let top = rect.top;
    let direction = "down";

    // Agar neeche enough space nahi hai
    // to submenu ko upar shift karo.
    if (spaceBelow < submenuHeight) {
      top = rect.bottom - submenuHeight;
      direction = "up";
    }

    // Screen ke top se bahar na jaaye
    if (top < 12) {
      top = 12;
    }

    // Screen ke bottom se bahar na jaaye
    if (top + submenuHeight > window.innerHeight - 12) {
      top = window.innerHeight - submenuHeight - 12;
    }

    setSubmenuPosition({
      top,
      left: rect.right + 10,
      direction,
    });

    setHoveredSection({
      section,
      items,
    });

    setSubmenuOpen(true);
  };

  const closeSubmenu = () => {
    setSubmenuOpen(false);
    setHoveredSection(null);
  };

  return (
    <div className="relative h-screen">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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
          relative
          z-40
        `}
      >

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

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-5">

          <div className="space-y-2">

            {menu.map((section) => {

              const items = section.items.filter((item) =>
                item.roles.includes(user.role)
              );

              if (!items.length) return null;

              const SectionIcon = section.icon;

              // =================================================
              // DASHBOARD
              // =================================================

              if (section.direct) {

                const item = items[0];
                const Icon = item.icon;

                return (
                  <NavLink
                    key={section.title}
                    to={item.path}
                    className={({ isActive }) => `
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
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">

                          <Icon
                            size={20}
                            className={
                              isActive
                                ? "scale-110"
                                : "group-hover:scale-110 transition-transform"
                            }
                          />

                          <span className="text-sm font-medium">
                            Dashboard
                          </span>

                        </div>

                        <ChevronRight
                          size={16}
                          className={
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }
                        />

                      </>
                    )}
                  </NavLink>
                );
              }

              // =================================================
              // SECTION
              // =================================================

              return (
                <div
                  key={section.title}
                  onMouseEnter={(event) => {
                    openSubmenu(
                      event,
                      section,
                      items
                    );
                  }}
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      rounded-xl
                      text-slate-300
                      cursor-pointer
                      transition-all
                      duration-200
                      hover:bg-slate-900
                      hover:text-white
                    "
                  >

                    <div className="flex items-center gap-3">

                      <SectionIcon
                        size={20}
                        className="
                          transition-transform
                          duration-200
                        "
                      />

                      <span className="text-sm font-medium">
                        {section.title}
                      </span>

                    </div>

                    <ChevronRight size={16} />

                  </div>

                </div>
              );
            })}

          </div>

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
                className="
                  group-hover:rotate-12
                  transition-transform
                  duration-200
                "
              />

              <span className="font-medium">
                Logout
              </span>

            </div>

            <ChevronRight
              size={16}
              className="
                opacity-70
                group-hover:translate-x-1
                transition-transform
              "
            />

          </button>

        </div>

      </aside>

      {/* =====================================================
          FLOATING SUBMENU
      ===================================================== */}

      {submenuOpen && hoveredSection && (
        <div
          className="
            fixed
            z-[99999]
            w-64
          "
          style={{
            top: `${submenuPosition.top}px`,
            left: `${submenuPosition.left}px`,
          }}
          onMouseEnter={() => {
            setSubmenuOpen(true);
          }}
          onMouseLeave={() => {
            closeSubmenu();
          }}
        >

          <div
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-2xl
              shadow-2xl
              p-2
              max-h-[calc(100vh-24px)]
              overflow-y-auto
            "
          >

            {/* SUBMENU TITLE */}

            <div
              className="
                px-3
                py-2
                mb-1
                text-[11px]
                uppercase
                tracking-[0.16em]
                font-bold
                text-slate-500
              "
            >
              {hoveredSection.section.title}
            </div>

            {/* SUBMENU ITEMS */}

            <div className="space-y-1">

              {hoveredSection.items.map((item) => {

                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      closeSubmenu();
                    }}
                    className={({ isActive }) => `
                      group/item
                      flex
                      items-center
                      justify-between
                      px-3
                      py-3
                      rounded-xl
                      transition-colors
                      duration-150
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >

                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">

                          <Icon size={18} />

                          <span className="text-sm font-medium">
                            {item.name}
                          </span>

                        </div>

                        <ChevronRight
                          size={15}
                          className="
                            opacity-0
                            group-hover/item:opacity-100
                            transition-opacity
                          "
                        />

                      </>
                    )}

                  </NavLink>
                );

              })}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}