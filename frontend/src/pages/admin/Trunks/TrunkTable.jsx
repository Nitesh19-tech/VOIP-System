import {
  Pencil,
  Trash2,
} from "lucide-react";

const statusClasses = {
  ACTIVE:
    "bg-green-100 text-green-700",

  INACTIVE:
    "bg-red-100 text-red-700",
};

export default function TrunkTable({

  trunks,

  loading,

  onEdit,

  onDelete,

}) {

  if (loading) {

    return (

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">

        Loading Trunks...

      </div>

    );

  }

  if (!trunks.length) {

    return (

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">

        No Trunks Found

      </div>

    );

  }

  return (

    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-x-auto border border-slate-200 dark:border-slate-800">

      <table className="min-w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-5 py-3 text-left">
              Provider
            </th>

            <th className="px-5 py-3 text-left">
              Host
            </th>

            <th className="px-5 py-3 text-center">
              Port
            </th>

            <th className="px-5 py-3 text-center">
              Transport
            </th>

            <th className="px-5 py-3 text-center">
              Status
            </th>

            <th className="px-5 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>
                      {trunks.map((trunk) => (

            <tr
              key={trunk.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >

              <td className="px-5 py-4 font-semibold">
                {trunk.provider_name}
              </td>

              <td className="px-5 py-4">
                {trunk.host}
              </td>

              <td className="px-5 py-4 text-center">
                {trunk.port}
              </td>

              <td className="px-5 py-4 text-center">
                {trunk.transport}
              </td>

              <td className="px-5 py-4 text-center">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusClasses[trunk.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {trunk.status}
                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(trunk)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(trunk)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}