import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Upload,
} from "lucide-react";

import {
  getIncomingRoutes,
  createIncomingRoute,
  updateIncomingRoute,
  deleteIncomingRoute,
  applyIncomingChanges,
} from "../../../services/incomingRouteService";

import IncomingRouteTable from "./IncomingRouteTable";
import IncomingRouteFormModal from "./IncomingRouteFormModal";
import IncomingRouteDeleteModal from "./IncomingRouteDeleteModal";

export default function IncomingRoutes() {
  const [routes, setRoutes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedRoute, setSelectedRoute] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [applying, setApplying] = useState(false);

  // =====================================================
  // Load Routes
  // =====================================================

  const loadRoutes = async () => {
    try {
      setLoading(true);

      const res = await getIncomingRoutes();

      setRoutes(
        Array.isArray(res?.data?.data)
          ? res.data.data
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load incoming routes:",
        error
      );

      alert(
        "Unable to load incoming routes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  // =====================================================
  // Search
  // =====================================================

  const filteredRoutes = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return routes;
    }

    return routes.filter((route) => {
      return (
        String(route.did || "")
          .toLowerCase()
          .includes(keyword) ||

        String(route.forward_number || "")
          .toLowerCase()
          .includes(keyword) ||

        String(route.termination_name || "")
          .toLowerCase()
          .includes(keyword) ||

        String(route.description || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [routes, search]);

  // =====================================================
  // Add / Edit
  // =====================================================

  const openCreateForm = () => {
    setSelectedRoute(null);
    setShowForm(true);
  };

  const openEditForm = (route) => {
    setSelectedRoute(route);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setSelectedRoute(null);
  };

  // =====================================================
  // Save
  // =====================================================

  const saveRoute = async (data) => {
    try {
      setSaving(true);

      if (selectedRoute) {
        await updateIncomingRoute(
          selectedRoute.id,
          data
        );
      } else {
        await createIncomingRoute(data);
      }

      setShowForm(false);
      setSelectedRoute(null);

      await loadRoutes();
    } catch (error) {
      console.error(
        "Unable to save incoming route:",
        error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Unable to save incoming route.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // Delete
  // =====================================================

  const openDeleteModal = (route) => {
    setSelectedRoute(route);
    setShowDelete(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDelete(false);
    setSelectedRoute(null);
  };

  const removeRoute = async (id) => {
    try {
      setDeleting(true);

      await deleteIncomingRoute(id);

      setShowDelete(false);
      setSelectedRoute(null);

      await loadRoutes();
    } catch (error) {
      console.error(
        "Unable to delete incoming route:",
        error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Unable to delete incoming route.";

      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // Apply Changes
  // =====================================================

  const handleApplyChanges = async () => {
    try {
      setApplying(true);

      const res =
        await applyIncomingChanges();

      if (res?.data?.success) {
        alert(
          "Incoming changes applied successfully."
        );

        await loadRoutes();
      } else {
        alert(
          res?.data?.error ||
            "Unable to apply incoming changes."
        );
      }
    } catch (error) {
      console.error(
        "Unable to apply incoming changes:",
        error
      );

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Unable to apply incoming changes.";

      alert(message);
    } finally {
      setApplying(false);
    }
  };

  // =====================================================
  // Refresh
  // =====================================================

  const handleRefresh = () => {
    loadRoutes();
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =====================================================
          Header
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
              text-white
            "
          >
            Incoming Routes
          </h1>

          <p
            className="
              mt-2
              text-slate-400
            "
          >
            Manage incoming DID calls and
            forwarding destinations.
          </p>

        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-4
              py-3
              font-medium
              text-slate-200
              transition
              hover:bg-slate-800
              disabled:opacity-50
            "
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

          {/* Apply */}

          <button
            type="button"
            onClick={handleApplyChanges}
            disabled={applying}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              font-medium
              text-white
              shadow-lg
              shadow-emerald-500/20
              transition
              hover:bg-emerald-700
              disabled:opacity-50
            "
          >

            <Upload size={17} />

            {applying
              ? "Applying..."
              : "Apply Changes"}

          </button>

          {/* Add */}

          <button
            type="button"
            onClick={openCreateForm}
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

            Add Incoming Route

          </button>

        </div>

      </div>

      {/* =====================================================
          Info
      ===================================================== */}

      <div
        className="
          rounded-xl
          border
          border-blue-500/20
          bg-blue-500/10
          px-5
          py-4
        "
      >

        <div
          className="
            flex
            flex-col
            gap-2
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <p
              className="
                font-semibold
                text-blue-300
              "
            >
              Incoming Call Routing
            </p>

            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              Carrier calls are matched by DID
              and forwarded through the selected
              termination.
            </p>

          </div>

          <div
            className="
              rounded-lg
              bg-slate-900/60
              px-4
              py-2
              text-sm
              text-slate-300
            "
          >
            Total Routes:{" "}
            <span className="font-semibold text-white">
              {routes.length}
            </span>
          </div>

        </div>

      </div>

      {/* =====================================================
          Search
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div className="relative max-w-lg w-full">

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
            placeholder="
              Search DID, forward number,
              termination...
            "
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
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

        <div
          className="
            text-sm
            text-slate-500
          "
        >
          Showing{" "}
          <span className="text-slate-300">
            {filteredRoutes.length}
          </span>{" "}
          of{" "}
          <span className="text-slate-300">
            {routes.length}
          </span>{" "}
          routes
        </div>

      </div>

      {/* =====================================================
          Table
      ===================================================== */}

      <IncomingRouteTable
        routes={filteredRoutes}
        loading={loading}
        onEdit={openEditForm}
        onDelete={openDeleteModal}
      />

      {/* =====================================================
          Form Modal
      ===================================================== */}

      <IncomingRouteFormModal
        open={showForm}
        route={selectedRoute}
        saving={saving}
        onSave={saveRoute}
        onClose={closeForm}
      />

      {/* =====================================================
          Delete Modal
      ===================================================== */}

      <IncomingRouteDeleteModal
        open={showDelete}
        route={selectedRoute}
        deleting={deleting}
        onConfirm={removeRoute}
        onClose={closeDeleteModal}
      />

    </div>
  );
}