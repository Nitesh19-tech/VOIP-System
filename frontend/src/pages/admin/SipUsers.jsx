import { useEffect, useState } from "react";
import {
  Phone,
  Plus,
  Power,
  Key,
  X,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import DashboardCard from "../../components/DashboardCard";

import {
  getSipUsers,
  createSipUser,
  updateSipUser,
  deleteSipUser,
} from "../../services/sip";
export default function SipUsers() {
  const [sipUsers, setSipUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [createModal, setCreateModal] = useState(false);
  const [secretModal, setSecretModal] = useState(null);

  // Form state
  const [form, setForm] = useState({
    username: "",
    extension: "",
    company: "",
  });
  const [creating, setCreating] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getSipUsers();
      setSipUsers(res.data);
    } catch (err) {
      console.error("Failed to load SIP users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    if (!form.username || !form.extension || !form.company) {
      alert("All fields are required.");
      return;
    }

    try {
      setCreating(true);
      const res = await createSipUser(form);

      setSecretModal({
        username: res.data.username,
        secret: res.data.secret,
      });

      setCreateModal(false);
      setForm({ username: "", extension: "", company: "" });

      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to create SIP user");
    } finally {
      setCreating(false);
    }
  };




  // Shared Tailwind class for inputs to keep the code clean
  const inputStyle = "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-500 mb-4";

  return (
    <div className="space-y-6 pb-8">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Phone size={24} />
            </div>
            SIP Extension Management
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-11">
            Provision and manage voice extensions for clients.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="bg-sky-600 hover:bg-sky-500 px-4 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20 text-sm"
        >
          <Plus size={18} />
          Create Extension
        </button>
      </div>

      {/* --- TABLE --- */}
      <DashboardCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Extension</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Calls</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                    Loading SIP users...
                  </td>
                </tr>
              ) : sipUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                    No SIP users found. Create one to get started.
                  </td>
                </tr>
              ) : (
                sipUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{u.username}</td>
                    <td className="px-6 py-4 font-mono text-sky-400">{u.extension}</td>
                    <td className="px-6 py-4 text-slate-300">{u.company}</td>
                    <td className="px-6 py-4 font-medium text-slate-300">
                      {u.call_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${u.is_active
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {u.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 bg-blue-600 rounded-lg text-white"
                        >
                          Edit
                        </button>

                        <button
                          className="p-2 bg-red-600 rounded-lg text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* --- CREATE MODAL --- */}
      {createModal && (
        <Modal onClose={() => setCreateModal(false)}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl text-white font-bold tracking-tight">Create SIP User</h3>
            <button
              onClick={() => setCreateModal(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 ml-1">Username</label>
            <input
              placeholder="e.g. client_1001"
              className={inputStyle}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <label className="text-xs font-medium text-slate-400 ml-1">Extension Number</label>
            <input
              placeholder="e.g. 1001"
              className={inputStyle}
              value={form.extension}
              onChange={(e) => setForm({ ...form, extension: e.target.value })}
            />

            <label className="text-xs font-medium text-slate-400 ml-1">Company ID</label>
            <input
              placeholder="e.g. 1"
              className={inputStyle}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full mt-4 bg-sky-600 hover:bg-sky-500 py-2.5 rounded-lg text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            {creating ? "Provisioning..." : "Create SIP Account"}
          </button>
        </Modal>
      )}

      {/* --- SECRET MODAL --- */}
      {secretModal && (
        <Modal onClose={() => setSecretModal(null)}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl text-white font-bold mb-2 tracking-tight">
              Credentials Generated
            </h3>

            <div className="flex items-start gap-2 bg-amber-500/10 text-amber-400 text-xs px-4 py-3 rounded-lg border border-amber-500/20 mb-6 w-full">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p className="text-left leading-relaxed">
                Copy this password now. For security reasons, it will <strong className="font-bold">not</strong> be shown again.
              </p>
            </div>

            <div className="w-full space-y-4 text-sm text-left bg-slate-900/50 p-5 rounded-xl border border-slate-700">
              <div>
                <div className="text-slate-500 text-xs font-medium mb-1">Username / Extension</div>
                <div className="text-white font-mono bg-slate-800 px-3 py-2.5 rounded-lg border border-slate-700">
                  {secretModal.username}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-xs font-medium mb-1">SIP Password (Secret)</div>
                <div className="text-rose-400 font-mono bg-slate-800 px-3 py-2.5 rounded-lg border border-slate-700 select-all tracking-wider font-bold">
                  {secretModal.secret}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSecretModal(null)}
              className="w-full mt-6 bg-slate-700 hover:bg-slate-600 py-2.5 rounded-lg text-white font-bold text-sm transition-colors"
            >
              I have copied the password
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}

// --- MODAL COMPONENT ---
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}