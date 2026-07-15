import { useEffect, useState } from "react";
import {
  Plus,
  Search,
} from "lucide-react";

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

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showIPs, setShowIPs] = useState(false);

  const [selectedCarrier, setSelectedCarrier] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const loadCarriers = async () => {

    try {

      setLoading(true);

      const res = await getCarriers();

      setCarriers(res.data.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadCarriers();

  }, []);

  const filteredCarriers = carriers.filter(
    (carrier) =>
      `${carrier.name}
       ${carrier.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const saveCarrier = async (data) => {

    try {

      setSaving(true);

      if (selectedCarrier) {

        await updateCarrier(
          selectedCarrier.id,
          data,
        );

      } else {

        await createCarrier(data);

      }

      setShowForm(false);

      setSelectedCarrier(null);

      loadCarriers();

    } catch (err) {

      console.error(err);

      alert("Unable to save carrier.");

    } finally {

      setSaving(false);

    }

  };

  const removeCarrier = async (id) => {

    try {

      setDeleting(true);

      await deleteCarrier(id);

      setShowDelete(false);

      setSelectedCarrier(null);

      loadCarriers();

    } catch (err) {

      console.error(err);

      alert("Unable to delete carrier.");

    } finally {

      setDeleting(false);

    }

  };

  return (

    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Carriers
          </h1>

          <p className="text-slate-500">
            Carrier Management
          </p>

        </div>

        <button
          onClick={() => {

            setSelectedCarrier(null);

            setShowForm(true);

          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >

          <Plus size={18} />

          Add Carrier

        </button>

      </div>

      <div className="relative max-w-md">

        <Search
          className="absolute left-3 top-3.5 text-slate-400"
          size={18}
        />

        <input
          className="w-full pl-10 pr-4 py-3 rounded-xl border"
          placeholder="Search Carrier..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

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

      <CarrierFormModal
        open={showForm}
        carrier={selectedCarrier}
        saving={saving}
        onClose={() => {

          setShowForm(false);

          setSelectedCarrier(null);

        }}
        onSave={saveCarrier}
      />

      <CarrierDeleteModal
        open={showDelete}
        carrier={selectedCarrier}
        deleting={deleting}
        onClose={() => {

          setShowDelete(false);

          setSelectedCarrier(null);

        }}
        onConfirm={removeCarrier}
      />

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