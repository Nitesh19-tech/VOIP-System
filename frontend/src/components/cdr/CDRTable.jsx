import {
  PhoneIncoming,
  PhoneOutgoing,
  Eye,
} from "lucide-react";

const badgeColors = {
  ANSWERED: "bg-green-100 text-green-700",
  BUSY: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  "NO ANSWER": "bg-gray-100 text-gray-700",
};

const formatDuration = (seconds = 0) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CDRTable({
  loading,
  data,
  onView,
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-8 text-center">
        Loading...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center text-slate-500">
        No Call Records Found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow">

      <table className="min-w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Caller</th>
            <th className="px-4 py-3 text-left">Receiver</th>
            <th className="px-4 py-3 text-left">Duration</th>
            <th className="px-4 py-3 text-left">Talk Time</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Channel</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((call) => (
            <tr
              key={call.id}
              className="border-t hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                {formatDate(call.start_time)}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <PhoneOutgoing
                    size={16}
                    className="text-blue-500"
                  />
                  {call.caller_number}
                </div>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <PhoneIncoming
                    size={16}
                    className="text-green-500"
                  />
                  {call.receiver_number}
                </div>
              </td>

              <td className="px-4 py-3">
                {formatDuration(call.duration)}
              </td>

              <td className="px-4 py-3">
                {formatDuration(call.billsec)}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    badgeColors[call.disposition] ||
                    "bg-slate-100 text-slate-700"
                  }`}
                >
                  {call.disposition}
                </span>
              </td>

              <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">
                {call.channel}
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onView(call)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  <Eye size={16} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}