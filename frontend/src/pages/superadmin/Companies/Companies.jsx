import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import companyService from "../../../services/companyService";

import CompanyTable from "./CompanyTable";
import CompanyFormModal from "./CompanyFormModal";
import CompanyDeleteModal from "./CompanyDeleteModal";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const loadCompanies = async () => {
    try {
      setLoading(true);

      const res = await companyService.getCompanies();

      setCompanies(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    `${company.name} ${company.code} ${company.email} ${company.phone} ${company.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ------------------------
  // CREATE
  // ------------------------
  const openCreate = () => {
    setSelectedCompany(null);
    setShowForm(true);
  };

  // ------------------------
  // EDIT
  // ------------------------
  const openEdit = (company) => {
    setSelectedCompany(company);
    setShowForm(true);
  };

  // ------------------------
  // DELETE
  // ------------------------
  const openDelete = (company) => {
    setSelectedCompany(company);
    setShowDelete(true);
  };

  // ------------------------
  // SAVE
  // ------------------------
  const saveCompany = async (data) => {
    try {
      setSaving(true);

      if (selectedCompany) {
        await companyService.updateCompany(
          selectedCompany.id,
          data
        );
      } else {
        await companyService.createCompany(data);
      }

      setShowForm(false);
      setSelectedCompany(null);

      await loadCompanies();

    } catch (err) {
      console.error(err);
      alert("Unable to save company.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------
  // DELETE
  // ------------------------
  const deleteCompany = async (id) => {
    try {
      setDeleting(true);

      await companyService.deleteCompany(id);

      setShowDelete(false);
      setSelectedCompany(null);

      await loadCompanies();

    } catch (err) {
      console.error(err);
      alert("Unable to delete company.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Companies
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all registered companies.
          </p>

        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
        >
          <Plus size={18} />
          Add Company
        </button>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search
          size={18}
          className="absolute left-3 top-3.5 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
        />

      </div>

      {/* Table */}

      <CompanyTable
        companies={filteredCompanies}
        loading={loading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* Add/Edit Modal */}

      <CompanyFormModal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedCompany(null);
        }}
        onSave={saveCompany}
        company={selectedCompany}
        saving={saving}
      />

      {/* Delete Modal */}

      <CompanyDeleteModal
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedCompany(null);
        }}
        onConfirm={deleteCompany}
        company={selectedCompany}
        deleting={deleting}
      />

    </div>
  );
}