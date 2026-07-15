import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function TerminationTable({
  terminations,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400 shadow-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-800/80 backdrop-blur">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                Carrier
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                Name
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                Prefix
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                Currency
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                Payment
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-300">
                Payout
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                Max Duration
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                Status
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {terminations.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-20 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-lg font-semibold text-slate-300">
                      No Terminations Found
                    </p>

                    <p className="text-sm text-slate-500">
                      Create your first termination to start routing calls.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              terminations.map((item) => (
                <tr
                  key={item.id}
                  className="transition hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4 text-slate-200">
                    {item.carrier_name}
                  </td>

                  <td className="px-5 py-4 font-medium text-white">
                    {item.name}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {item.prefix}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {item.currency}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {item.payment_term}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-300">
                    {item.carrier_payout}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-300">
                    {item.max_duration}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {item.is_active ? (
                      <span className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500 hover:text-white"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => onDelete(item)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}