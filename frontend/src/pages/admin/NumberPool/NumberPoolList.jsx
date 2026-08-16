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

    // =====================================================
    // STATE
    // =====================================================

    const [numbers, setNumbers] = useState([]);

    const [statistics, setStatistics] = useState({});

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const [selectedNumber, setSelectedNumber] = useState(null);

    const [showBulkAllocation, setShowBulkAllocation] =
        useState(false);


    // =====================================================
    // LOAD NUMBERS
    // =====================================================

    const loadNumbers = async () => {

        try {

            setLoading(true);

            const res =
                await numberPoolService.getNumbers();

            setNumbers(
                res?.data?.data || []
            );

        } catch (err) {

            console.error(
                "Load Numbers Error:",
                err
            );

            alert(
                "Unable to load numbers."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD STATISTICS
    // =====================================================

    const loadStatistics = async () => {

        try {

            const res =
                await numberPoolService.getStatistics();

            setStatistics(
                res?.data?.data || {}
            );

        } catch (err) {

            console.error(
                "Load Statistics Error:",
                err
            );

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadNumbers();

        loadStatistics();

    }, []);


    // =====================================================
    // SAVE NUMBER
    // =====================================================

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

            console.error(
                "Save Number Error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                "Unable to save number.";

            alert(message);

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // DELETE NUMBER
    // =====================================================

    const removeNumber = async (id) => {

        try {

            setDeleting(true);

            await numberPoolService.deleteNumber(
                id
            );

            setShowDelete(false);

            setSelectedNumber(null);

            await loadNumbers();

            await loadStatistics();

        } catch (err) {

            console.error(
                "Delete Number Error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                "Unable to delete number.";

            alert(message);

        } finally {

            setDeleting(false);

        }

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredNumbers = useMemo(() => {

        const keyword =
            search
                .trim()
                .toLowerCase();

        // No search
        if (!keyword) {

            return numbers;

        }

        return numbers.filter((item) => {

            return (

                // DID NUMBER
                (item.did_number || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // COUNTRY
                (item.country_name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // CLIENT
                (item.client_name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // CARRIER
                (item.carrier_name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // TERMINATION
                (item.termination_name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // RANGE
                (item.range_name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // PREFIX
                (item.prefix || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // CURRENCY
                (item.currency || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                // STATUS
                (item.status || "")
                    .toLowerCase()
                    .includes(keyword)

            );

        });

    }, [numbers, search]);


    // =====================================================
    // IMPORT NUMBERS
    // =====================================================

    const handleImport = async (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        try {

            setLoading(true);

            await numberPoolService.importNumbers(
                file
            );

            await loadNumbers();

            await loadStatistics();

            alert(
                "Numbers Imported Successfully."
            );

        } catch (err) {

            console.error(
                "Import Error:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                "Import Failed.";

            alert(message);

        } finally {

            setLoading(false);

            // Allow same file to be selected again
            e.target.value = "";

        }

    };


    // =====================================================
    // OPEN ADD FORM
    // =====================================================

    const handleAddNumber = () => {

        setSelectedNumber(null);

        setShowForm(true);

    };


    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const handleEditNumber = (number) => {

        setSelectedNumber(number);

        setShowForm(true);

    };


    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleDeleteNumber = (number) => {

        setSelectedNumber(number);

        setShowDelete(true);

    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);

        setSelectedNumber(null);

    };


    // =====================================================
    // CLOSE DELETE
    // =====================================================

    const closeDelete = () => {

        if (deleting) {
            return;
        }

        setShowDelete(false);

        setSelectedNumber(null);

    };


    // =====================================================
    // BULK ALLOCATION SUCCESS
    // =====================================================

    const handleBulkAllocationSuccess = async () => {

        setShowBulkAllocation(false);

        await loadNumbers();

        await loadStatistics();

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                gap-4
                flex-wrap
            ">

                <div>

                    <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                        dark:text-white
                    ">
                        Number Pool
                    </h1>

                    <p className="
                        mt-1
                        text-slate-500
                        dark:text-slate-400
                    ">
                        Manage DID Numbers
                    </p>

                </div>


                <div className="
                    flex
                    gap-3
                    flex-wrap
                ">


                    {/* =========================================
                        IMPORT
                    ========================================= */}

                    <label className="
                        cursor-pointer
                        rounded-xl
                        bg-green-600
                        px-5
                        py-3
                        text-white
                        transition
                        hover:bg-green-700
                        flex
                        items-center
                        gap-2
                    ">

                        <Upload size={18} />

                        Import

                        <input
                            type="file"
                            hidden
                            accept=".csv,.xlsx,.xls"
                            onChange={handleImport}
                        />

                    </label>


                    {/* =========================================
                        ADD NUMBER
                    ========================================= */}

                    <button
                        type="button"
                        onClick={handleAddNumber}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-5
                            py-3
                            text-white
                            transition
                            hover:bg-blue-700
                        "
                    >

                        <Plus size={18} />

                        Add Number

                    </button>


                    {/* =========================================
                        BULK ALLOCATION
                    ========================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowBulkAllocation(true)
                        }
                        className="
                            rounded-xl
                            bg-emerald-600
                            px-5
                            py-3
                            text-white
                            transition
                            hover:bg-emerald-700
                        "
                    >

                        Bulk Allocation

                    </button>

                </div>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="
                grid
                grid-cols-2
                gap-4
                md:grid-cols-3
                lg:grid-cols-5
            ">

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


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="
                relative
                w-full
                max-w-md
            ">

                <Search
                    size={18}
                    className="
                        absolute
                        left-3
                        top-3.5
                        text-slate-400
                    "
                />

                <input
                    type="text"
                    placeholder="Search Number, Country, Client..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-3
                        pl-10
                        pr-4
                        text-slate-900
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/20
                        dark:border-slate-700
                        dark:bg-slate-900
                        dark:text-white
                    "
                />

            </div>


            {/* =================================================
                RESULT COUNT
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                text-sm
                text-slate-500
            ">

                <span>

                    Showing{" "}
                    <strong className="
                        text-slate-700
                        dark:text-slate-300
                    ">
                        {filteredNumbers.length}
                    </strong>{" "}
                    of{" "}
                    <strong className="
                        text-slate-700
                        dark:text-slate-300
                    ">
                        {numbers.length}
                    </strong>{" "}
                    numbers

                </span>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <NumberTable
                numbers={filteredNumbers}
                loading={loading}
                user={user}

                onEdit={handleEditNumber}

                onDelete={handleDeleteNumber}
            />


            {/* =================================================
                FORM MODAL
            ================================================= */}

            <NumberFormModal
                open={showForm}

                onClose={closeForm}

                onSave={saveNumber}

                number={selectedNumber}

                saving={saving}

                user={user}
            />


            {/* =================================================
                DELETE MODAL
            ================================================= */}

            <NumberDeleteModal
                open={showDelete}

                number={selectedNumber}

                deleting={deleting}

                onConfirm={removeNumber}

                onClose={closeDelete}
            />


            {/* =================================================
                BULK ALLOCATION MODAL
            ================================================= */}

            <BulkAllocationModal
                open={showBulkAllocation}

                onClose={() =>
                    setShowBulkAllocation(false)
                }

                onSuccess={
                    handleBulkAllocationSuccess
                }
            />

        </div>

    );

}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
    title,
    value,
}) {

    return (

        <div className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow
            dark:border-slate-800
            dark:bg-slate-900
        ">

            <div className="
                mb-2
                flex
                items-center
                gap-2
            ">

                <BarChart3
                    size={18}
                    className="text-blue-600"
                />

                <span className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                ">
                    {title}
                </span>

            </div>

            <div className="
                text-3xl
                font-bold
                text-slate-900
                dark:text-white
            ">
                {value}
            </div>

        </div>

    );

}