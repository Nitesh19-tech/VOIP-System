import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Upload,
  RefreshCw,
  Globe,
  Phone,
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

      const res = await numberPoolService.getStatistics();

      setStats(res.data.data);

    } catch (err) {

      console.error(err);

    }

  };

  const loadCountries = async () => {

    try {

      const res = await getCountries();

      setCountries(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadNumbers = async () => {

    try {

      setLoading(true);

      const res = await numberPoolService.getNumbers({

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

      const res = await numberPoolService.importNumbers(file);

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

    <div className="space-y-8">

      {/* ===========================================
                  Header
      ============================================ */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">

            Number Pool

          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">

            Manage, assign and monitor DID inventory.

          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <label
            className="
              flex
              items-center
              gap-2

              px-5
              py-3

              rounded-xl

              bg-emerald-600
              hover:bg-emerald-700

              text-white
              font-medium

              shadow-lg

              cursor-pointer

              transition
            "
          >

            <Upload size={18} />

            Import Numbers

            <input
              hidden
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
            />

          </label>

          <button
            onClick={openCreate}
            className="
              flex
              items-center
              gap-2

              px-5
              py-3

              rounded-xl

              bg-gradient-to-r
              from-blue-600
              to-cyan-500

              hover:shadow-xl

              text-white
              font-medium

              transition
            "
          >

            <Plus size={18} />

            Add Number

          </button>

          <button
            onClick={() => {

              loadNumbers();

              loadStatistics();

            }}
            className="
              flex
              items-center
              gap-2

              px-5
              py-3

              rounded-xl

              border
              border-slate-300
              dark:border-slate-700

              hover:bg-slate-100
              dark:hover:bg-slate-800

              transition
            "
          >

            <RefreshCw size={18} />

            Refresh

          </button>

        </div>

      </div>
      {/* ===========================================
                  Statistics
      ============================================ */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-5">

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">

                Total Numbers

              </p>

              <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">

                {stats.total}

              </h2>

            </div>

            <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">

              <Phone className="text-blue-600" size={24} />

            </div>

          </div>

        </div>

        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 shadow-sm hover:shadow-xl transition-all">

          <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">

            Available

          </p>

          <h2 className="mt-3 text-4xl font-bold text-emerald-600">

            {stats.available}

          </h2>

        </div>

        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-6 shadow-sm hover:shadow-xl transition-all">

          <p className="text-xs uppercase tracking-[0.18em] text-blue-600">

            Assigned

          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">

            {stats.assigned}

          </h2>

        </div>

        <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-6 shadow-sm hover:shadow-xl transition-all">

          <p className="text-xs uppercase tracking-[0.18em] text-yellow-600">

            Reserved

          </p>

          <h2 className="mt-3 text-4xl font-bold text-yellow-600">

            {stats.reserved}

          </h2>

        </div>

        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 shadow-sm hover:shadow-xl transition-all">

          <p className="text-xs uppercase tracking-[0.18em] text-red-600">

            Disabled

          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-600">

            {stats.disabled}

          </h2>

        </div>

      </div>

      {/* ===========================================
                  Filters
      ============================================ */}

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Search */}

          <div className="relative lg:col-span-3">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search DID, Extension..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                pl-11
                pr-4
                py-3

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                focus:ring-2
                focus:ring-blue-500

                outline-none
              "
            />

          </div>

          {/* Country */}

          <div className="relative lg:col-span-3">
            <Globe
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="
                w-full
                pl-11
                pr-4
                py-3

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                outline-none
              "
            >

              <option value="">All Countries</option>

              {countries.map((item) => (

                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>

              ))}

            </select>

          </div>
          {/* Status */}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              w-full
              px-4
              py-3

              rounded-xl

              border
              border-slate-300
              dark:border-slate-700

              bg-white
              dark:bg-slate-950

              outline-none

              focus:ring-2
              focus:ring-blue-500
            "
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
            onChange={(e) => setProvider(e.target.value)}
            className="
              w-full
              px-4
              py-3

              rounded-xl

              border
              border-slate-300
              dark:border-slate-700

              bg-white
              dark:bg-slate-950

              outline-none

              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        {/* Bottom Actions */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">

          <div className="text-sm text-slate-500">

            Showing

            <span className="font-semibold text-slate-900 dark:text-white mx-1">

              {numbers.length}

            </span>

            Numbers

          </div>

          <button
            onClick={() => {

              setSearch("");
              setCountry("");
              setStatus("");
              setProvider("");

            }}
            className="
              px-5
              py-3

              rounded-xl

              bg-slate-700
              hover:bg-slate-800

              text-white

              transition
            "
          >

            Clear Filters

          </button>

        </div>

      </div>

      {/* ===========================================
                  Table
      ============================================ */}

      <div
        className="
          rounded-2xl

          border
          border-slate-200
          dark:border-slate-800

          bg-white
          dark:bg-slate-900

          shadow-sm

          overflow-hidden
        "
      >

        <div
          className="
            flex
            items-center
            justify-between

            px-6
            py-5

            border-b
            border-slate-200
            dark:border-slate-800
          "
        >

          <div>

            <h3 className="text-lg font-bold">

              DID Inventory

            </h3>

            <p className="text-sm text-slate-500 mt-1">

              Manage assigned and available phone numbers.

            </p>

          </div>

        </div>

        <NumberTable
          numbers={numbers}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
          user={user}
        />

      </div>
      {/* ===========================================
                  Add / Edit Modal
      ============================================ */}

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

      {/* ===========================================
                  Delete Modal
      ============================================ */}

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