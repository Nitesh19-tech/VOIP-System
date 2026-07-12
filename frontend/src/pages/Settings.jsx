
import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Building2,
  Shield,
  Bell,
  Wallet,
  LogOut,
  Save,
  Lock,      // ✅ New Icon
  KeyRound   // ✅ New Icon
} from "lucide-react";

import DashboardCard from "../components/DashboardCard";
// ✅ Import changePassword service
import { updateCompanySettings, logoutAllSessions, changePassword } from "../services/accounts";

export default function Settings() {
  const outlet = useOutletContext();
  const navigate = useNavigate();

  if (!outlet || !outlet.user) return null;

  const user = outlet.user;
  const company = user.company;

  const [country, setCountry] = useState(company?.country || "");
  const [saving, setSaving] = useState(false);

  // ✅ Password State
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [passLoading, setPassLoading] = useState(false);

  /* Save company settings */
  const saveCompany = async () => {
    try {
      setSaving(true);
      await updateCompanySettings({ country });
      alert("Company settings updated");
    } catch (err) {
      alert("Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  /* ✅ Handle Password Change */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      setPassLoading(true);
      await changePassword({
        old_password: passwords.old,
        new_password: passwords.new
      });
      alert("Password changed successfully!");
      setPasswords({ old: "", new: "", confirm: "" }); // Reset form
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || "Failed to change password";
      alert(msg);
    } finally {
      setPassLoading(false);
    }
  };

  /* Logout all sessions */
  const logoutAll = async () => {
    if (!confirm("Logout all sessions?")) return;
    try {
      await logoutAllSessions();
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } catch (err) {
      alert("Failed to logout sessions");
    }
  };

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account & system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Company Profile (Existing) */}
        <DashboardCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="text-sky-400" />
            <h3 className="text-lg font-bold text-white">Company Profile</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-slate-400">Company Name</span>
              <div className="text-white font-medium">{company?.name}</div>
            </div>
            <div>
              <span className="text-slate-400">Country</span>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="IN / US / UK"
                className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 outline-none"
              />
            </div>
            <button
              onClick={saveCompany}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </DashboardCard>
 {/* Billing Overview */}
        <DashboardCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Billing Overview</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-slate-400">Balance</span>
              <div className="text-white font-bold text-xl">
                {company?.credit_balance} {company?.currency}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Billing & payments are managed from the Billing page.
            </p>
          </div>
        </DashboardCard>


        {/* ✅ NEW: Change Password Card */}
        <DashboardCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-amber-400" />
            <h3 className="text-lg font-bold text-white">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-sm">
            <div>
              <span className="text-slate-400">Current Password</span>
              <div className="relative mt-1">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={passwords.old}
                  onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-white focus:border-amber-500 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400">New Password</span>
                <input
                  type="password"
                  required
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 outline-none"
                  placeholder="New pass"
                />
              </div>
              <div>
                <span className="text-slate-400">Confirm</span>
                <input
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className={`mt-1 w-full bg-slate-900 border rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500
                    ${passwords.confirm && passwords.new !== passwords.confirm ? "border-rose-500" : "border-slate-700"}`}
                  placeholder="Confirm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-colors"
            >
              <Shield size={16} />
              {passLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </DashboardCard>


        {/* Security / Logout */}
        <DashboardCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-rose-400" />
            <h3 className="text-lg font-bold text-white">Session Security</h3>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              If you suspect unauthorized access, log out of all devices immediately.
            </p>
            <button
              onClick={logoutAll}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-sm transition-colors border border-rose-500/20"
            >
              <LogOut size={16} />
              Logout All Sessions
            </button>
          </div>
        </DashboardCard>

      </div>
    </div>
  );
}