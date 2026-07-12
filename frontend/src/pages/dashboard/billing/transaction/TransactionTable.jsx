export default function TransactionTable({
  transactions,
  loading,
}) {

  if (loading) {

    return (

      <div className="p-10 text-center">

        Loading Transactions...

      </div>

    );

  }

  if (!transactions.length) {

    return (

      <div className="p-10 text-center">

        No Transactions Found

      </div>

    );

  }

  return (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-4 py-3 text-left">
              Date
            </th>

            <th className="px-4 py-3 text-left">
              Type
            </th>

            <th className="px-4 py-3 text-left">
              Amount
            </th>

            <th className="px-4 py-3 text-left">
              Reference
            </th>

            <th className="px-4 py-3 text-left">
              Description
            </th>

            <th className="px-4 py-3 text-left">
              Created By
            </th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((item) => (

            <tr
              key={item.id}
              className="border-t border-slate-200 dark:border-slate-700"
            >

              <td className="px-4 py-3">

                {new Date(
                  item.created_at
                ).toLocaleString()}

              </td>

              <td className="px-4 py-3">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.transaction_type === "RECHARGE"
                      ? "bg-green-100 text-green-700"
                      : item.transaction_type === "DEBIT"
                      ? "bg-red-100 text-red-700"
                      : item.transaction_type === "REFUND"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >

                  {item.transaction_type}

                </span>

              </td>

              <td className="px-4 py-3 font-semibold">

                ₹ {item.amount}

              </td>

              <td className="px-4 py-3">

                {item.reference || "-"}

              </td>

              <td className="px-4 py-3">

                {item.description || "-"}

              </td>

              <td className="px-4 py-3">

                {item.created_by_name || "-"}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}