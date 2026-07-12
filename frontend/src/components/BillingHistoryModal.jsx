import React, { useEffect, useState } from "react";
import { X, History } from "lucide-react";
import { getBillingHistory } from "../services/billing";

export default function BillingHistoryModal({ company, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await getBillingHistory(company.id);
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [company]);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-slate-800 rounded-2xl w-full max-w-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <History size={20} />
            </div>
            Billing History: <span className="text-slate-300 font-medium ml-1">{company.name}</span>
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-700 hover:text-white rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 rounded-tr-lg">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500 italic">Loading transaction history...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-500 italic">No billing history found for this company.</td></tr>
              ) : (
                history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono">
                      {new Date(h.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                        ${h.type.toLowerCase() === 'add' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}
                      >
                        {h.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      {h.type.toLowerCase() === 'add' ? '+' : '-'}${Number(h.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{h.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-700 shrink-0 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors">
            Close window
          </button>
        </div>

      </div>
    </div>
  );
}