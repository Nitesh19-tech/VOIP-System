import {
  Users,
  UserCog,
  Phone,
  PhoneCall,
  Wifi,
  Smartphone,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

const cards = [

  {
    key: "total_admins",
    title: "Admins",
    icon: UserCog,
    color: "bg-blue-500",
  },
  {
    key: "total_clients",
    title: "Clients",
    icon: Users,
    color: "bg-green-500",
  },
  
  {
    key: "total_extensions",
    title: "Extensions",
    icon: Phone,
    color: "bg-indigo-500",
  },
  {
    key: "active_calls",
    title: "Active Calls",
    icon: PhoneCall,
    color: "bg-orange-500",
  },
  {
    key: "online_extensions",
    title: "Online",
    icon: Wifi,
    color: "bg-emerald-500",
  },
  {
    key: "offline_extensions",
    title: "Offline",
    icon: Smartphone,
    color: "bg-red-500",
  },
  {
    key: "today_calls",
    title: "Today's Calls",
    icon: CalendarDays,
    color: "bg-violet-500",
  },
  {
    key: "answered_calls",
    title: "Answered Calls",
    icon: CheckCircle2,
    color: "bg-teal-500",
  },
];

export default function OverviewCards({ overview }) {
  if (!overview) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = overview?.[card.key] ?? 0;

        return (
          <div
            key={card.key}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {Number(value).toLocaleString()}
                </h2>
              </div>

              <div
                className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md`}
              >
                <Icon size={26} />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}