import { Pencil, Trash2 } from "lucide-react";

export default function CompanyTable({
  companies,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        Loading Companies...
      </div>
    );
  }

  if (!companies.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        No Companies Found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-800">
      <table className="w-full">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            <th className="px-5 py-3 text-left">Company</th>
            <th className="px-5 py-3 text-left">Code</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Phone</th>
            <th className="px-5 py-3 text-left">City</th>
            <th className="px-5 py-3 text-left">Country</th>
            <th className="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company) => (
            <tr
              key={company.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <td className="px-5 py-4 font-semibold">
                {company.name}
              </td>

              <td className="px-5 py-4">
                {company.code}
              </td>

              <td className="px-5 py-4">
                {company.email}
              </td>

              <td className="px-5 py-4">
                {company.phone}
              </td>

              <td className="px-5 py-4">
                {company.city}
              </td>

              <td className="px-5 py-4">
                {company.country}
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(company)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(company)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
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