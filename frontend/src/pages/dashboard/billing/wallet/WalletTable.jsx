import {
  Plus,
  Minus,
  History,
} from "lucide-react";

export default function WalletTable({

  wallets,

  loading,

  user,

  onRecharge,

  onDebit,

  onTransactions,

}) {

  if (loading) {

    return (

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">

        Loading Wallets...

      </div>

    );

  }

  if (!wallets.length) {

    return (

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">

        No Wallet Found

      </div>

    );

  }

  return (

    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-800">

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-5 py-3 text-left">
              Client
            </th>

            {user?.role === "SUPER_ADMIN" && (

              <th className="px-5 py-3 text-left">
                Admin
              </th>

            )}

            <th className="px-5 py-3 text-left">
              Balance
            </th>

            <th className="px-5 py-3 text-left">
              Credit Limit
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

          {wallets.map((wallet) => (

            <tr

              key={wallet.id}

              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"

            >

              <td className="px-5 py-4 font-semibold">

                {wallet.client_name}

              </td>

              {user?.role === "SUPER_ADMIN" && (

                <td className="px-5 py-4">

                  {wallet.admin_name || "-"}

                </td>

              )}

              <td className="px-5 py-4 font-bold text-green-600">

                ₹ {wallet.balance}

              </td>

              <td className="px-5 py-4">

                ₹ {wallet.credit_limit}

              </td>

              <td className="px-5 py-4">

                <span

                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    wallet.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}

                >

                  {wallet.is_active
                    ? "ACTIVE"
                    : "INACTIVE"}

                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button

                    onClick={() =>
                      onRecharge(wallet)
                    }

                    className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"

                    title="Recharge"

                  >

                    <Plus size={16} />

                  </button>

                  <button

                    onClick={() =>
                      onDebit(wallet)
                    }

                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"

                    title="Debit"

                  >

                    <Minus size={16} />

                  </button>

                  <button

                    onClick={() =>
                      onTransactions(wallet)
                    }

                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"

                    title="Transactions"

                  >

                    <History size={16} />

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