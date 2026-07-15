import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import {
  getCarriers,
  createCarrier,
  updateCarrier,
  deleteCarrier,
} from "../../../services/carrierService";

import CarrierTable from "./CarrierTable";
import CarrierFormModal from "./CarrierFormModal";
import CarrierDeleteModal from "./CarrierDeleteModal";
import CarrierIPModal from "./CarrierIPModal";

export default function CarrierList() {

  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCarrier, setSelectedCarrier] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showIPs, setShowIPs] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // Load Carriers
  // ==========================================

  const loadCarriers = async () => {
    try {

      setLoading(true);

      const res = await getCarriers();

      setCarriers(Array.isArray(res.data.data) ? res.data.data : []);

    } catch (error) {

      console.error(error);

      alert("Unable to load carriers.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadCarriers();
  }, []);

  // ==========================================
  // Search
  // ==========================================

  const filteredCarriers = useMemo(() => {

    return carriers.filter((carrier) => {

      const keyword = search.toLowerCase();

      return (
        carrier.name.toLowerCase().includes(keyword) ||
        (carrier.description || "")
          .toLowerCase()
          .includes(keyword)
      );

    });

  }, [carriers, search]);

  // ==========================================
  // Save
  // ==========================================

  const saveCarrier = async (data) => {

    try {

      setSaving(true);

      if (selectedCarrier) {

        await updateCarrier(selectedCarrier.id, data);

      } else {

        await createCarrier(data);

      }

      setShowForm(false);
      setSelectedCarrier(null);

      await loadCarriers();

    } catch (error) {

      console.error(error);

      alert("Unable to save carrier.");

    } finally {

      setSaving(false);

    }
  };

  // ==========================================
  // Delete
  // ==========================================

  const removeCarrier = async (id) => {

    try {

      setDeleting(true);

      await deleteCarrier(id);

      setShowDelete(false);
      setSelectedCarrier(null);

      await loadCarriers();

    } catch (error) {

      console.error(error);

      alert("Unable to delete carrier.");

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
            Carriers
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Carrier Management
          </p>

        </div>

        <button
          onClick={() => {

            setSelectedCarrier(null);

            setShowForm(true);

          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >

          <Plus size={18} />

          Add Carrier

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
          placeholder="Search Carrier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

      </div>

      {/* Table */}

      <CarrierTable
        carriers={filteredCarriers}
        loading={loading}
        onEdit={(carrier) => {

          setSelectedCarrier(carrier);

          setShowForm(true);

        }}
        onDelete={(carrier) => {

          setSelectedCarrier(carrier);

          setShowDelete(true);

        }}
        onViewIPs={(carrier) => {

          setSelectedCarrier(carrier);

          setShowIPs(true);

        }}
      />

      {/* Form */}

      <CarrierFormModal
        open={showForm}
        carrier={selectedCarrier}
        saving={saving}
        onSave={saveCarrier}
        onClose={() => {

          setShowForm(false);

          setSelectedCarrier(null);

        }}
      />

      {/* Delete */}

      <CarrierDeleteModal
        open={showDelete}
        carrier={selectedCarrier}
        deleting={deleting}
        onConfirm={removeCarrier}
        onClose={() => {

          setShowDelete(false);

          setSelectedCarrier(null);

        }}
      />

      {/* IP */}

      <CarrierIPModal
        open={showIPs}
        carrier={selectedCarrier}
        onClose={() => {

          setShowIPs(false);

          setSelectedCarrier(null);

        }}
      />

    </div>

  );

}