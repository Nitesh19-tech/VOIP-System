import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
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

  const [newIP, setNewIP] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editingIP, setEditingIP] = useState("");

  const [loading, setLoading] = useState(false);

  const loadIPs = async () => {

    if (!carrier) return;

    try {

      setLoading(true);

      const res = await getCarrierIPs({

        carrier: carrier.id,

      });

      setIps(res.data.data || []);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (open) {

      loadIPs();

    }

  }, [open, carrier]);

  const handleAdd = async () => {

    if (!newIP.trim()) return;

    await createCarrierIP({

      carrier: carrier.id,

      ip_address: newIP,

    });

    setNewIP("");

    loadIPs();

  };

  const handleUpdate = async (id) => {

    await updateCarrierIP(id, {

      carrier: carrier.id,

      ip_address: editingIP,

    });

    setEditingId(null);

    loadIPs();

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this IP?"))

      return;

    await deleteCarrierIP(id);

    loadIPs();

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">

        <div className="flex justify-between items-center border-b px-6 py-4">

          <h2 className="text-xl font-semibold">

            Carrier IPs

          </h2>

          <button

            onClick={onClose}

            className="text-xl"

          >

            ✕

          </button>

        </div>

        <div className="p-6">

          <h3 className="font-semibold mb-4">

            {carrier?.name}

          </h3>

          <div className="flex gap-3 mb-6">

            <input

              value={newIP}

              onChange={(e)=>

                setNewIP(e.target.value)

              }

              placeholder="Enter IP Address"

              className="flex-1 border rounded-xl px-4 py-3"

            />

            <button

              onClick={handleAdd}

              className="bg-green-600 text-white px-5 rounded-xl flex items-center gap-2"

            >

              <Plus size={18}/>

              Add

            </button>

          </div>

          {

            loading ?

            (

              <div>

                Loading...

              </div>

            )

            :

            (

              <table className="w-full">

                <thead>

                  <tr className="bg-slate-100">

                    <th className="text-left px-4 py-3">

                      IP Address

                    </th>

                    <th className="text-center px-4 py-3">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {

                    ips.map((ip)=>(

                      <tr
                        key={ip.id}
                        className="border-t"
                      >

                        <td className="px-4 py-3">

                          {

                            editingId===ip.id ?

                            (

                              <input

                                value={editingIP}

                                onChange={(e)=>

                                  setEditingIP(
                                    e.target.value
                                  )
                                }

                                className="border rounded-lg px-3 py-2 w-full"

                              />

                            )

                            :

                            ip.ip_address

                          }

                        </td>

                        <td className="px-4 py-3">

                          <div className="flex justify-center gap-2">

                            {

                              editingId===ip.id ?

                              (

                                <button

                                  onClick={()=>

                                    handleUpdate(ip.id)
                                  }

                                  className="bg-blue-600 text-white px-3 py-2 rounded-lg"

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

                                  className="bg-yellow-100 p-2 rounded-lg"

                                >

                                  <Pencil size={18}/>

                                </button>

                              )

                            }

                            <button

                              onClick={()=>

                                handleDelete(ip.id)
                              }

                              className="bg-red-100 p-2 rounded-lg"

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

            )

          }

        </div>

      </div>

    </div>

  );

}