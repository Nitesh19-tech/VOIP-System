import { useState, useEffect } from "react";
import DashboardCard from "../DashboardCard";
import { Power, UserPlus, FileText, Settings2, X } from "lucide-react";

// Assuming you have these exported from your services
import { toggleCompanyStatus, createCompanyUser, adjustRate } from "../../services/adminCompanies";
import { generateInvoice } from "../../services/billing"; 

export default function CompanyTable({ companies, loading }) {
  const [localCompanies, setLocalCompanies] = useState(companies);

  useEffect(() => {
    setLocalCompanies(companies);
  }, [companies]);

  // --- MODAL STATES ---
  const [userModalCompany, setUserModalCompany] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  const [rateModalCompany, setRateModalCompany] = useState(null);
  const [newRate, setNewRate] = useState("");

  const [invoiceModalCompany, setInvoiceModalCompany] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    month: new Date().getMonth() + 1, // Current month default
    year: new Date().getFullYear()    // Current year default
  });

  const [processing, setProcessing] = useState(false);

  // --- HANDLERS ---

  const handleToggle = async (companyId) => {
    try {
      const res = await toggleCompanyStatus(companyId);
      setLocalCompanies(prev =>
        prev.map(c => c.id === companyId ? { ...c, is_active: res.data.is_active } : c)
      );
    } catch (err) {
      console.error("Toggle failed", err);
      alert("Failed to update company status");
    }
  };

  const handleCreateUser = async () => {
    try {
      setProcessing(true);
      const res = await createCompanyUser(userModalCompany.id, { email: newUserEmail });
      setGeneratedCredentials({
        username: res.data.username,
        password: res.data.password,
      });
      setUserModalCompany(null);
      setNewUserEmail("");
    } catch (err) {
      alert("Failed to create user");
    } finally {
      setProcessing(false);
    }
  };

  const handleAdjustRate = async () => {
    try {
      setProcessing(true);
      // Calls the new Django endpoint we created
      await adjustRate(rateModalCompany.id, { rate_per_minute: newRate });
      
      // Update local state to reflect new rate visually (if you add a rate column later)
      setLocalCompanies(prev => prev.map(c => 
        c.id === rateModalCompany.id ? { ...c, rate_per_minute: newRate } : c
      ));
      
      setRateModalCompany(null);
      setNewRate("");
      alert("Rate updated successfully!");
    } catch (err) {
      alert("Failed to update rate.");
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      setProcessing(true);
      // Calls the new Django admin generate endpoint
      await generateInvoice({
        company_id: invoiceModalCompany.id,
        month: invoiceForm.month,
        year: invoiceForm.year
      });
      setInvoiceModalCompany(null);
      alert("Invoice generated successfully! Check the Billing Dashboard.");
    } catch (err) {
      alert("Failed to generate invoice. Make sure there are completed calls for this period.");
    } finally {
      setProcessing(false);
    }
  };

  // --- UI STYLES ---
  const inputStyle = "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none mb-4";

  return (
    <>
      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Credit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400">Loading companies…</td></tr>
              ) : localCompanies.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No companies found</td></tr>
              ) : (
                localCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-slate-300">{c.email}</td>
                    <td className="px-6 py-4 text-emerald-400 font-mono">
                      {c.currency} {Number(c.credit_balance).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${c.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                        {c.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>

                    {/* ✅ COMBINED ACTIONS COLUMN */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Toggle Status */}
                        <button
                          title={c.is_active ? "Deactivate" : "Activate"}
                          onClick={() => handleToggle(c.id)}
                          className={`p-1.5 rounded-lg transition-colors border ${c.is_active ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"}`}
                        >
                          <Power size={16} />
                        </button>

                        {/* Add User */}
                        <button
                          title="Add Client User"
                          onClick={() => setUserModalCompany(c)}
                          className="p-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 rounded-lg transition-colors"
                        >
                          <UserPlus size={16} />
                        </button>

                        {/* Adjust Rate */}
                        <button
                          title="Adjust Calling Rate"
                          onClick={() => setRateModalCompany(c)}
                          className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg transition-colors"
                        >
                          <Settings2 size={16} />
                        </button>

                        {/* Generate Invoice */}
                        <button
                          title="Force Generate Invoice"
                          onClick={() => setInvoiceModalCompany(c)}
                          className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-lg transition-colors"
                        >
                          <FileText size={16} />
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

      {/* --- ADD USER MODAL --- */}
      {userModalCompany && (
        <Modal onClose={() => setUserModalCompany(null)} title={`Add User to ${userModalCompany.name}`}>
          <input
            placeholder="User Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className={inputStyle}
          />
          <button onClick={handleCreateUser} disabled={processing} className="w-full bg-sky-600 hover:bg-sky-500 py-2.5 rounded-lg text-white font-bold transition-colors disabled:opacity-50">
            {processing ? "Creating..." : "Create User"}
          </button>
        </Modal>
      )}

      {/* --- ADJUST RATE MODAL --- */}
      {rateModalCompany && (
        <Modal onClose={() => setRateModalCompany(null)} title={`Adjust Rate: ${rateModalCompany.name}`}>
          <label className="text-xs text-slate-400 mb-1 block">New Rate Per Minute ($)</label>
          <input
            type="number"
            step="0.0001"
            placeholder="e.g. 0.0250"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            className={inputStyle}
          />
          <button onClick={handleAdjustRate} disabled={processing} className="w-full bg-amber-600 hover:bg-amber-500 py-2.5 rounded-lg text-white font-bold transition-colors disabled:opacity-50">
            {processing ? "Updating..." : "Save New Rate"}
          </button>
        </Modal>
      )}

      {/* --- GENERATE INVOICE MODAL --- */}
      {invoiceModalCompany && (
        <Modal onClose={() => setInvoiceModalCompany(null)} title={`Generate Invoice: ${invoiceModalCompany.name}`}>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-xs text-slate-400 mb-1 block">Month (1-12)</label>
              <input
                type="number"
                min="1" max="12"
                value={invoiceForm.month}
                onChange={(e) => setInvoiceForm({...invoiceForm, month: e.target.value})}
                className={inputStyle}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-400 mb-1 block">Year</label>
              <input
                type="number"
                value={invoiceForm.year}
                onChange={(e) => setInvoiceForm({...invoiceForm, year: e.target.value})}
                className={inputStyle}
              />
            </div>
          </div>
          <button onClick={handleGenerateInvoice} disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-lg text-white font-bold transition-colors disabled:opacity-50">
            {processing ? "Processing..." : "Generate Invoice Now"}
          </button>
        </Modal>
      )}

      {/* --- CREDENTIALS SUCCESS MODAL --- */}
      {generatedCredentials && (
        <Modal onClose={() => setGeneratedCredentials(null)} title="User Created Successfully">
          <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700 mb-6">
            <div>
              <div className="text-slate-500 text-xs mb-1">Username</div>
              <div className="text-emerald-400 font-mono bg-slate-800 px-3 py-2 rounded-lg">{generatedCredentials.username}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-1">Password</div>
              <div className="text-rose-400 font-mono bg-slate-800 px-3 py-2 rounded-lg select-all">{generatedCredentials.password}</div>
            </div>
          </div>
          <button onClick={() => setGeneratedCredentials(null)} className="w-full bg-slate-700 hover:bg-slate-600 py-2.5 rounded-lg text-white font-bold transition-colors">
            Close & Copy
          </button>
        </Modal>
      )}
    </>
  );
}

// --- REUSABLE MODAL WRAPPER ---
function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all" onClick={onClose}>
      <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg text-white font-bold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}