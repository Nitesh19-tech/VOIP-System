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
      <div className="rounded-xl bg-white p-10 text-center shadow dark:bg-slate-900">
        Loading Numbers...
      </div>
    );
  }

  if (!numbers.length) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow dark:bg-slate-900">
        No Numbers Found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow dark:border-slate-800 dark:bg-slate-900">

      <table className="min-w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-5 py-3 text-left">
              Country
            </th>

            <th className="px-5 py-3 text-left">
              DID Number
            </th>

            <th className="px-5 py-3 text-left">
              Extension
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
              Carrier
            </th>

            <th className="px-5 py-3 text-left">
              Termination
            </th>

            <th className="px-5 py-3 text-right">
              Purchase
            </th>

            <th className="px-5 py-3 text-right">
              Monthly Rental
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

          {numbers.map((number) => (

            <tr
              key={number.id}
              className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
            >

              <td className="whitespace-nowrap px-5 py-4">
                {number.country_name || "-"}
              </td>

              <td className="whitespace-nowrap px-5 py-4 font-semibold">
                {number.did_number}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                {number.extension}
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
                {number.carrier_name || "-"}
              </td>

              <td className="px-5 py-4">
                {number.termination_name || "-"}
              </td>

              <td className="px-5 py-4 text-right">
                {number.purchase_price}
              </td>

              <td className="px-5 py-4 text-right">
                {number.monthly_rental}
              </td>

              <td className="px-5 py-4 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
                    className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(number)}
                    className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
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