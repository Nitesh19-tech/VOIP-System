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
      <div className="rounded-xl bg-white p-10 text-center shadow">
        Loading...
      </div>
    );

  }

  return (

    <div className="overflow-x-auto rounded-xl bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-4 py-3 text-left">
              Carrier
            </th>

            <th className="px-4 py-3 text-left">
              Name
            </th>

            <th className="px-4 py-3 text-left">
              Prefix
            </th>

            <th className="px-4 py-3 text-left">
              Currency
            </th>

            <th className="px-4 py-3 text-left">
              Payment
            </th>

            <th className="px-4 py-3 text-right">
              Payout
            </th>

            <th className="px-4 py-3 text-center">
              Max Duration
            </th>

            <th className="px-4 py-3 text-center">
              Status
            </th>

            <th className="px-4 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {terminations.length === 0 && (

            <tr>

              <td
                colSpan={9}
                className="py-10 text-center text-slate-500"
              >
                No Terminations Found
              </td>

            </tr>

          )}

          {terminations.map((item) => (

            <tr
              key={item.id}
              className="border-t"
            >

              <td className="px-4 py-3">

                {item.carrier_name}

              </td>

              <td className="px-4 py-3">

                {item.name}

              </td>

              <td className="px-4 py-3">

                {item.prefix}

              </td>

              <td className="px-4 py-3">

                {item.currency}

              </td>

              <td className="px-4 py-3">

                {item.payment_term}

              </td>

              <td className="px-4 py-3 text-right">

                {item.carrier_payout}

              </td>

              <td className="px-4 py-3 text-center">

                {item.max_duration}

              </td>

              <td className="px-4 py-3 text-center">

                {item.is_active ? (

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                    Active

                  </span>

                ) : (

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                    Inactive

                  </span>

                )}

              </td>

              <td className="px-4 py-3">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(item)}
                    className="rounded bg-blue-100 p-2 text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    className="rounded bg-red-100 p-2 text-red-600"
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