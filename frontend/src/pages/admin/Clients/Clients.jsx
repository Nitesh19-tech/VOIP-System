import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    RefreshCw,
    Users,
    UserCheck,
    UserX,
} from "lucide-react";

import clientService from "../../../services/clientService";

import ClientTable from "./ClientTable";
import ClientFormModal from "./ClientFormModal";
import ClientDeleteModal from "./ClientDeleteModal";

export default function Clients({ user }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [selectedClient, setSelectedClient] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // =========================================================
    // LOAD CLIENTS
    // =========================================================

    const loadClients = async () => {
        try {
            setLoading(true);

            const res = await clientService.getClients();

            setClients(res.data?.data || []);
        } catch (err) {
            console.error("Failed to load clients:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    // =========================================================
    // FILTER CLIENTS
    // =========================================================

    const filteredClients = useMemo(() => {
        const query = search.trim().toLowerCase();

        return clients.filter((client) => {
            const matchesSearch =
                !query ||
                `${client.name || ""} ${client.email || ""} ${client.phone || ""}`
                    .toLowerCase()
                    .includes(query);

            const isActive = client.is_active !== false;

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive) ||
                (statusFilter === "inactive" && !isActive);

            return matchesSearch && matchesStatus;
        });
    }, [clients, search, statusFilter]);

    // =========================================================
    // COUNTS
    // =========================================================

    const totalClients = clients.length;

    const activeClients = clients.filter(
        (client) => client.is_active !== false
    ).length;

    const inactiveClients = totalClients - activeClients;

    // =========================================================
    // CREATE
    // =========================================================

    const openCreate = () => {
        setSelectedClient(null);
        setShowForm(true);
    };

    // =========================================================
    // EDIT
    // =========================================================

    const openEdit = (client) => {
        setSelectedClient(client);
        setShowForm(true);
    };

    // =========================================================
    // DELETE
    // =========================================================

    const openDelete = (client) => {
        setSelectedClient(client);
        setShowDelete(true);
    };

    // =========================================================
    // SAVE CLIENT
    // =========================================================

    const saveClient = async (data) => {
        try {
            setSaving(true);

            if (selectedClient) {
                await clientService.updateClient(
                    selectedClient.id,
                    data
                );
            } else {
                await clientService.createClient(data);
            }

            setShowForm(false);
            setSelectedClient(null);

            await loadClients();

        } catch (err) {
            console.error(
                "Save Client Error:",
                err.response?.data || err
            );

            alert(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Unable to save client."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE CLIENT
    // =========================================================

    const deleteClient = async (id) => {
        try {
            setDeleting(true);

            await clientService.deleteClient(id);

            setShowDelete(false);
            setSelectedClient(null);

            await loadClients();

        } catch (err) {
            console.error(
                "Delete Client Error:",
                err.response?.data || err
            );

            alert(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Unable to delete client."
            );
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="space-y-6 pb-8">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Users size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Clients
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Manage your VoIP client accounts
                        </p>
                    </div>

                </div>

                <button
                    onClick={openCreate}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-lg
                        shadow-blue-900/20
                        transition
                        hover:from-blue-500
                        hover:to-cyan-400
                    "
                >
                    <Plus size={18} />
                    Add Client
                </button>

            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* TOTAL */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-slate-400">
                            Total Clients
                        </p>

                        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                            <Users size={18} />
                        </div>

                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                        {totalClients}
                    </p>

                </div>

                {/* ACTIVE */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-slate-400">
                            Active Clients
                        </p>

                        <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                            <UserCheck size={18} />
                        </div>

                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                        {activeClients}
                    </p>

                </div>

                {/* INACTIVE */}

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-slate-400">
                            Inactive Clients
                        </p>

                        <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
                            <UserX size={18} />
                        </div>

                    </div>

                    <p className="mt-3 text-2xl font-bold text-white">
                        {inactiveClients}
                    </p>

                </div>

            </div>

            {/* =================================================
                CLIENT TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl">

                {/* TOOLBAR */}

                <div className="flex flex-col gap-3 border-b border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* SEARCH */}

                    <div className="relative w-full lg:max-w-md">

                        <Search
                            size={18}
                            className="
                                pointer-events-none
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                                text-slate-500
                            "
                        />

                        <input
                            type="text"
                            placeholder="Search client..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-950/70
                                py-3
                                pl-10
                                pr-4
                                text-sm
                                text-white
                                outline-none
                                transition
                                placeholder:text-slate-500
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />

                    </div>

                    {/* FILTER + REFRESH */}

                    <div className="flex items-center gap-2">

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-950
                                px-4
                                py-3
                                text-sm
                                text-slate-300
                                outline-none
                                focus:border-blue-500
                            "
                        >
                            <option value="all">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                        <button
                            onClick={loadClients}
                            disabled={loading}
                            title="Refresh"
                            className="
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-950
                                p-3
                                text-slate-300
                                transition
                                hover:border-slate-600
                                hover:text-white
                                disabled:opacity-50
                            "
                        >
                            <RefreshCw
                                size={18}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>

                    </div>

                </div>

                {/* TABLE */}

                <ClientTable
                    clients={filteredClients}
                    loading={loading}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    user={user}
                />

            </div>

            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            <ClientFormModal
                open={showForm}
                onClose={() => {
                    setShowForm(false);
                    setSelectedClient(null);
                }}
                onSave={saveClient}
                client={selectedClient}
                user={user}
                saving={saving}
            />

            {/* =================================================
                DELETE MODAL
            ================================================= */}

            <ClientDeleteModal
                open={showDelete}
                onClose={() => {
                    setShowDelete(false);
                    setSelectedClient(null);
                }}
                onConfirm={deleteClient}
                client={selectedClient}
                deleting={deleting}
            />

        </div>
    );
}