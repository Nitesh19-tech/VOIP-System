import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Upload,
} from "lucide-react";

import numberPoolService from "../../../services/numberPoolService";
import { getCountries } from "../../../services/countryService";

import NumberTable from "./NumberTable";
import NumberFormModal from "./NumberFormModal";
import NumberDeleteModal from "./NumberDeleteModal";

export default function NumberPool({ user }) {

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    reserved: 0,
    disabled: 0,
  });

  const [numbers, setNumbers] = useState([]);
  const [countries, setCountries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedNumber, setSelectedNumber] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");

  const loadStatistics = async () => {

    try {

      const res =
        await numberPoolService.getStatistics();

      setStats(res.data.data);

    } catch (err) {

      console.error(err);

    }

  };

  const loadCountries = async () => {

    try {

      const res =
        await getCountries();

      setCountries(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadNumbers = async () => {

    try {

      setLoading(true);

      const res =
        await numberPoolService.getNumbers({

          search,
          country,
          status,
          provider,

        });

      setNumbers(res.data.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadStatistics();

    loadCountries();

  }, []);

  useEffect(() => {

    loadNumbers();

  }, [

    search,
    country,
    status,
    provider,

  ]);
  const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      const res =
        await numberPoolService.importNumbers(file);

      const result = res.data.data;

      alert(`Import Completed

Imported : ${result.imported}

Duplicate : ${result.duplicates}

Invalid : ${result.invalid}`);

      await loadNumbers();

      await loadStatistics();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Import failed."
      );

    }

    e.target.value = "";

  };

  const openCreate = () => {

    setSelectedNumber(null);

    setShowForm(true);

  };

  const openEdit = (number) => {

    setSelectedNumber(number);

    setShowForm(true);

  };

  const openDelete = (number) => {

    setSelectedNumber(number);

    setShowDelete(true);

  };

  const saveNumber = async (data) => {

    try {

      setSaving(true);

      if (selectedNumber) {

        await numberPoolService.updateNumber(
          selectedNumber.id,
          data,
        );

      } else {

        await numberPoolService.createNumber(
          data,
        );

      }

      setShowForm(false);

      setSelectedNumber(null);

      await loadNumbers();

      await loadStatistics();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to save number."
      );

    } finally {

      setSaving(false);

    }

  };

  const deleteNumber = async (id) => {

    try {

      setDeleting(true);

      await numberPoolService.deleteNumber(id);

      setShowDelete(false);

      setSelectedNumber(null);

      await loadNumbers();

      await loadStatistics();

    } catch (err) {

      console.error(err);

      alert("Unable to delete number.");

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
            Number Pool
          </h1>

          <p className="text-slate-500 mt-1">
            Manage DID Numbers.
          </p>

        </div>

        <div className="flex gap-3">

          <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl cursor-pointer">

            <Upload size={18} />

            Import

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              hidden
              onChange={handleImport}
            />

          </label>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >

            <Plus size={18} />

            Add Number

          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="bg-white dark:bg-slate-900 rounded-xl border shadow p-5">
          <p className="text-sm text-slate-500">Total</p>
          <h2 className="text-3xl font-bold mt-2">
            {stats.total}
          </h2>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-100 shadow p-5">
          <p className="text-sm text-green-700">Available</p>
          <h2 className="text-3xl font-bold mt-2 text-green-700">
            {stats.available}
          </h2>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 shadow p-5">
          <p className="text-sm text-blue-700">Assigned</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-700">
            {stats.assigned}
          </h2>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-100 shadow p-5">
          <p className="text-sm text-yellow-700">Reserved</p>
          <h2 className="text-3xl font-bold mt-2 text-yellow-700">
            {stats.reserved}
          </h2>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-100 shadow p-5">
          <p className="text-sm text-red-700">Disabled</p>
          <h2 className="text-3xl font-bold mt-2 text-red-700">
            {stats.disabled}
          </h2>
        </div>

      </div>
      {/* Search & Filters */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search DID, Extension..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          />

        </div>

        {/* Country */}

        <select
          value={country}
          onChange={(e) =>
            setCountry(e.target.value)
          }
          className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        >

          <option value="">
            All Countries
          </option>

          {countries.map((item) => (

            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>

          ))}

        </select>

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

          <option value="AVAILABLE">
            Available
          </option>

          <option value="ASSIGNED">
            Assigned
          </option>

          <option value="RESERVED">
            Reserved
          </option>

          <option value="DISABLED">
            Disabled
          </option>

        </select>

        {/* Provider */}

        <input
          type="text"
          placeholder="Provider"
          value={provider}
          onChange={(e) =>
            setProvider(e.target.value)
          }
          className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />

      </div>

      {/* Filter Actions */}

      <div className="flex justify-end">

        <button
          onClick={() => {

            setSearch("");
            setCountry("");
            setStatus("");
            setProvider("");

          }}
          className="px-5 py-3 rounded-xl bg-slate-600 hover:bg-slate-700 text-white"
        >
          Clear Filters
        </button>

      </div>

      {/* Number Table */}

      <NumberTable
        numbers={numbers}
        loading={loading}
        onEdit={openEdit}
        onDelete={openDelete}
        user={user}
      />

      {/* Add / Edit Number */}

      <NumberFormModal
        open={showForm}
        onClose={() => {

          setShowForm(false);

          setSelectedNumber(null);

        }}
        onSave={saveNumber}
        number={selectedNumber}
        user={user}
        saving={saving}
      />

      {/* Delete Number */}

      <NumberDeleteModal
        open={showDelete}
        onClose={() => {

          setShowDelete(false);

          setSelectedNumber(null);

        }}
        onConfirm={deleteNumber}
        number={selectedNumber}
        deleting={deleting}
      />

    </div>

  );

}