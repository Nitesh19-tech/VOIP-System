import { Pencil, Trash2 } from "lucide-react";

const statusClasses = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-yellow-100 text-yellow-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

export default function SIPTable({
  accounts,
  loading,
  user,
  onEdit,
  onDelete,
}) {

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        Loading SIP Accounts...
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        No SIP Accounts Found
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
              Username
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
              DID Number
            </th>

            <th className="px-5 py-3 text-left">
              Extension
            </th>

            <th className="px-5 py-3 text-left">
              Provider
            </th>

            <th className="px-5 py-3 text-left">
              Transport
            </th>

            <th className="px-5 py-3 text-left">
              Status
            </th>

            <th className="px-5 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {accounts.map((account) => (

            <tr
              key={account.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >

              <td className="px-5 py-4">
                {account.country_name || "-"}
              </td>

              <td className="px-5 py-4 font-semibold">
                {account.username}
              </td>

              {user?.role === "SUPER_ADMIN" && (

                <td className="px-5 py-4">
                  {account.admin_name || "-"}
                </td>

              )}

              <td className="px-5 py-4">
                {account.client_name || "-"}
              </td>

              <td className="px-5 py-4 font-medium">
                {account.did_number || "-"}
              </td>

              <td className="px-5 py-4">
                {account.extension || "-"}
              </td>

              <td className="px-5 py-4">
                {account.provider || "-"}
              </td>

              <td className="px-5 py-4">
                {account.transport}
              </td>

              <td className="px-5 py-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusClasses[account.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {account.status}
                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(account)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(account)}
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