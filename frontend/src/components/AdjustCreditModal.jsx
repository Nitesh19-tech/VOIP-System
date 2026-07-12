import React, { useState } from "react";
import { X, Wallet, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { adjustCredit } from "../services/billing";

export default function AdjustCreditModal({ company, onClose, refresh }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("add");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    try {
      setLoading(true);
      await adjustCredit(company.id, { amount: Number(amount), type });
      refresh();
      onClose();
    } catch (err) {
      alert("Failed to adjust credit.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wallet size={20} className="text-sky-400" />
            Adjust Credit
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-400">Target Company:</p>
          <p className="font-semibold text-white">{company.name}</p>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="text-xs text-slate-400 ml-1">Action Type</label>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setType("add")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border transition-colors ${
                  type === "add" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold" : "bg-slate-900 border-slate-700 text-slate-400"
                }`}
              >
                <ArrowDownToLine size={16} /> Add
              </button>
              <button
                onClick={() => setType("deduct")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border transition-colors ${
                  type === "deduct" ? "bg-rose-500/20 border-rose-500 text-rose-400 font-bold" : "bg-slate-900 border-slate-700 text-slate-400"
                }`}
              >
                <ArrowUpFromLine size={16} /> Deduct
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 ml-1">Amount</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-white focus:border-sky-500 outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2 bg-sky-600 hover:bg-sky-500 py-2.5 rounded-lg text-white font-bold transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Adjustment"}
          </button>
        </div>

      </div>
    </div>
  );
}