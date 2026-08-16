import { useEffect, useState } from "react";

import numberPoolService from "../../../services/numberPoolService";

const INITIAL_FORM = {
  did: "",
  forward_number: "",
  termination: "",
  description: "",
  priority: 1,
  enabled: true,
};

export default function IncomingRouteFormModal({
  open,
  onClose,
  onSave,
  route,
  saving,
}) {
  const [numbers, setNumbers] = useState([]);

  const [form, setForm] = useState(INITIAL_FORM);

  const [loadingData, setLoadingData] = useState(false);

  // =====================================================
  // LOAD NUMBER POOL
  // =====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    loadNumbers();
  }, [open]);

  // =====================================================
  // SET FORM
  // =====================================================

  useEffect(() => {
    if (!open) {
      return;
    }

    if (route) {
      setForm({
        did: route.did || "",
        forward_number: route.forward_number || "",
        termination: route.termination || "",
        description: route.description || "",
        priority: route.priority ?? 1,
        enabled: route.enabled ?? true,
      });
    } else {
      setForm({
        ...INITIAL_FORM,
      });
    }
  }, [route, open]);

  // =====================================================
  // LOAD NUMBERS
  // =====================================================

  const loadNumbers = async () => {
    try {
      setLoadingData(true);

      const response = await numberPoolService.getNumbers();

      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setNumbers(data);
    } catch (error) {
      console.error(
        "Unable to load Number Pool:",
        error
      );

      alert(
        "Unable to load numbers from Number Pool."
      );
    } finally {
      setLoadingData(false);
    }
  };

  // =====================================================
  // GET SELECTED NUMBER
  // =====================================================

  const getSelectedNumber = (did) => {
    return numbers.find(
      (number) =>
        String(number.did_number) === String(did)
    );
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    // ---------------------------------------------------
    // DID CHANGE
    // ---------------------------------------------------

    if (name === "did") {
      const selectedNumber =
        getSelectedNumber(value);

      setForm((previous) => ({
        ...previous,

        did: value,

        // Automatically use Number Pool termination
        termination:
          selectedNumber?.termination ||
          selectedNumber?.termination_id ||
          "",
      }));

      return;
    }

    // ---------------------------------------------------
    // NORMAL CHANGE
    // ---------------------------------------------------

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    // =================================================
    // DID
    // =================================================

    if (!form.did) {
      alert("Please select a DID.");
      return;
    }

    // =================================================
    // FORWARD NUMBER
    // =================================================

    if (!form.forward_number.trim()) {
      alert("Please enter forward number.");
      return;
    }

    // =================================================
    // TERMINATION
    // =================================================

    if (!form.termination) {
      alert(
        "Selected DID does not have a termination."
      );
      return;
    }

    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {
      did: form.did.trim(),

      forward_number:
        form.forward_number.trim(),

      termination:
        Number(form.termination),

      description:
        form.description.trim(),

      priority:
        Number(form.priority),

      enabled:
        Boolean(form.enabled),
    };

    onSave(payload);
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    onClose();
  };

  // =====================================================
  // MODAL
  // =====================================================

  if (!open) {
    return null;
  }

  // =====================================================
  // CURRENT NUMBER
  // =====================================================

  const selectedNumber =
    getSelectedNumber(form.did);

  const selectedClientName =
    selectedNumber?.client_name ||
    selectedNumber?.client?.name ||
    "";

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/60
        p-4
      "
      onClick={handleClose}
    >
      <div
        className="
          w-full
          max-w-3xl
          overflow-hidden
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
          shadow-2xl
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-700
            px-6
            py-5
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              {route
                ? "Edit Incoming Route"
                : "Add Incoming Route"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              Configure incoming DID forwarding.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="
              text-3xl
              leading-none
              text-slate-400
              transition
              hover:text-white
              disabled:opacity-50
            "
          >
            ×
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            max-h-[80vh]
            overflow-y-auto
            p-6
          "
        >

          {/* =================================================
              DID
          ================================================= */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              DID Number

              <span className="ml-1 text-red-400">
                *
              </span>
            </label>

            <select
              name="did"
              value={form.did}
              onChange={handleChange}
              required
              disabled={
                loadingData ||
                Boolean(route)
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <option value="">
                {loadingData
                  ? "Loading DIDs..."
                  : "Select DID"}
              </option>

              {numbers
                .filter(
                  (number) =>
                    number.status ===
                      "AVAILABLE" ||
                    number.did_number ===
                      form.did
                )
                .map((number) => (
                  <option
                    key={number.id}
                    value={number.did_number}
                  >
                    {number.did_number}
                  </option>
                ))}
            </select>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Select a DID from Number Pool.
            </p>
          </div>

          {/* =================================================
              SELECTED CLIENT
          ================================================= */}

          {selectedClientName && (
            <div
              className="
                mt-4
                rounded-xl
                border
                border-slate-700
                bg-slate-800/60
                px-4
                py-3
              "
            >
              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Assigned Client
              </p>

              <p
                className="
                  mt-1
                  font-medium
                  text-white
                "
              >
                {selectedClientName}
              </p>
            </div>
          )}

          {/* =================================================
              FORWARD NUMBER
          ================================================= */}

          <div className="mt-5">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Forward Number

              <span className="ml-1 text-red-400">
                *
              </span>
            </label>

            <input
              type="text"
              name="forward_number"
              value={form.forward_number}
              onChange={handleChange}
              required
              placeholder="+919999999999"
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
                text-white
                outline-none
                transition
                placeholder:text-slate-600
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
            />

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Enter the destination number.
            </p>
          </div>

          {/* =================================================
              TERMINATION
          ================================================= */}

          <div className="mt-5">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Termination
            </label>

            <input
              type="text"
              value={
                selectedNumber?.termination_name ||
                "Termination from Number Pool"
              }
              readOnly
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
                text-slate-300
                outline-none
              "
            />

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Termination is taken from the
              selected Number Pool number.
            </p>
          </div>

          {/* =================================================
              PRIORITY
          ================================================= */}

          <div className="mt-5">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Priority
            </label>

            <input
              type="number"
              name="priority"
              min="1"
              value={form.priority}
              onChange={handleChange}
              required
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
            />
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="mt-5">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Description
            </label>

            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Incoming route description..."
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
                text-white
                outline-none
                placeholder:text-slate-600
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
            />
          </div>

          {/* =================================================
              ENABLED
          ================================================= */}

          <div
            className="
              mt-6
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-800
              bg-slate-950/50
              px-4
              py-3
            "
          >
            <input
              type="checkbox"
              name="enabled"
              checked={form.enabled}
              onChange={handleChange}
              className="
                h-4
                w-4
                rounded
                border-slate-600
                bg-slate-800
                text-blue-600
                focus:ring-blue-500
              "
            />

            <div>
              <label
                className="
                  cursor-pointer
                  text-sm
                  font-medium
                  text-slate-200
                "
              >
                Enable Incoming Route
              </label>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Disabled routes will not be
                included in the active dialplan.
              </p>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              mt-8
              flex
              justify-end
              gap-3
              border-t
              border-slate-800
              pt-6
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-6
                py-3
                font-medium
                text-slate-300
                transition
                hover:bg-slate-700
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingData
              }
              className="
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-7
                py-3
                font-medium
                text-white
                shadow-lg
                shadow-blue-500/20
                transition
                hover:from-blue-500
                hover:to-indigo-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving
                ? "Saving..."
                : route
                  ? "Update Route"
                  : "Create Route"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}