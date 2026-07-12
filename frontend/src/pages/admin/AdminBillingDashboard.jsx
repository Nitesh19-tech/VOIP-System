import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, CheckCircle, Wallet, Clock, Filter } from "lucide-react";

import DashboardCard from "../../components/DashboardCard";
import AdjustCreditModal from "../../components/AdjustCreditModal";
import BillingHistoryModal from "../../components/BillingHistoryModal";

import {
  getInvoices,
  markInvoicePaid,
  getRevenueSummary
} from "../../services/billing";
import companyService from "../../services/companyService";

export default function AdminBillingDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [revenue, setRevenue] = useState({ today: 0, month: 0, currency: "USD" });
  
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  
  const [creditModalCompany, setCreditModalCompany] = useState(null);
  const [historyModalCompany, setHistoryModalCompany] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoiceRes, revenueRes, companyRes] = await Promise.all([
        getInvoices(),
        getRevenueSummary(),
        companyService.getCompanies(),
      ]);

      setInvoices(invoiceRes.data || []);
      setRevenue(revenueRes.data || { today: 0, month: 0, currency: "USD" });
      setCompanies(companyRes.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter && inv.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (selectedCompany && String(inv.company) !== String(selectedCompany)) return false;
    return true;
  });

  const handleMarkPaid = async (id) => {
    if (!window.confirm("Mark this invoice as paid?")) return;
    try {
      await markInvoicePaid(id);
      loadData(); // Refresh table
    } catch {
      alert("Failed to update invoice status.");
    }
  };

  return (
    <div className="space-y-6 pb-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <DollarSign size={24} />
          </div>
          Admin Billing Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1 ml-11">
          Monitor revenue, manage client invoices, and adjust wallet credits.
        </p>
      </div>

      {/* REVENUE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard className="p-6 relative overflow-hidden border-emerald-500/20">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div>
              <div className="text-slate-400 text-sm font-medium">Revenue Today</div>
              <div className="text-3xl font-bold text-white tracking-tight mt-1">
                <span className="text-emerald-400 text-xl mr-1">{revenue.currency}</span>
                {Number(revenue.today).toFixed(2)}
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="p-6 relative overflow-hidden border-sky-500/20">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-slate-400 text-sm font-medium">Revenue This Month</div>
              <div className="text-3xl font-bold text-white tracking-tight mt-1">
                <span className="text-sky-400 text-xl mr-1">{revenue.currency}</span>
                {Number(revenue.month).toFixed(2)}
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select
          className="bg-slate-900 border border-slate-700 text-sm text-white px-3 py-2 rounded-lg focus:border-sky-500 outline-none min-w-37.5"
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
        </select>

        <select
          className="bg-slate-900 border border-slate-700 text-sm text-white px-3 py-2 rounded-lg focus:border-sky-500 outline-none min-w-50"
          onChange={(e) => setSelectedCompany(e.target.value)}
          value={selectedCompany}
        >
          <option value="">All Companies</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* INVOICE TABLE */}
      <DashboardCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading invoices...</td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No invoices match your filters.</td></tr>
              ) : (
                filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{inv.company_name}</td>
                    
                    {/* ✅ Uses the correct Date field now */}
                    <td className="px-6 py-4 text-slate-400 font-mono">{inv.date}</td>
                    
                    <td className="px-6 py-4 font-mono text-emerald-400 font-medium">
                      {inv.currency} {Number(inv.total_cost).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border capitalize
                        ${inv.status.toLowerCase() === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          inv.status.toLowerCase() === 'overdue' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status.toLowerCase() !== "paid" && (
                          <button
                            title="Mark as Paid"
                            onClick={() => handleMarkPaid(inv.id)}
                            className="p-1.5 bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 rounded-lg transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        
                        {/* ✅ Safe matching logic for modal data */}
                        <button
                          title="Adjust Credit"
                          onClick={() => {
                            const foundCompany = companies.find(c => String(c.id) === String(inv.company));
                            setCreditModalCompany(foundCompany || { id: inv.company, name: inv.company_name });
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 border border-slate-700 hover:border-sky-500/30 rounded-lg transition-colors"
                        >
                          <Wallet size={16} />
                        </button>
                        
                        {/* ✅ Safe matching logic for modal data */}
                        <button
                          title="View History"
                          onClick={() => {
                            const foundCompany = companies.find(c => String(c.id) === String(inv.company));
                            setHistoryModalCompany(foundCompany || { id: inv.company, name: inv.company_name });
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 border border-slate-700 hover:border-indigo-500/30 rounded-lg transition-colors"
                        >
                          <Clock size={16} />
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

      {/* MODALS */}
      {creditModalCompany && (
        <AdjustCreditModal
          company={creditModalCompany}
          onClose={() => setCreditModalCompany(null)}
          refresh={loadData}
        />
      )}

      {historyModalCompany && (
        <BillingHistoryModal
          company={historyModalCompany}
          onClose={() => setHistoryModalCompany(null)}
        />
      )}

    </div>
  );
}