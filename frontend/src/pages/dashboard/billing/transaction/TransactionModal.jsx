import { useEffect, useState } from "react";

import billingService from "../../../../services/billingService";

import TransactionTable from "./TransactionTable";

export default function TransactionModal({
  open,
  onClose,
  wallet,
}) {

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const loadTransactions = async () => {

    if (!wallet) return;

    try {

      setLoading(true);

      const res =
        await billingService.getTransactions(
          wallet.id
        );

      setTransactions(
        res.data.data || []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (open) {

      loadTransactions();

    }

  }, [open, wallet]);

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-6xl p-6">

        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-2xl font-bold">

              Transaction History

            </h2>

            <p className="text-slate-500 mt-1">

              {wallet?.client_name}

            </p>

          </div>

          <button

            onClick={onClose}

            className="px-5 py-2 rounded-lg bg-slate-300 hover:bg-slate-400"

          >

            Close

          </button>

        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">

            <p className="text-sm text-slate-500">

              Current Balance

            </p>

            <h2 className="text-2xl font-bold text-green-600">

              ₹ {wallet?.balance}

            </h2>

          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">

            <p className="text-sm text-slate-500">

              Credit Limit

            </p>

            <h2 className="text-2xl font-bold">

              ₹ {wallet?.credit_limit}

            </h2>

          </div>

        </div>

        <TransactionTable

          transactions={transactions}

          loading={loading}

        />

      </div>

    </div>

  );

}