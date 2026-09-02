import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Upload,
  X,
  FileText,
  Loader2,
} from "lucide-react";

import {
  getTerminations,
  createTermination,
  updateTermination,
  deleteTermination,
  importTerminations,
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
  // Import State
  // ==========================================

  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const fileInputRef = useRef(null);

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
      (item.name || "")
        .toLowerCase()
        .includes(keyword) ||
      (item.prefix || "")
        .toLowerCase()
        .includes(keyword) ||
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

  // ==========================================
  // Open Import Modal
  // ==========================================

  const openImportModal = () => {
    setImportFile(null);
    setImportResult(null);
    setShowImport(true);
  };

  // ==========================================
  // Close Import Modal
  // ==========================================

  const closeImportModal = () => {
    if (importing) return;

    setShowImport(false);
    setImportFile(null);
    setImportResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // Select CSV
  // ==========================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImportFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please select a CSV file.");
      event.target.value = "";
      setImportFile(null);
      return;
    }

    setImportFile(file);
    setImportResult(null);
  };

  // ==========================================
  // Import CSV
  // ==========================================

  const handleImport = async () => {
    if (!importFile) {
      alert("Please select a CSV file first.");
      return;
    }

    try {
      setImporting(true);
      setImportResult(null);

      const res = await importTerminations(importFile);

      const result =
        res?.data?.data || {};

      setImportResult(result);

      await loadTerminations();

      if ((result.failed || 0) === 0) {
        alert(
          `Import completed successfully.\n\nCreated: ${
            result.created || 0
          }\nUpdated: ${
            result.updated || 0
          }\nFailed: ${
            result.failed || 0
          }`
        );
      }
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Unable to import termination CSV.";

      alert(message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Terminations
          </h1>

          <p className="mt-2 text-slate-400">
            Carrier Termination Management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* Import CSV */}

          <button
            onClick={openImportModal}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-5
              py-3
              font-medium
              text-slate-200
              transition-all
              duration-300
              hover:border-blue-500
              hover:bg-slate-800
              hover:text-white
            "
          >
            <Upload size={18} />

            Import CSV
          </button>

          {/* Add Termination */}

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

      </div>

      {/* ==========================================
          Search
      ========================================== */}

      <div className="relative max-w-lg">

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
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

      {/* ==========================================
          Table
      ========================================== */}

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

      {/* ==========================================
          Form Modal
      ========================================== */}

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

      {/* ==========================================
          Delete Modal
      ========================================== */}

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

      {/* ==========================================
          Import CSV Modal
      ========================================== */}

      {showImport && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            px-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-xl
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              p-6
              shadow-2xl
            "
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Import Terminations
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Upload termination CSV for carrier saurabh1
                </p>
              </div>

              <button
                onClick={closeImportModal}
                disabled={importing}
                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  transition
                  hover:bg-slate-800
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* File Upload */}

            <div className="mt-6">

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={importing}
                className="
                  flex
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  border-slate-700
                  bg-slate-950
                  px-6
                  py-10
                  text-center
                  transition
                  hover:border-blue-500
                  hover:bg-slate-900
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <Upload
                  size={32}
                  className="text-blue-400"
                />

                <span className="mt-3 font-medium text-white">
                  Select CSV File
                </span>

                <span className="mt-1 text-sm text-slate-500">
                  Only .csv files are supported
                </span>

              </button>

            </div>

            {/* Selected File */}

            {importFile && (
              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  p-4
                "
              >

                <FileText
                  size={24}
                  className="shrink-0 text-blue-400"
                />

                <div className="min-w-0 flex-1">

                  <p className="truncate font-medium text-white">
                    {importFile.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(
                      importFile.size /
                      1024
                    ).toFixed(1)} KB
                  </p>

                </div>

                {!importing && (
                  <button
                    type="button"
                    onClick={() => {
                      setImportFile(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="
                      rounded-lg
                      p-2
                      text-slate-400
                      hover:bg-slate-800
                      hover:text-white
                    "
                  >
                    <X size={18} />
                  </button>
                )}

              </div>
            )}

            {/* Import Result */}

            {importResult && (
              <div className="mt-5">

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-semibold text-white">
                      {importResult.total || 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">
                      Created
                    </p>

                    <p className="mt-1 text-xl font-semibold text-emerald-400">
                      {importResult.created || 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">
                      Updated
                    </p>

                    <p className="mt-1 text-xl font-semibold text-blue-400">
                      {importResult.updated || 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">
                      Failed
                    </p>

                    <p className="mt-1 text-xl font-semibold text-red-400">
                      {importResult.failed || 0}
                    </p>
                  </div>

                </div>

                {/* Errors */}

                {Array.isArray(importResult.errors) &&
                  importResult.errors.length > 0 && (
                    <div className="mt-4">

                      <p className="mb-2 text-sm font-medium text-red-400">
                        Import Errors
                      </p>

                      <div
                        className="
                          max-h-40
                          overflow-y-auto
                          rounded-xl
                          border
                          border-red-500/20
                          bg-red-500/5
                          p-3
                        "
                      >

                        {importResult.errors.map(
                          (error, index) => (
                            <div
                              key={index}
                              className="
                                border-b
                                border-red-500/10
                                py-2
                                text-sm
                                text-slate-300
                                last:border-0
                              "
                            >
                              {typeof error === "string"
                                ? error
                                : `Row ${
                                    error.row || index + 1
                                  }: ${
                                    error.error ||
                                    error.message ||
                                    JSON.stringify(error)
                                  }`}
                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

              </div>
            )}

            {/* Modal Buttons */}

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={closeImportModal}
                disabled={importing}
                className="
                  rounded-xl
                  border
                  border-slate-700
                  px-5
                  py-3
                  font-medium
                  text-slate-300
                  transition
                  hover:bg-slate-800
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {importResult ? "Close" : "Cancel"}
              </button>

              <button
                type="button"
                onClick={handleImport}
                disabled={!importFile || importing}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  px-5
                  py-3
                  font-medium
                  text-white
                  shadow-lg
                  shadow-blue-500/20
                  transition
                  hover:from-blue-500
                  hover:to-indigo-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {importing ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={18} />

                    Import CSV
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}