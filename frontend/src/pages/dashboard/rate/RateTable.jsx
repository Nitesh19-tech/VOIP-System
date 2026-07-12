import { Pencil, Trash2 } from "lucide-react";

export default function RateTable({
  rates,
  loading,
  onEdit,
  onDelete,
}) {

  if (loading) {

    return (

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">

        Loading Rates...

      </div>

    );

  }

  if (!rates.length) {

    return (

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">

        No Rates Found

      </div>

    );

  }

  return (

    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-800">

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-5 py-3 text-left">
              Country
            </th>

            <th className="px-5 py-3 text-left">
              Destination
            </th>

            <th className="px-5 py-3 text-left">
              Prefix
            </th>

            <th className="px-5 py-3 text-left">
              Provider
            </th>

            <th className="px-5 py-3 text-right">
              Buy Rate
            </th>

            <th className="px-5 py-3 text-right">
              Sell Rate
            </th>

            <th className="px-5 py-3 text-center">
              Billing
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

          {rates.map((rate) => (

            <tr
              key={rate.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            >

              <td className="px-5 py-4 font-medium">

                {rate.country_name}

              </td>

              <td className="px-5 py-4">

                {rate.destination}

              </td>

              <td className="px-5 py-4">

                {rate.prefix}

              </td>

              <td className="px-5 py-4">

                {rate.provider || "-"}

              </td>

              <td className="px-5 py-4 text-right font-mono">

                ${Number(rate.buy_rate).toFixed(6)}

              </td>

              <td className="px-5 py-4 text-right font-mono text-green-600">

                ${Number(rate.sell_rate).toFixed(6)}

              </td>

              <td className="px-5 py-4 text-center">

                {rate.billing_block}/{rate.billing_block}

              </td>

              <td className="px-5 py-4 text-center">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rate.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {rate.status}

                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(rate)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                  >

                    <Pencil size={16} />

                  </button>

                  <button
                    onClick={() => onDelete(rate)}
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