import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import CreateSipUser from "../components/CreateSipUser";
import { getSipUsers } from "../services/sip";

export default function Users({ user }) {
  const [sipUsers, setSipUsers] = useState([]);

  const loadUsers = async () => {
    const res = await getSipUsers();
    setSipUsers(res.data || []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">SIP Users</h1>
          <p className="text-slate-400 text-sm">
            Manage SIP extensions and credentials
          </p>
        </div>
      </div>

      {/* Create SIP User (ADMIN ONLY) */}
      {user?.role === "admin" && (
        <CreateSipUser onCreated={loadUsers} />
      )}

      {/* SIP Users Table */}
      <DashboardCard>
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-white">
            Registered Extensions
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left">Extension</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {sipUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-500">
                    No SIP users found
                  </td>
                </tr>
              ) : (
                sipUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-700/20">
                    <td className="px-6 py-4 font-mono text-white">
                      {u.extension}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${u.is_active
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"}`}>
                        {u.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(u.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
