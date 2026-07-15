import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    X,
} from "lucide-react";

import {
    getCarrierIPs,
    createCarrierIP,
    updateCarrierIP,
    deleteCarrierIP,
} from "../../../services/carrierService";

export default function CarrierIPModal({
    open,
    carrier,
    onClose,
}) {

    const [ips, setIps] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newIP, setNewIP] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingIP, setEditingIP] = useState("");

    // ============================================
    // Load Carrier IPs
    // ============================================

    const loadIPs = async () => {

        if (!carrier) return;

        try {

            setLoading(true);

            const res = await getCarrierIPs({
                carrier: carrier.id,
            });

            setIps(
                Array.isArray(res.data.data)
                    ? res.data.data
                    : []
            );

        } catch (err) {

            console.error(err);

            alert("Unable to load Carrier IPs.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (open && carrier) {

            loadIPs();

        }

    }, [open, carrier]);

    // ============================================
    // Add New IP
    // ============================================

    const handleAdd = async () => {

        if (!newIP.trim()) {

            alert("Please enter IP Address.");

            return;

        }

        try {

            await createCarrierIP({

                carrier: carrier.id,

                ip_address: newIP.trim(),

            });

            setNewIP("");

            loadIPs();

        } catch (err) {

            console.error(err);

            alert("Unable to add IP.");

        }

    };

    // ============================================
    // Update IP
    // ============================================

    const handleUpdate = async (id) => {

        if (!editingIP.trim()) {

            alert("IP Address cannot be empty.");

            return;

        }

        try {

            await updateCarrierIP(id, {

                carrier: carrier.id,

                ip_address: editingIP.trim(),

            });

            setEditingId(null);

            setEditingIP("");

            loadIPs();

        } catch (err) {

            console.error(err);

            alert("Unable to update IP.");

        }

    };

    // ============================================
    // Delete IP
    // ============================================

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this IP Address?"))
            return;

        try {

            await deleteCarrierIP(id);

            loadIPs();

        } catch (err) {

            console.error(err);

            alert("Unable to delete IP.");

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-[900px] max-w-[95vw] rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-5">

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">

                            Carrier IP Management

                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                            {carrier?.name}

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* Body */}

                <div className="p-6">

                    {/* Add New IP */}

                    <div className="mb-6 flex items-center gap-3">

                        <input

                            type="text"

                            value={newIP}

                            onChange={(e) =>
                                setNewIP(e.target.value)
                            }

                            placeholder="Enter IP Address"

                            className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-slate-900
                placeholder:text-slate-400
                outline-none
                focus:border-blue-500
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "

                        />

                        <button

                            type="button"

                            onClick={handleAdd}

                            className="
                shrink-0
                rounded-xl
                bg-green-600
                px-6
                py-3
                text-white
                hover:bg-green-700
                flex
                items-center
                gap-2
              "

                        >

                            <Plus size={18} />

                            Add

                        </button>

                    </div>
                    {

                        loading ?

                            (

                                <div className="py-12 text-center text-slate-500 dark:text-slate-400">

                                    Loading Carrier IPs...

                                </div>

                            )

                            :

                            (

                                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">

                                    <table className="min-w-full">

                                        <thead className="bg-slate-100 dark:bg-slate-800">

                                            <tr>

                                                <th className="px-5 py-4 text-left font-semibold">

                                                    IP Address

                                                </th>

                                                <th className="px-5 py-4 text-center font-semibold">

                                                    Actions

                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                ips.length === 0 ?

                                                    (

                                                        <tr>

                                                            <td
                                                                colSpan={2}
                                                                className="py-10 text-center text-slate-500 dark:text-slate-400"
                                                            >

                                                                No IP Addresses Found

                                                            </td>

                                                        </tr>

                                                    )

                                                    :

                                                    ips.map((ip) => (

                                                        <tr
                                                            key={ip.id}
                                                            className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                                        >

                                                            <td className="px-5 py-4">

                                                                {

                                                                    editingId === ip.id ?

                                                                        (

                                                                            <input

                                                                                type="text"

                                                                                value={editingIP}

                                                                                onChange={(e) =>
                                                                                    setEditingIP(e.target.value)
                                                                                }

                                                                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2
                                    text-slate-900
                                    outline-none
                                    focus:border-blue-500
                                    dark:border-slate-700
                                    dark:bg-slate-800
                                    dark:text-white
                                  "

                                                                            />

                                                                        )

                                                                        :

                                                                        (

                                                                            <span className="font-medium">

                                                                                {ip.ip_address}

                                                                            </span>

                                                                        )

                                                                }

                                                            </td>

                                                            <td className="px-5 py-4">

                                                                <div className="flex justify-center gap-2">

                                                                    {

                                                                        editingId === ip.id ?

                                                                            (

                                                                                <button

                                                                                    onClick={() =>
                                                                                        handleUpdate(ip.id)
                                                                                    }

                                                                                    className="
                                      rounded-lg
                                      bg-blue-600
                                      px-4
                                      py-2
                                      text-white
                                      hover:bg-blue-700
                                    "

                                                                                >

                                                                                    Save

                                                                                </button>

                                                                            )

                                                                            :

                                                                            (

                                                                                <button

                                                                                    onClick={() => {

                                                                                        setEditingId(ip.id);

                                                                                        setEditingIP(ip.ip_address);

                                                                                    }}

                                                                                    className="
                                      rounded-lg
                                      bg-yellow-100
                                      p-2
                                      text-yellow-700
                                      hover:bg-yellow-200
                                    "

                                                                                    title="Edit"

                                                                                >

                                                                                    <Pencil size={18} />

                                                                                </button>

                                                                            )

                                                                    }

                                                                    <button

                                                                        onClick={() =>
                                                                            handleDelete(ip.id)
                                                                        }

                                                                        className="
                                  rounded-lg
                                  bg-red-100
                                  p-2
                                  text-red-700
                                  hover:bg-red-200
                                "

                                                                        title="Delete"

                                                                    >

                                                                        <Trash2 size={18} />

                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    ))

                                            }

                                        </tbody>

                                    </table>

                                </div>

                            )

                    }

                </div>

            </div>

        </div>

    );

}