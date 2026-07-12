import { Pencil, Trash2 } from "lucide-react";

export default function CountryTable({
  countries,
  loading,
  onEdit,
  onDelete,
}) {

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        Loading Countries...
      </div>
    );
  }

  if (!countries.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        No Countries Found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-x-auto border border-slate-200 dark:border-slate-800">

      <table className="min-w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>

            <th className="px-5 py-3 text-left">
              Country
            </th>

            <th className="px-5 py-3 text-left">
              ISO Code
            </th>

            <th className="px-5 py-3 text-left">
              Dial Code
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

          {countries.map((country) => (

            <tr
              key={country.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >

              <td className="px-5 py-4 font-semibold">
                {country.name}
              </td>

              <td className="px-5 py-4">
                {country.iso_code || "-"}
              </td>

              <td className="px-5 py-4">
                +{country.dial_code}
              </td>

              <td className="px-5 py-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    country.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {country.is_active ? "Active" : "Inactive"}
                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(country)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(country)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={16} />
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