import { Pencil, Trash2 } from "lucide-react";

const statusClasses = {
  AVAILABLE: "bg-green-100 text-green-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  RESERVED: "bg-yellow-100 text-yellow-700",
  DISABLED: "bg-red-100 text-red-700",
};

export default function NumberTable({
  numbers,
  loading,
  onEdit,
  onDelete,
  user,
}) {

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        Loading Numbers...
      </div>
    );
  }

  if (!numbers.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        No Numbers Found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-x-auto border border-slate-200 dark:border-slate-800">

      <table className="min-w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-5 py-3 text-left">
              Country
            </th>

            <th className="px-5 py-3 text-left">
              DID Number
            </th>

            {user?.role === "SUPER_ADMIN" && (
              <th className="px-5 py-3 text-left">
                Admin
              </th>
            )}

            <th className="px-5 py-3 text-left">
              Client
            </th>

            <th className="px-5 py-3 text-left">
              Provider
            </th>

            {user?.role === "SUPER_ADMIN" && (
              <>
                
              </>
            )}

            <th className="px-5 py-3 text-center">
              Status
            </th>

            <th className="px-5 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {numbers.map((number) => (

            <tr
              key={number.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >

              <td className="px-5 py-4 whitespace-nowrap">
                {number.country_name || "-"}
              </td>

              <td className="px-5 py-4 font-semibold whitespace-nowrap">
                {number.did_number}
              </td>

              {user?.role === "SUPER_ADMIN" && (
                <td className="px-5 py-4">
                  {number.admin_name || "-"}
                </td>
              )}

              <td className="px-5 py-4">
                {number.client_name || "-"}
              </td>

              <td className="px-5 py-4">
                {number.provider || "-"}
              </td>

              {user?.role === "SUPER_ADMIN" && (
                <>
                  
                </>
              )}

              <td className="px-5 py-4 text-center">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusClasses[number.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {number.status}
                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(number)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(number)}
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