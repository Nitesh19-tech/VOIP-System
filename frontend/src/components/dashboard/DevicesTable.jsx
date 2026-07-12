export default function DevicesTable({ devices }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">

      <div className="px-6 py-4 border-b dark:border-slate-800">

        <h2 className="text-xl font-semibold">
          Registered Devices
        </h2>

      </div>

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="text-left px-5 py-3">
              Extension
            </th>

            <th className="text-left px-5 py-3">
              IP Address
            </th>

            <th className="text-left px-5 py-3">
              Port
            </th>

            <th className="text-left px-5 py-3">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {devices.length === 0 ? (

            <tr>

              <td
                colSpan="4"
                className="text-center py-8"
              >
                No Devices
              </td>

            </tr>

          ) : (

            devices.map((device, index) => (

              <tr
                key={index}
                className="border-t dark:border-slate-800"
              >

                <td className="px-5 py-4">
                  {device.extension}
                </td>

                <td className="px-5 py-4">
                  {device.ip_address}
                </td>

                <td className="px-5 py-4">
                  {device.port}
                </td>

                <td className="px-5 py-4">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {device.status}
                  </span>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}