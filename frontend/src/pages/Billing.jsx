import { Wallet } from "lucide-react";

export default function Billing() {
  return (
    <div className="p-6 space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Billing
        </h1>

        <p className="text-slate-500 mt-1">
          Billing module is under development.
        </p>

      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-10 text-center">

        <Wallet
          size={70}
          className="mx-auto text-blue-500"
        />

        <h2 className="text-2xl font-bold mt-5">
          Billing Coming Soon
        </h2>

        <p className="text-slate-500 mt-3">
          Credit Balance, Invoices, Payments and Transactions
          will be available here.
        </p>

      </div>

    </div>
  );
}