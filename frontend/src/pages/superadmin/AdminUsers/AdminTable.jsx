import { Pencil, Trash2 } from "lucide-react";

export default function AdminTable({
  users,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        Loading Users...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-10 text-center">
        No Users Found
      </div>
    );
  }

  const getRole = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin";

      case "COMPANY_ADMIN":
        return "Admin";

      case "CLIENT":
        return "Client";

      default:
        return role;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-800">

      <table className="w-full">

        <thead className="bg-slate-100 dark:bg-slate-800">

          <tr>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Mobile</th>
            <th className="px-5 py-3 text-left">Role</th>
            <th className="px-5 py-3 text-left">Status</th>
            <th className="px-5 py-3 text-center">Actions</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.id}
              className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >

              <td className="px-5 py-4 font-semibold">
                {user.first_name} {user.last_name}
              </td>

              <td className="px-5 py-4">
                {user.email}
              </td>

              <td className="px-5 py-4">
                {user.mobile || "-"}
              </td>

              <td className="px-5 py-4">
                {getRole(user.role)}
              </td>

              <td className="px-5 py-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(user)}
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