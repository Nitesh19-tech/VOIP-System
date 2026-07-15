import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function CarrierTable({
  carriers = [],
  loading,
  onEdit,
  onDelete,
  onViewIPs,
}) {

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-700 p-10 text-center">
        Loading carriers...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-700">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100 dark:bg-slate-800">

            <tr>

              <th className="px-6 py-4 text-left font-semibold">
                Carrier Name
              </th>

              <th className="px-6 py-4 text-left font-semibold">
                Description
              </th>

              <th className="px-6 py-4 text-center font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-center font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {carriers.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  No carriers found.
                </td>

              </tr>

            ) : (

              carriers.map((carrier) => (

                <tr
                  key={carrier.id}
                  className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >

                  <td className="px-6 py-4 font-semibold">
                    {carrier.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {carrier.description || "-"}
                  </td>

                  <td className="px-6 py-4 text-center">

                    {carrier.is_active ? (

                      <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                        Active
                      </span>

                    ) : (

                      <span className="inline-flex rounded-full bg-red-100 px-4 py-1 text-sm font-medium text-red-700">
                        Inactive
                      </span>

                    )}

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() => onViewIPs(carrier)}
                        className="rounded-lg bg-sky-100 p-2 text-sky-700 hover:bg-sky-200"
                        title="Carrier IPs"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => onEdit(carrier)}
                        className="rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
                        title="Edit Carrier"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(carrier)}
                        className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                        title="Delete Carrier"
                      >
                        <Trash2 size={18} />
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