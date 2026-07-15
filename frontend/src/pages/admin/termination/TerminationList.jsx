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
  // Load
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

    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Terminations

          </h1>

          <p className="text-slate-500">

            Carrier Termination Management

          </p>

        </div>

        <button
          onClick={() => {

            setSelectedTermination(null);

            setShowForm(true);

          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >

          <Plus size={18} />

          Add Termination

        </button>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search
          className="absolute left-3 top-3.5 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border py-3 pl-10 pr-4"
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

      {/* Form */}

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

      {/* Delete */}

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