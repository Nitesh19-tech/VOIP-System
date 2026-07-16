import {
  Pencil,
  Trash2,
  Phone,
} from "lucide-react";

const statusClasses = {
  AVAILABLE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",

  ASSIGNED:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",

  RESERVED:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",

  DISABLED:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
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

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center">

        <Phone
          className="mx-auto mb-4 animate-pulse text-blue-500"
          size={40}
        />

        <h3 className="text-xl font-semibold">

          Loading Numbers...

        </h3>

      </div>

    );

  }

  if (!numbers.length) {

    return (

      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-16 text-center">

        <Phone
          className="mx-auto mb-4 text-slate-400"
          size={40}
        />

        <h3 className="text-xl font-semibold">

          No Numbers Found

        </h3>

        <p className="mt-2 text-slate-500">

          Import numbers or create a new DID.

        </p>

      </div>

    );

  }

  return (

    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">

            <tr className="text-xs uppercase tracking-wider text-slate-500">

              <th className="px-6 py-4 text-left">Country</th>

              <th className="px-6 py-4 text-left">DID Number</th>

              <th className="px-6 py-4 text-left">Extension</th>

              {user?.role === "SUPER_ADMIN" && (
                <th className="px-6 py-4 text-left">

                  Admin

                </th>
              )}

              <th className="px-6 py-4 text-left">Client</th>

              <th className="px-6 py-4 text-left">Carrier</th>

              <th className="px-6 py-4 text-left">Termination</th>

              <th className="px-6 py-4 text-right">Purchase</th>

              <th className="px-6 py-4 text-right">Monthly</th>

              <th className="px-6 py-4 text-center">Status</th>

              <th className="px-6 py-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {numbers.map((number, index) => (

              <tr
                key={number.id}
                className={`
                  transition-all
                  hover:bg-blue-50
                  dark:hover:bg-slate-800

                  ${
                    index % 2 === 0
                      ? "bg-white dark:bg-slate-900"
                      : "bg-slate-50 dark:bg-slate-950"
                  }
                `}
              >

                <td className="px-6 py-4">

                  {number.country_name || "-"}

                </td>

                <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">

                  {number.did_number}

                </td>

                <td className="px-6 py-4">

                  {number.extension || "-"}

                </td>

                {user?.role === "SUPER_ADMIN" && (

                  <td className="px-6 py-4">

                    {number.admin_name || "-"}

                  </td>

                )}

                <td className="px-6 py-4">

                  {number.client_name || "-"}

                </td>

                <td className="px-6 py-4">

                  {number.carrier_name || "-"}

                </td>

                <td className="px-6 py-4">

                  {number.termination_name || "-"}

                </td>

                <td className="px-6 py-4 text-right font-medium">

                  ₹ {Number(number.purchase_price || 0).toFixed(2)}

                </td>

                <td className="px-6 py-4 text-right font-medium">

                  ₹ {Number(number.monthly_rental || 0).toFixed(2)}

                </td>

                <td className="px-6 py-4 text-center">

                  <span
                    className={`
                      inline-flex
                      items-center

                      rounded-full

                      px-3
                      py-1

                      text-xs
                      font-bold

                      ${
                        statusClasses[number.status] ||
                        "bg-slate-100 text-slate-700"
                      }
                    `}
                  >

                    {number.status}

                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(number)}
                      className="
                        rounded-xl

                        bg-amber-500

                        p-2.5

                        text-white

                        transition

                        hover:scale-105
                        hover:bg-amber-600
                      "
                    >

                      <Pencil size={16} />

                    </button>

                    <button
                      onClick={() => onDelete(number)}
                      className="
                        rounded-xl

                        bg-red-600

                        p-2.5

                        text-white

                        transition

                        hover:scale-105
                        hover:bg-red-700
                      "
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

    </div>

  );

}