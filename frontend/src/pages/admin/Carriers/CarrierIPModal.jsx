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

  // =======================================
  // Load IPs
  // =======================================

  const loadIPs = async () => {

    if (!carrier) return;

    try {

      setLoading(true);

      const res = await getCarrierIPs({
        carrier: carrier.id,
      });

      setIps(Array.isArray(res.data.data) ? res.data.data : []);

    } catch (err) {

      console.error(err);

      alert("Unable to load IPs.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (open && carrier) {

      loadIPs();

    }

  }, [open, carrier]);

  // =======================================
  // Add
  // =======================================

  const handleAdd = async () => {

    if (!newIP.trim()) return;

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

  // =======================================
  // Update
  // =======================================

  const handleUpdate = async (id) => {

    try {

      await updateCarrierIP(id, {
        carrier: carrier.id,
        ip_address: editingIP,
      });

      setEditingId(null);

      setEditingIP("");

      loadIPs();

    } catch (err) {

      console.error(err);

      alert("Unable to update IP.");

    }

  };

  // =======================================
  // Delete
  // =======================================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this IP?"))
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

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">

          <div>

            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Carrier IP Management
            </h2>

            <p className="text-sm text-slate-500">
              {carrier?.name}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20}/>
          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <div className="mb-6 flex gap-3">

            <input
              type="text"
              value={newIP}
              onChange={(e)=>setNewIP(e.target.value)}
              placeholder="Enter IP Address"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
            />

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 text-white hover:bg-green-700"
            >
              <Plus size={18}/>
              Add
            </button>

          </div>

          {

            loading ?

            (

              <div className="py-10 text-center">

                Loading...

              </div>

            )

            :

            (

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

                <table className="min-w-full">

                  <thead className="bg-slate-100 dark:bg-slate-800">

                    <tr>

                      <th className="px-5 py-3 text-left">
                        IP Address
                      </th>

                      <th className="px-5 py-3 text-center">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {

                      ips.length===0 ?

                      (

                        <tr>

                          <td
                            colSpan={2}
                            className="py-8 text-center text-slate-500"
                          >

                            No IP Address Found

                          </td>

                        </tr>

                      )

                      :

                      ips.map((ip)=>(

                        <tr
                          key={ip.id}
                          className="border-t border-slate-200 dark:border-slate-700"
                        >

                          <td className="px-5 py-3">

                            {

                              editingId===ip.id ?

                              (

                                <input
                                  value={editingIP}
                                  onChange={(e)=>setEditingIP(e.target.value)}
                                  className="w-full rounded-lg border px-3 py-2"
                                />

                              )

                              :

                              ip.ip_address

                            }

                          </td>

                          <td>

                            <div className="flex justify-center gap-2">

                              {

                                editingId===ip.id ?

                                (

                                  <button
                                    onClick={()=>handleUpdate(ip.id)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                                  >
                                    Save
                                  </button>

                                )

                                :

                                (

                                  <button
                                    onClick={()=>{
                                      setEditingId(ip.id);
                                      setEditingIP(ip.ip_address);
                                    }}
                                    className="rounded-lg bg-yellow-100 p-2 hover:bg-yellow-200"
                                  >
                                    <Pencil size={18}/>
                                  </button>

                                )

                              }

                              <button
                                onClick={()=>handleDelete(ip.id)}
                                className="rounded-lg bg-red-100 p-2 hover:bg-red-200"
                              >
                                <Trash2 size={18}/>
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