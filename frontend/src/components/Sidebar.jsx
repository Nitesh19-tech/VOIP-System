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
  // ADMINISTRATION
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
  // ACCOUNTS
  // =====================================================

  {
    title: "Accounts",
    items: [
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
  // NUMBER MANAGEMENT
  // =====================================================

  {
    title: "Number Management",
    items: [
      {
        name: "Countries",
        icon: Globe2,
        path: "/dashboard/countries",
        roles: ["SUPER_ADMIN"],
      },

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
        name: "Assign / Bulk Allocate",
        icon: ClipboardList,
        path: "/dashboard/assign",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },
    ],
  },

  // =====================================================
  // ROUTING & SIP
  // =====================================================

  {
    title: "Routing & SIP",
    items: [
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
        name: "SIP Accounts",
        icon: Phone,
        path: "/dashboard/sip-accounts",
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
        icon: BarChart3,
        path: "/reports/profit",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN"],
      },

      {
        name: "Manager Reports",
        icon: BarChart3,
        path: "/reports/manager",
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
  // RATE MANAGEMENT
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
        roles: ["SUPER_ADMIN"],
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

      {
        name: "Settings",
        icon: Settings,
        path: "/settings",
        roles: ["SUPER_ADMIN", "COMPANY_ADMIN", "CLIENT"],
      },
    ],
  },
];