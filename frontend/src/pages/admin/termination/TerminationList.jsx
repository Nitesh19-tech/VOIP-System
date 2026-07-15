import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import {
  getTerminations,
  createTermination,
  updateTermination,
  deleteTermination,
} from "../../../services/terminationService";

import TerminationTable from "./TerminationTable";
import TerminationFormModal from "./TerminationFormModal";
import TerminationDeleteModal from "./TerminationDeleteModal";

export default function TerminationList() {
  const [terminations, setTerminations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedTermination, setSelectedTermination] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // Load Terminations
  // ==========================================

  const loadTerminations = async () => {
    try {
      setLoading(true);

      const res = await getTerminations();

      setTerminations(
        Array.isArray(res.data.data)
          ? res.data.data
          : []
      );
    } catch (err) {
      console.error(err);
      alert("Unable to load terminations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerminations();
  }, []);

  // ==========================================
  // Search
  // ==========================================

  const filteredTerminations = useMemo(() => {
    const keyword = search.toLowerCase();

    return terminations.filter((item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.prefix.toLowerCase().includes(keyword) ||
      (item.carrier_name || "")
        .toLowerCase()
        .includes(keyword)
    );
  }, [terminations, search]);

  // ==========================================
  // Save
  // ==========================================

  const saveTermination = async (data) => {
    try {
      setSaving(true);

      if (selectedTermination) {
        await updateTermination(
          selectedTermination.id,
          data
        );
      } else {
        await createTermination(data);
      }

      setShowForm(false);
      setSelectedTermination(null);

      await loadTerminations();
    } catch (err) {
      console.error(err);
      alert("Unable to save termination.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Delete
  // ==========================================

  const removeTermination = async (id) => {
    try {
      setDeleting(true);

      await deleteTermination(id);

      setShowDelete(false);
      setSelectedTermination(null);

      await loadTerminations();
    } catch (err) {
      console.error(err);
      alert("Unable to delete termination.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Terminations
          </h1>

          <p className="mt-2 text-slate-400">
            Carrier Termination Management
          </p>

        </div>

        <button
          onClick={() => {
            setSelectedTermination(null);
            setShowForm(true);
          }}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-6
            py-3
            font-medium
            text-white
            shadow-lg
            shadow-blue-500/20
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-blue-500/40
          "
        >
          <Plus size={18} />

          Add Termination
        </button>

      </div>

      {/* Search */}

      <div className="relative max-w-lg">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search carrier, name or prefix..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            py-3
            pl-11
            pr-4
            text-white
            placeholder:text-slate-500
            focus:border-blue-500
            focus:outline-none
            focus:ring-4
            focus:ring-blue-500/20
          "
        />

      </div>

      {/* Table */}

      <TerminationTable
        terminations={filteredTerminations}
        loading={loading}
        onEdit={(item) => {
          setSelectedTermination(item);
          setShowForm(true);
        }}
        onDelete={(item) => {
          setSelectedTermination(item);
          setShowDelete(true);
        }}
      />

      {/* Form Modal */}

      <TerminationFormModal
        open={showForm}
        termination={selectedTermination}
        saving={saving}
        onSave={saveTermination}
        onClose={() => {
          setShowForm(false);
          setSelectedTermination(null);
        }}
      />

      {/* Delete Modal */}

      <TerminationDeleteModal
        open={showDelete}
        termination={selectedTermination}
        deleting={deleting}
        onConfirm={removeTermination}
        onClose={() => {
          setShowDelete(false);
          setSelectedTermination(null);
        }}
      />

    </div>
  );
}