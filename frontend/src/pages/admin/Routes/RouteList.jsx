import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../../../services/routeService";

import RouteTable from "./RouteTable";
import RouteFormModal from "./RouteFormModal";
import RouteDeleteModal from "./RouteDeleteModal";

export default function RouteList() {

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedRoute, setSelectedRoute] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ==========================================
  // Load Routes
  // ==========================================

  const loadRoutes = async () => {

    try {

      setLoading(true);

      const res = await getRoutes();

      setRoutes(
        Array.isArray(res.data.data)
          ? res.data.data
          : []
      );

    } catch (err) {

      console.error(err);

      alert("Unable to load routes.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadRoutes();

  }, []);

  // ==========================================
  // Search
  // ==========================================

  const filteredRoutes = useMemo(() => {

    const keyword = search.toLowerCase();

    return routes.filter((route) => {

      return (

        (route.prefix || "")
          .toLowerCase()
          .includes(keyword)

        ||

        (route.description || "")
          .toLowerCase()
          .includes(keyword)

      );

    });

  }, [routes, search]);

  // ==========================================
  // Save
  // ==========================================

  const saveRoute = async (data) => {

    try {

      setSaving(true);

      if (selectedRoute) {

        await updateRoute(
          selectedRoute.id,
          data
        );

      } else {

        await createRoute(data);

      }

      setShowForm(false);

      setSelectedRoute(null);

      await loadRoutes();

    } catch (err) {

      console.error(err);

      alert("Unable to save route.");

    } finally {

      setSaving(false);

    }

  };

  // ==========================================
  // Delete
  // ==========================================

  const removeRoute = async (id) => {

    try {

      setDeleting(true);

      await deleteRoute(id);

      setShowDelete(false);

      setSelectedRoute(null);

      await loadRoutes();

    } catch (err) {

      console.error(err);

      alert("Unable to delete route.");

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

            Routes

          </h1>

          <p className="text-slate-500 dark:text-slate-400">

            Route Management

          </p>

        </div>

        <button
          onClick={() => {

            setSelectedRoute(null);

            setShowForm(true);

          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >

          <Plus size={18} />

          Add Route

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
          placeholder="Search Route..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

      </div>

      {/* Table */}

      <RouteTable
        routes={filteredRoutes}
        loading={loading}
        onEdit={(route) => {

          setSelectedRoute(route);

          setShowForm(true);

        }}
        onDelete={(route) => {

          setSelectedRoute(route);

          setShowDelete(true);

        }}
      />

      {/* Form */}

      <RouteFormModal
        open={showForm}
        route={selectedRoute}
        saving={saving}
        onSave={saveRoute}
        onClose={() => {

          setShowForm(false);

          setSelectedRoute(null);

        }}
      />

      {/* Delete */}

      <RouteDeleteModal
        open={showDelete}
        route={selectedRoute}
        deleting={deleting}
        onConfirm={removeRoute}
        onClose={() => {

          setShowDelete(false);

          setSelectedRoute(null);

        }}
      />

    </div>

  );

}