import { useEffect, useState } from "react";
import {
  Plus,
  Search,
} from "lucide-react";

import sipService from "../../../services/sipService";

import SIPTable from "./SIPTable";
import SIPFormModal from "./SIPFormModal";
import SIPDeleteModal from "./SIPDeleteModal";

export default function SIPAccounts({ user }) {

  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [stats, setStats] = useState({

    total: 0,

    active: 0,

    inactive: 0,

    suspended: 0,

  });

  const loadAccounts = async () => {

    try {

      setLoading(true);

      const res =
        await sipService.getSIPs();

      const data =
        res.data.data || [];

      setAccounts(data);

      setStats({

        total: data.length,

        active: data.filter(
          (x) => x.status === "ACTIVE"
        ).length,

        inactive: data.filter(
          (x) => x.status === "INACTIVE"
        ).length,

        suspended: data.filter(
          (x) => x.status === "SUSPENDED"
        ).length,

      });

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadAccounts();

  }, []);

  const filteredAccounts = accounts.filter((item) => {

    const matchesSearch =

      `${item.username}
       ${item.client_name || ""}
       ${item.did_number || ""}
       ${item.country_name || ""}
       ${item.provider || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      !status ||
      item.status === status;

    return (
      matchesSearch &&
      matchesStatus
    );

  });
    const openCreate = () => {

    setSelectedAccount(null);

    setShowForm(true);

  };

  const openEdit = (account) => {

    setSelectedAccount(account);

    setShowForm(true);

  };

  const openDelete = (account) => {

    setSelectedAccount(account);

    setShowDelete(true);

  };

  const saveAccount = async (data) => {

    try {

      setSaving(true);

      if (selectedAccount) {

        await sipService.updateSIP(
          selectedAccount.id,
          data,
        );

      } else {

        await sipService.createSIP(
          data,
        );

      }

      setShowForm(false);

      setSelectedAccount(null);

      await loadAccounts();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to save SIP Account."
      );

    } finally {

      setSaving(false);

    }

  };

  const deleteAccount = async (id) => {

    try {

      setDeleting(true);

      await sipService.deleteSIP(id);

      setShowDelete(false);

      setSelectedAccount(null);

      await loadAccounts();

    } catch (err) {

      console.error(err);

      alert(
        "Unable to delete SIP Account."
      );

    } finally {

      setDeleting(false);

    }

  };

  return (

    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            SIP Accounts
          </h1>

          <p className="text-slate-500 mt-1">
            Manage SIP Accounts.
          </p>

        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >

          <Plus size={18} />

          Add SIP Account

        </button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white dark:bg-slate-900 rounded-xl border shadow p-5">

          <p className="text-sm text-slate-500">
            Total Accounts
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.total}
          </h2>

        </div>

        <div className="bg-green-50 rounded-xl border border-green-100 shadow p-5">

          <p className="text-sm text-green-700">
            Active
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-700">
            {stats.active}
          </h2>

        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-100 shadow p-5">

          <p className="text-sm text-yellow-700">
            Inactive
          </p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-700">
            {stats.inactive}
          </h2>

        </div>

        <div className="bg-red-50 rounded-xl border border-red-100 shadow p-5">

          <p className="text-sm text-red-700">
            Suspended
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-700">
            {stats.suspended}
          </h2>

        </div>

      </div>
            {/* Search & Filters */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search Username, DID, Client, Country..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />

        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        >

          <option value="">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>

          <option value="SUSPENDED">
            Suspended
          </option>

        </select>

      </div>

      {/* Table */}

      <SIPTable
        accounts={filteredAccounts}
        loading={loading}
        user={user}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* Add / Edit Modal */}

      <SIPFormModal
        open={showForm}
        onClose={() => {

          setShowForm(false);

          setSelectedAccount(null);

        }}
        onSave={saveAccount}
        account={selectedAccount}
        user={user}
        saving={saving}
      />

      {/* Delete Modal */}

      <SIPDeleteModal
        open={showDelete}
        onClose={() => {

          setShowDelete(false);

          setSelectedAccount(null);

        }}
        onConfirm={deleteAccount}
        account={selectedAccount}
        deleting={deleting}
      />
          </div>

  );

}