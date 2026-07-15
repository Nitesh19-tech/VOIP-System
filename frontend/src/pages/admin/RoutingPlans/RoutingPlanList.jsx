import { useEffect, useState } from "react";
import {
  Plus,
  Search,
} from "lucide-react";

import {
  getRoutingPlans,
  createRoutingPlan,
  updateRoutingPlan,
  deleteRoutingPlan,
} from "../../../services/routingPlanService";

import RoutingPlanTable from "./RoutingPlanTable";
import RoutingPlanFormModal from "./RoutingPlanFormModal";
import RoutingPlanDeleteModal from "./RoutingPlanDeleteModal";

export default function RoutingPlanList() {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  // =====================================
  // Load Routing Plans
  // =====================================

  const loadPlans = async () => {

    try {

      setLoading(true);

      const res = await getRoutingPlans();

      setPlans(
        Array.isArray(res.data.data)
          ? res.data.data
          : []
      );

    } catch (err) {

      console.error(err);

      alert("Unable to load Routing Plans.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadPlans();

  }, []);

  // =====================================
  // Search
  // =====================================

  const filteredPlans = plans.filter(
    (plan) =>
      `${plan.name}
       ${plan.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // =====================================
  // Save
  // =====================================

  const savePlan = async (data) => {

    try {

      setSaving(true);

      if (selectedPlan) {

        await updateRoutingPlan(
          selectedPlan.id,
          data
        );

      } else {

        await createRoutingPlan(data);

      }

      setShowForm(false);

      setSelectedPlan(null);

      loadPlans();

    } catch (err) {

      console.error(err);

      alert("Unable to save Routing Plan.");

    } finally {

      setSaving(false);

    }

  };

  // =====================================
  // Delete
  // =====================================

  const removePlan = async (id) => {

    try {

      setDeleting(true);

      await deleteRoutingPlan(id);

      setShowDelete(false);

      setSelectedPlan(null);

      loadPlans();

    } catch (err) {

      console.error(err);

      alert("Unable to delete Routing Plan.");

    } finally {

      setDeleting(false);

    }

  };
    return (

    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Routing Plans

          </h1>

          <p className="text-slate-500 dark:text-slate-400">

            Routing Plan Management

          </p>

        </div>

        <button

          onClick={() => {

            setSelectedPlan(null);

            setShowForm(true);

          }}

          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"

        >

          <Plus size={18} />

          Add Routing Plan

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

          value={search}

          onChange={(e) =>

            setSearch(e.target.value)

          }

          placeholder="Search Routing Plan..."

          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 dark:border-slate-700 dark:bg-slate-800"

        />

      </div>

      {/* Table */}

      <RoutingPlanTable

        plans={filteredPlans}

        loading={loading}

        onEdit={(plan) => {

          setSelectedPlan(plan);

          setShowForm(true);

        }}

        onDelete={(plan) => {

          setSelectedPlan(plan);

          setShowDelete(true);

        }}

      />

      {/* Form Modal */}

      <RoutingPlanFormModal

        open={showForm}

        plan={selectedPlan}

        saving={saving}

        onClose={() => {

          setShowForm(false);

          setSelectedPlan(null);

        }}

        onSave={savePlan}

      />

      {/* Delete Modal */}

      <RoutingPlanDeleteModal

        open={showDelete}

        plan={selectedPlan}

        deleting={deleting}

        onClose={() => {

          setShowDelete(false);

          setSelectedPlan(null);

        }}

        onConfirm={removePlan}

      />

    </div>

  );

}