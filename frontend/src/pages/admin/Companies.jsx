import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Building2, Plus, Users, Briefcase } from "lucide-react";

import DashboardCard from "../../components/DashboardCard";
import CompanyTable from "../../components/admin/CompanyTable";

import { getCompanies, createCompany } from "../../services/adminCompanies";

export default function Companies() {
  const { user } = useOutletContext();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    currency: "USD",
    country: "",
    credit_balance: 0,
  });

  // ==============================
  // Load Companies
  // ==============================
  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await getCompanies();
      setCompanies(res.data);
    } catch (err) {
      console.error("Failed to load companies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // ==============================
  // Handle Input Change
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "credit_balance"
          ? parseFloat(value || 0)
          : value,
    });
  };

  // ==============================
  // Handle Submit
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      country: form.country.trim().toUpperCase(),
      credit_balance: parseFloat(form.credit_balance || 0),
    };

    if (!cleanForm.name || !cleanForm.email) {
      alert("Company Name and Email are required.");
      return;
    }

    try {
      setCreating(true);

      const res = await createCompany(cleanForm);

      // Clear form first
      setForm({
        name: "",
        email: "",
        currency: "USD",
        country: "",
        credit_balance: 0,
      });

      // Refresh table
      await loadCompanies();

      // Show credentials modal
      setGeneratedCredentials({
        username: res.data.client_username,
        password: res.data.client_password,
      });

    } catch (err) {
      console.error("Create company error:", err.response?.data || err);

      alert(
        err.response?.data?.detail ||
        "Failed to create company. Please check inputs."
      );

    } finally {
      setCreating(false);
    }
  };

  const inputStyle =
    "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-500";

  return (
    <div className="space-y-6 pb-8">

      {/* ==============================
          HEADER
      ============================== */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
            <Briefcase size={24} />
          </div>
          Company Management
        </h1>
        <p className="text-slate-400 text-sm mt-1 ml-11">
          Create new client accounts and manage existing balances.
        </p>
      </div>

      {/* ==============================
          CREATE COMPANY FORM
      ============================== */}
      <DashboardCard className="p-6 border-sky-500/20 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <Building2 size={20} className="text-sky-400" />
          <h3 className="text-lg font-bold text-white">
            Register New Company
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
        >
          <div className="lg:col-span-2">
            <input
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div className="lg:col-span-2">
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div className="lg:col-span-1">
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="lg:col-span-1">
            <input
              name="country"
              placeholder="Country (e.g., US, IN)"
              value={form.country}
              onChange={handleChange}
              className={inputStyle}
              maxLength="2"
            />
          </div>

          <div className="lg:col-span-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
                Bal:
              </span>
              <input
                type="number"
                name="credit_balance"
                placeholder="0.00"
                step="0.01"
                value={form.credit_balance}
                onChange={handleChange}
                className={`${inputStyle} pl-12`}
              />
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={18} />
              {creating ? "Provisioning..." : "Create Company"}
            </button>
          </div>
        </form>
      </DashboardCard>

      {/* ==============================
          COMPANY TABLE
      ============================== */}
      <DashboardCard className="overflow-hidden">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              Active Companies
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            Total: {companies.length}
          </div>
        </div>

        <CompanyTable companies={companies} loading={loading} />
      </DashboardCard>

      {/* ==============================
          CREDENTIALS MODAL
      ============================== */}
      {generatedCredentials && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-xl w-96 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">
              Client Credentials Generated
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-400">Username:</span>
                <div className="font-mono text-emerald-400">
                  {generatedCredentials.username}
                </div>
              </div>

              <div>
                <span className="text-slate-400">Temporary Password:</span>
                <div className="font-mono text-rose-400">
                  {generatedCredentials.password}
                </div>
              </div>
            </div>

            <button
              onClick={() => setGeneratedCredentials(null)}
              className="mt-6 w-full bg-sky-600 hover:bg-sky-500 py-2 rounded-lg text-white font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

{/* <div className="flex items-center gap-3 mb-6 relative">
          <Building2 size={20} className="text-sky-400" />
          <h3 className="text-lg font-bold text-white">
            Register New Company
          </h3>
        </div>

 */}