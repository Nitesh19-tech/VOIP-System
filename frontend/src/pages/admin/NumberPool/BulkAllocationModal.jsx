import { useEffect, useState } from "react";

import clientService from "../../../services/clientService";
import numberPoolService from "../../../services/numberPoolService";

export default function BulkAllocationModal({
  open,
  onClose,
  onSuccess,
  selectedNumbers = [],
}) {
  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);

  const [form, setForm] = useState({
    client: "",
  });

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      client: "",
    });
  };

  // =====================================================
  // LOAD CLIENTS
  // =====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    resetForm();
    loadClients();
  }, [open]);

  const loadClients = async () => {
    try {
      const res = await clientService.getClients();

      setClients(res.data?.data || []);
    } catch (err) {
      console.error(
        "Load Clients Error:",
        err
      );

      setClients([]);
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // ALLOCATE SELECTED NUMBERS
  // =====================================================

  const allocate = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    // -------------------------------------------------
    // CHECK SELECTED NUMBERS
    // -------------------------------------------------

    if (!selectedNumbers.length) {
      alert(
        "Please select at least one number."
      );

      return;
    }

    // -------------------------------------------------
    // CHECK CLIENT
    // -------------------------------------------------

    if (!form.client) {
      alert(
        "Please select a client."
      );

      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------
      // PAYLOAD
      // -------------------------------------------------

      const payload = {
        number_ids: selectedNumbers.map(
          (id) => Number(id)
        ),

        client: Number(form.client),
      };

      console.log(
        "Bulk Allocation Payload:",
        payload
      );

      // -------------------------------------------------
      // API
      // -------------------------------------------------

      const res =
        await numberPoolService.bulkAllocate(
          payload
        );

      const allocated =
        res.data?.allocated_count ||
        selectedNumbers.length;

      alert(
        `${allocated} numbers allocated successfully.`
      );

      resetForm();

      onSuccess();

    } catch (err) {
      console.error(
        "Bulk Allocation Error:",
        err
      );

      console.error(
        "Backend Response:",
        err.response?.data
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.detail;

      alert(
        backendMessage ||
        "Allocation failed."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    resetForm();

    onClose();
  };

  // =====================================================
  // HIDDEN
  // =====================================================

  if (!open) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-2xl
          dark:border-slate-800
          dark:bg-slate-900
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">

          <h2
            className="
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Bulk Number Allocation
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Allocate selected numbers to a client.
          </p>

        </div>

        {/* =================================================
            SELECTED NUMBERS SUMMARY
        ================================================= */}

        <div
          className="
            mb-6
            rounded-xl
            border
            border-blue-200
            bg-blue-50
            p-4
            dark:border-blue-900
            dark:bg-blue-950/30
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-sm
                font-medium
                text-slate-600
                dark:text-slate-300
              "
            >
              Selected Numbers
            </span>

            <span
              className="
                rounded-full
                bg-blue-600
                px-3
                py-1
                text-sm
                font-bold
                text-white
              "
            >
              {selectedNumbers.length}
            </span>

          </div>

          <p
            className="
              mt-2
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            Only these selected numbers will be
            allocated.
          </p>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={allocate}
          className="space-y-5"
        >

          {/* =================================================
              CLIENT
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              "
            >
              Client
            </label>

            <select
              name="client"
              value={form.client}
              onChange={handleChange}
              required
              disabled={loading}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                p-3
                text-slate-900
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
                disabled:opacity-50
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
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

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              justify-end
              gap-3
              border-t
              border-slate-200
              pt-5
              dark:border-slate-800
            "
          >

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                rounded-xl
                bg-slate-200
                px-5
                py-2.5
                font-medium
                text-slate-700
                hover:bg-slate-300
                disabled:opacity-50
                dark:bg-slate-700
                dark:text-white
                dark:hover:bg-slate-600
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                selectedNumbers.length === 0
              }
              className="
                rounded-xl
                bg-emerald-600
                px-6
                py-2.5
                font-semibold
                text-white
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Allocating..."
                : `Allocate ${selectedNumbers.length} Numbers`}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}