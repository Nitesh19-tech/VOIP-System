import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Upload,
} from "lucide-react";

import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  importCountries,
} from "../../../services/countryService";

import CountryTable from "./CountryTable";
import CountryFormModal from "./CountryFormModal";
import CountryDeleteModal from "./CountryDeleteModal";

export default function Countries() {

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedCountry, setSelectedCountry] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const loadCountries = async () => {

    try {

      setLoading(true);

      const res = await getCountries();

      setCountries(res.data.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadCountries();

  }, []);

  const filteredCountries = countries.filter(
    (country) =>

      `${country.name}
       ${country.dial_code}
       ${country.iso_code}`
        .toLowerCase()
        .includes(search.toLowerCase())

  );

  const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      const res =
        await importCountries(file);

      const result = res.data.data;

      alert(
`Import Completed

Imported : ${result.imported}

Duplicate : ${result.duplicates}

Failed : ${result.failed}`
      );

      loadCountries();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Import failed."
      );

    }

    e.target.value = "";

  };

  const saveCountry = async (data) => {

    try {

      setSaving(true);

      if (selectedCountry) {

        await updateCountry(
          selectedCountry.id,
          data,
        );

      } else {

        await createCountry(data);

      }

      setShowForm(false);

      setSelectedCountry(null);

      loadCountries();

    } catch (err) {

      console.error(err);

      alert("Unable to save country.");

    } finally {

      setSaving(false);

    }

  };

  const removeCountry = async (id) => {

    try {

      setDeleting(true);

      await deleteCountry(id);

      setShowDelete(false);

      setSelectedCountry(null);

      loadCountries();

    } catch (err) {

      console.error(err);

      alert("Unable to delete.");

    } finally {

      setDeleting(false);

    }

  };

  return (

    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Countries
          </h1>

          <p className="text-slate-500">
            Country Master
          </p>

        </div>

        <div className="flex gap-3">

          <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl cursor-pointer">

            <Upload size={18} />

            Import

            <input
              hidden
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
            />

          </label>

          <button
            onClick={()=>{
              setSelectedCountry(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >

            <Plus size={18}/>

            Add Country

          </button>

        </div>

      </div>

      <div className="relative max-w-md">

        <Search
          className="absolute left-3 top-3.5 text-slate-400"
          size={18}
        />

        <input
          className="w-full pl-10 pr-4 py-3 rounded-xl border"
          placeholder="Search Country..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      <CountryTable
        countries={filteredCountries}
        loading={loading}
        onEdit={(country)=>{
          setSelectedCountry(country);
          setShowForm(true);
        }}
        onDelete={(country)=>{
          setSelectedCountry(country);
          setShowDelete(true);
        }}
      />

      <CountryFormModal
        open={showForm}
        onClose={()=>{
          setShowForm(false);
          setSelectedCountry(null);
        }}
        onSave={saveCountry}
        country={selectedCountry}
        saving={saving}
      />

      <CountryDeleteModal
        open={showDelete}
        country={selectedCountry}
        deleting={deleting}
        onClose={()=>{
          setShowDelete(false);
          setSelectedCountry(null);
        }}
        onConfirm={removeCountry}
      />

    </div>

  );

}