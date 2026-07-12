import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

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

    const loadClients = async () => {
        try {
            setLoading(true);

            const res = await clientService.getClients();

            setClients(res.data.data || []);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const filteredClients = clients.filter((client) =>
        `${client.name} ${client.email} ${client.phone}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const openCreate = () => {
        setSelectedClient(null);
        setShowForm(true);
    };

    const openEdit = (client) => {
        setSelectedClient(client);
        setShowForm(true);
    };

    const openDelete = (client) => {
        setSelectedClient(client);
        setShowDelete(true);
    };

    const saveClient = async (data) => {
        try {
            setSaving(true);

            if (selectedClient) {
                await clientService.updateClient(selectedClient.id, data);
            } else {
                await clientService.createClient(data);
            }

            setShowForm(false);
            setSelectedClient(null);

            await loadClients();

        } catch (err) {
            console.error("Create Client Error");

            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Response:", err.response.data);
            } else {
                console.log(err);
            }

            alert(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Unable to save client."
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteClient = async (id) => {
        try {
            setDeleting(true);

            await clientService.deleteClient(id);

            setShowDelete(false);
            setSelectedClient(null);

            await loadClients();

        } catch (err) {
            console.error(err);
            alert("Unable to delete client.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold">
                        Clients
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Manage clients.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                >
                    <Plus size={18} />
                    Add Client
                </button>

            </div>

            <div className="relative max-w-md">

                <Search
                    size={18}
                    className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                    type="text"
                    placeholder="Search client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />

            </div>

            <ClientTable
                clients={filteredClients}
                loading={loading}
                onEdit={openEdit}
                onDelete={openDelete}
                user={user}
            />

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