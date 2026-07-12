const badgeColor = (status) => {
  switch (status) {
    case "Not in use":
      return "bg-green-100 text-green-700";

    case "In use":
      return "bg-blue-100 text-blue-700";

    case "Busy":
      return "bg-red-100 text-red-700";

    case "Ringing":
      return "bg-yellow-100 text-yellow-700";

    case "Unavailable":
      return "bg-gray-200 text-gray-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function ExtensionsTable({ extensions }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">

      <div className="px-6 py-4 border-b dark:border-slate-800">
        <h2 className="text-xl font-semibold">
          Extensions
        </h2>
      </div>

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="text-left px-5 py-3">
              Extension
            </th>

            <th className="text-left px-5 py-3">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {extensions.length === 0 ? (

            <tr>

              <td
                colSpan="2"
                className="text-center py-8"
              >
                No Extensions
              </td>

            </tr>

          ) : (

            extensions.map((item, index) => (

              <tr
                key={index}
                className="border-t dark:border-slate-800"
              >

                <td className="px-5 py-4 font-medium">
                  {item.extension}
                </td>

                <td className="px-5 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${badgeColor(item.status)}`}
                  >
                    {item.status}
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