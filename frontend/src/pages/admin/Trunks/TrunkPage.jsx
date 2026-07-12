import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import {
  getTrunks,
  createTrunk,
  updateTrunk,
  deleteTrunk,
} from "../../../services/trunkService";

import TrunkTable from "./TrunkTable";
import TrunkFormModal from "./TrunkFormModal";
import DeleteTrunkModal from "./DeleteTrunkModal";

export default function TrunkPage() {

  const [trunks, setTrunks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [selectedTrunk, setSelectedTrunk] =
    useState(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  useEffect(() => {

    loadTrunks();

  }, []);

  const loadTrunks = async () => {

    try {

      setLoading(true);

      const res = await getTrunks();

      setTrunks(
        res.data.data || res.data
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load trunks."
      );

    } finally {

      setLoading(false);

    }

  };

  const openCreate = () => {

    setSelectedTrunk(null);

    setFormOpen(true);

  };

  const openEdit = (trunk) => {

    setSelectedTrunk(trunk);

    setFormOpen(true);

  };

  const openDelete = (trunk) => {

    setSelectedTrunk(trunk);

    setDeleteOpen(true);

  };
    const handleSave = async (formData) => {

    try {

      setSaving(true);

      if (selectedTrunk) {

        await updateTrunk(
          selectedTrunk.id,
          formData,
        );

        toast.success(
          "Trunk updated successfully."
        );

      } else {

        await createTrunk(
          formData,
        );

        toast.success(
          "Trunk created successfully."
        );

      }

      setFormOpen(false);

      loadTrunks();

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to save trunk."
      );

    } finally {

      setSaving(false);

    }

  };

  const handleDelete = async () => {

    try {

      await deleteTrunk(
        selectedTrunk.id,
      );

      toast.success(
        "Trunk deleted successfully."
      );

      setDeleteOpen(false);

      loadTrunks();

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to delete trunk."
      );

    }

  };

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">

          Trunks

        </h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >

          <Plus size={18} />

          Add Trunk

        </button>

      </div>

      <TrunkTable
        trunks={trunks}
        loading={loading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <TrunkFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        trunk={selectedTrunk}
        saving={saving}
      />

      <DeleteTrunkModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        trunk={selectedTrunk}
      />

    </div>

  );

}