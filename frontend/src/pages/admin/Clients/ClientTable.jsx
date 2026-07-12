import { Pencil, Trash2 } from "lucide-react";

export default function ClientTable({
  clients,
  loading,
  onEdit,
  onDelete,
  user,
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        Loading Clients...
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        No Clients Found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-800">

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>

            <th className="px-5 py-3 text-left">
              Name
            </th>

            {user?.role === "SUPER_ADMIN" && (
              <th className="px-5 py-3 text-left">
                Assigned Admin
              </th>
            )}

            <th className="px-5 py-3 text-left">
              Email
            </th>

            <th className="px-5 py-3 text-left">
              Phone
            </th>

            <th className="px-5 py-3 text-center">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>

          {clients.map((client) => (

            <tr
              key={client.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >

              <td className="px-5 py-4 font-semibold">
                {client.name}
              </td>

              {user?.role === "SUPER_ADMIN" && (
                <td className="px-5 py-4">
                  {client.admin_name || "Not Assigned"}
                </td>
              )}

              <td className="px-5 py-4">
                {client.email}
              </td>

              <td className="px-5 py-4">
                {client.phone}
              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(client)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(client)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
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