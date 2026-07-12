export default function ActiveCallsTable({ calls }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">

      <div className="px-6 py-4 border-b dark:border-slate-800">
        <h2 className="text-xl font-semibold">
          Active Calls
        </h2>
      </div>

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>
            <th className="text-left px-5 py-3">Extension</th>
            <th className="text-left px-5 py-3">Connected To</th>
            <th className="text-left px-5 py-3">State</th>
            <th className="text-left px-5 py-3">Application</th>
          </tr>

        </thead>

        <tbody>

          {calls.length === 0 ? (

            <tr>
              <td colSpan="4" className="text-center py-8">
                No Active Calls
              </td>
            </tr>

          ) : (

            calls.map((call, index) => (

              <tr
                key={index}
                className="border-t dark:border-slate-800"
              >

                <td className="px-5 py-4">
                  {call.extension}
                </td>

                <td className="px-5 py-4">
                  {call.connected_to}
                </td>

                <td className="px-5 py-4">
                  {call.state}
                </td>

                <td className="px-5 py-4">
                  {call.application}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}