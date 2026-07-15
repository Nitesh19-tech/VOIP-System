import { useEffect, useMemo, useState } from "react";

import clientService from "../../../services/clientService";
import { getCarriers } from "../../../services/carrierService";
import { getTerminations } from "../../../services/terminationService";
import numberPoolService from "../../../services/numberPoolService";

export default function BulkAllocationModal({
  open,
  onClose,
  onSuccess,
}) {

  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);

  const [carriers, setCarriers] = useState([]);

  const [terminations, setTerminations] = useState([]);

  const [form, setForm] = useState({

    carrier: "",

    termination: "",

    client: "",

    quantity: 1,

  });

  // ==========================================
  // Load Data
  // ==========================================

  useEffect(() => {

    if (!open) return;

    loadClients();

    loadCarriers();

    loadTerminations();

    setForm({

      carrier: "",

      termination: "",

      client: "",

      quantity: 1,

    });

  }, [open]);

  const loadClients = async () => {

    try {

      const res =
        await clientService.getClients();

      setClients(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadCarriers = async () => {

    try {

      const res =
        await getCarriers();

      setCarriers(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadTerminations = async () => {

    try {

      const res =
        await getTerminations();

      setTerminations(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  // ==========================================
  // Filter
  // ==========================================

  const filteredTerminations = useMemo(() => {

    if (!form.carrier)
      return [];

    return terminations.filter(

      (item) =>

        Number(item.carrier) ===
        Number(form.carrier)

    );

  }, [
    form.carrier,
    terminations,
  ]);

  // ==========================================
  // Change
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  // ==========================================
  // Submit
  // ==========================================

  const allocate = async (e) => {

    e.preventDefault();

    if (loading) return;

    try {

      setLoading(true);

      await numberPoolService.bulkAllocate(
        form
      );

      alert(
        "Numbers allocated successfully."
      );

      onSuccess();

    } catch (err) {

      console.error(err);

      alert(

        err?.response?.data?.message ||

        "Allocation failed."

      );

    } finally {

      setLoading(false);

    }

  };

  if (!open) return null;
    return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">

        {/* Header */}

        <h2 className="mb-6 text-2xl font-bold">

          Bulk Number Allocation

        </h2>

        <form
          onSubmit={allocate}
          className="space-y-5"
        >

          {/* Carrier */}

          <div>

            <label className="mb-2 block font-semibold">

              Carrier

            </label>

            <select
              name="carrier"
              value={form.carrier}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            >

              <option value="">
                Select Carrier
              </option>

              {carriers.map((carrier) => (

                <option
                  key={carrier.id}
                  value={carrier.id}
                >
                  {carrier.name}
                </option>

              ))}

            </select>

          </div>

          {/* Termination */}

          <div>

            <label className="mb-2 block font-semibold">

              Termination

            </label>

            <select
              name="termination"
              value={form.termination}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            >

              <option value="">
                Select Termination
              </option>

              {filteredTerminations.map((termination) => (

                <option
                  key={termination.id}
                  value={termination.id}
                >
                  {termination.name}
                </option>

              ))}

            </select>

          </div>

          {/* Client */}

          <div>

            <label className="mb-2 block font-semibold">

              Client

            </label>

            <select
              name="client"
              value={form.client}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            >

              <option value="">
                Select Client
              </option>

              {clients.map((client) => (

                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                </option>

              ))}

            </select>

          </div>

          {/* Quantity */}

          <div>

            <label className="mb-2 block font-semibold">

              Quantity

            </label>

            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-slate-300 px-5 py-2 hover:bg-slate-400 dark:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading
                ? "Allocating..."
                : "Allocate"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}