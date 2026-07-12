import { useEffect, useState } from "react";
import {
  Plus,
  Search,
} from "lucide-react";

import rateService from "../../../services/rateService";

import RateTable from "./RateTable";
import RateFormModal from "./RateFormModal";
import RateDeleteModal from "./RateDeleteModal";

export default function RateManagement({ user }) {

  const [rates, setRates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedRate, setSelectedRate] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [showDelete, setShowDelete] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const loadRates = async () => {

    try {

      setLoading(true);

      const res =
        await rateService.getRates({
          search,
        });

      setRates(
        res.data.data || []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadRates();

  }, []);
    const openCreate = () => {

    setSelectedRate(null);

    setShowForm(true);

  };

  const openEdit = (rate) => {

    setSelectedRate(rate);

    setShowForm(true);

  };

  const openDelete = (rate) => {

    setSelectedRate(rate);

    setShowDelete(true);

  };

  const saveRate = async (data) => {

    try {

      setSaving(true);

      if (selectedRate) {

        await rateService.updateRate(

          selectedRate.id,

          data,

        );

      } else {

        await rateService.createRate(
          data
        );

      }

      setShowForm(false);

      setSelectedRate(null);

      await loadRates();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Unable to save Rate."

      );

    } finally {

      setSaving(false);

    }

  };

  const deleteRate = async () => {

    try {

      setDeleting(true);

      await rateService.deleteRate(
        selectedRate.id
      );

      setShowDelete(false);

      setSelectedRate(null);

      await loadRates();

    } catch (err) {

      console.error(err);

    } finally {

      setDeleting(false);

    }

  };
    return (

    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">

            Rate Management

          </h1>

          <p className="text-slate-500">

            Manage Call Rates

          </p>

        </div>

        <button

          onClick={openCreate}

          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"

        >

          <Plus size={18} />

          Add Rate

        </button>

      </div>

      <div className="relative max-w-lg">

        <Search
          size={18}
          className="absolute left-3 top-3.5 text-slate-400"
        />

        <input

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          placeholder="Search..."

          className="w-full pl-10 pr-4 py-3 rounded-xl border"

        />

      </div>

      <RateTable

        rates={rates}

        loading={loading}

        user={user}

        onEdit={openEdit}

        onDelete={openDelete}

      />

      <RateFormModal

        open={showForm}

        onClose={()=>{
          setShowForm(false);
          setSelectedRate(null);
        }}

        onSave={saveRate}

        rate={selectedRate}

        saving={saving}

      />

      <RateDeleteModal

        open={showDelete}

        onClose={()=>{
          setShowDelete(false);
          setSelectedRate(null);
        }}

        onConfirm={deleteRate}

        deleting={deleting}

        rate={selectedRate}

      />

    </div>

  );

}