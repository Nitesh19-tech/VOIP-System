import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function RouteTable({
  routes,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
        Loading Routes...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">

      <table className="min-w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-4 py-3 text-left">
              Routing Plan
            </th>

            <th className="px-4 py-3 text-left">
              Carrier
            </th>

            <th className="px-4 py-3 text-left">
              Prefix
            </th>

            <th className="px-4 py-3 text-center">
              Priority
            </th>

            <th className="px-4 py-3 text-center">
              Strip
            </th>

            <th className="px-4 py-3 text-center">
              Add Prefix
            </th>

            <th className="px-4 py-3 text-left">
              Description
            </th>

            <th className="px-4 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {routes.length === 0 ? (

            <tr>

              <td
                colSpan={8}
                className="py-8 text-center text-slate-500"
              >
                No Routes Found
              </td>

            </tr>

          ) : (

            routes.map((route) => (

              <tr
                key={route.id}
                className="border-t border-slate-200 dark:border-slate-700"
              >

                <td className="px-4 py-3">
                  {route.routing_plan_name ||
                    route.routing_plan}
                </td>

                <td className="px-4 py-3">
                  {route.carrier_name ||
                    route.carrier}
                </td>

                <td className="px-4 py-3 font-medium">
                  {route.prefix}
                </td>

                <td className="px-4 py-3 text-center">
                  {route.priority}
                </td>

                <td className="px-4 py-3 text-center">
                  {route.strip_digits}
                </td>

                <td className="px-4 py-3 text-center">
                  {route.add_prefix}
                </td>

                <td className="px-4 py-3">
                  {route.description}
                </td>

                <td className="px-4 py-3">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(route)}
                      className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(route)}
                      className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}