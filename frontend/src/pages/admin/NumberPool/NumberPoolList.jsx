import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Upload,
    BarChart3,
} from "lucide-react";

import numberPoolService from "../../../services/numberPoolService";

import NumberTable from "./NumberTable";
import NumberFormModal from "./NumberFormModal";
import NumberDeleteModal from "./NumberDeleteModal";
import BulkAllocationModal from "./BulkAllocationModal";

export default function NumberPoolList({ user }) {

    const [numbers, setNumbers] = useState([]);

    const [statistics, setStatistics] = useState({});

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const [selectedNumber, setSelectedNumber] =
        useState(null);
    const [showBulkAllocation, setShowBulkAllocation] =
        useState(false);
    // ==========================================
    // Load Numbers
    // ==========================================

    const loadNumbers = async () => {

        try {

            setLoading(true);

            const res =
                await numberPoolService.getNumbers();

            setNumbers(res.data.data || []);

        } catch (err) {

            console.error(err);

            alert("Unable to load numbers.");

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // Load Statistics
    // ==========================================

    const loadStatistics = async () => {

        try {

            const res =
                await numberPoolService.getStatistics();

            setStatistics(res.data.data || {});

        } catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {

        loadNumbers();

        loadStatistics();

    }, []);

    // ==========================================
    // Save
    // ==========================================

    const saveNumber = async (data) => {

        try {

            setSaving(true);

            if (selectedNumber) {

                await numberPoolService.updateNumber(
                    selectedNumber.id,
                    data
                );

            } else {

                await numberPoolService.createNumber(
                    data
                );

            }

            setShowForm(false);

            setSelectedNumber(null);

            await loadNumbers();

            await loadStatistics();

        } catch (err) {

            console.error(err);

            alert("Unable to save number.");

        } finally {

            setSaving(false);

        }

    };

    // ==========================================
    // Delete
    // ==========================================

    const removeNumber = async (id) => {

        try {

            setDeleting(true);

            await numberPoolService.deleteNumber(id);

            setShowDelete(false);

            setSelectedNumber(null);

            await loadNumbers();

            await loadStatistics();

        } catch (err) {

            console.error(err);

            alert("Unable to delete number.");

        } finally {

            setDeleting(false);

        }

    };

    // ==========================================
    // Search
    // ==========================================

    const filteredNumbers = useMemo(() => {

        const keyword =
            search.toLowerCase();

        return numbers.filter((item) =>

            (item.did_number || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (item.extension || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (item.country_name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (item.client_name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (item.carrier_name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (item.termination_name || "")
                .toLowerCase()
                .includes(keyword)

        );

    }, [numbers, search]);
    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Number Pool
                    </h1>

                    <p className="text-slate-500">
                        Manage DID Numbers
                    </p>

                </div>

                <div className="flex gap-3">

                    <label className="cursor-pointer rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700">

                        <Upload
                            size={18}
                            className="mr-2 inline"
                        />

                        Import

                        <input
                            type="file"
                            hidden
                            accept=".csv,.xlsx,.xls"
                            onChange={async (e) => {

                                const file =
                                    e.target.files?.[0];

                                if (!file) return;

                                try {

                                    await numberPoolService.importNumbers(
                                        file
                                    );

                                    await loadNumbers();

                                    await loadStatistics();

                                    alert(
                                        "Numbers Imported Successfully."
                                    );

                                } catch (err) {

                                    console.error(err);

                                    alert("Import Failed.");

                                }

                            }}
                        />

                    </label>

                    <button
                        onClick={() => {

                            setSelectedNumber(null);

                            setShowForm(true);

                        }}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                    >

                        <Plus size={18} />

                        Add Number

                    </button>
                    <button
                        onClick={() => setShowBulkAllocation(true)}
                        className="rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700"
                    >
                        Bulk Allocation
                    </button>

                </div>

            </div>

            {/* Statistics */}

            <div className="grid grid-cols-5 gap-4">

                <StatCard
                    title="Total"
                    value={statistics.total || 0}
                />

                <StatCard
                    title="Available"
                    value={statistics.available || 0}
                />

                <StatCard
                    title="Assigned"
                    value={statistics.assigned || 0}
                />

                <StatCard
                    title="Reserved"
                    value={statistics.reserved || 0}
                />

                <StatCard
                    title="Disabled"
                    value={statistics.disabled || 0}
                />

            </div>

            {/* Search */}

            <div className="relative max-w-md">

                <Search
                    size={18}
                    className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                    type="text"
                    placeholder="Search Number..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full rounded-xl border py-3 pl-10 pr-4"
                />

            </div>

            {/* Table */}

            <NumberTable
                numbers={filteredNumbers}
                loading={loading}
                user={user}
                onEdit={(number) => {

                    setSelectedNumber(number);

                    setShowForm(true);

                }}
                onDelete={(number) => {

                    setSelectedNumber(number);

                    setShowDelete(true);

                }}
            />

            {/* Form */}

            <NumberFormModal
                open={showForm}
                onClose={() => {

                    setShowForm(false);

                    setSelectedNumber(null);

                }}
                onSave={saveNumber}
                number={selectedNumber}
                saving={saving}
                user={user}
            />

            {/* Delete */}

            <NumberDeleteModal
                open={showDelete}
                number={selectedNumber}
                deleting={deleting}
                onConfirm={removeNumber}
                onClose={() => {

                    setShowDelete(false);

                    setSelectedNumber(null);

                }}
            />

            <BulkAllocationModal
                open={showBulkAllocation}
                onClose={() => setShowBulkAllocation(false)}
                onSuccess={async () => {
                    setShowBulkAllocation(false);
                    await loadNumbers();
                    await loadStatistics();
                }}
            />

        </div>
    );

}

function StatCard({
    title,
    value,
}) {

    return (

        <div className="rounded-xl border bg-white p-5 shadow">

            <div className="mb-2 flex items-center gap-2">

                <BarChart3
                    size={18}
                    className="text-blue-600"
                />

                <span className="text-sm text-slate-500">

                    {title}

                </span>

            </div>

            <div className="text-3xl font-bold">

                {value}

            </div>

        </div>

    );

}