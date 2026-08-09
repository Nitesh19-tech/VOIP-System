export default function ActiveCallsTable({ calls = [] }) {
  return (
    <div className="w-full">

      {/* Header */}

      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Active Calls
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Currently active calls on the platform
            </p>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {calls.length} Active
            </span>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50 dark:bg-slate-800/50">

            <tr>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Extension
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Connected To
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                State
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Application
              </th>

            </tr>

          </thead>

          <tbody>

            {calls.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="px-6 py-12 text-center"
                >

                  <div className="text-sm font-medium text-slate-500">
                    No Active Calls
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    There are currently no active calls.
                  </div>

                </td>

              </tr>

            ) : (

              calls.map((call, index) => (

                <tr
                  key={call.id || call.channel || index}
                  className="
                    border-t
                    border-slate-100
                    dark:border-slate-800
                    hover:bg-slate-50
                    dark:hover:bg-slate-800/40
                    transition-colors
                  "
                >

                  <td className="px-6 py-4">

                    <span className="font-medium text-slate-900 dark:text-white">
                      {call.extension || "-"}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {call.connected_to || "-"}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        bg-emerald-50
                        dark:bg-emerald-500/10
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      {call.state || "-"}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {call.application || "-"}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}