import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold">
        Analytics
      </h1>

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">

        <BarChart3
          size={70}
          className="mx-auto text-blue-500"
        />

        <h2 className="text-2xl font-bold mt-5">
          Analytics Module
        </h2>

        <p className="text-slate-500 mt-3">
          Coming Soon...
        </p>

      </div>

    </div>
  );
}