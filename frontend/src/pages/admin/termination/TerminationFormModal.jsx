import { useEffect, useState } from "react";

import { getCarriers } from "../../../services/carrierService";

const PAYMENT_TERMS = [
  "Daily",
  "Weekly",
  "Weekly7",
  "Monthly30",
  "Monthly45",
  "Monthly60",
];

const INITIAL_FORM = {

  carrier: "",

  name: "",

  prefix: "",

  currency: "USD",

  payment_term: "Monthly30",

  carrier_payout: "0.0000",

  daily_payout: "0.0000",

  weekly_payout: "0.0000",

  weekly7_payout: "0.0000",

  monthly30_payout: "0.0000",

  monthly45_payout: "0.0000",

  monthly60_payout: "0.0000",

  max_duration: 0,

  info: "",

  is_active: true,

};

export default function TerminationFormModal({

  open,

  onClose,

  onSave,

  termination,

  saving,

}) {

  const [carriers, setCarriers] = useState([]);

  const [form, setForm] = useState(INITIAL_FORM);

  // ==========================================
  // Load Carriers
  // ==========================================

  useEffect(() => {

    if (open) {

      loadCarriers();

    }

  }, [open]);

  // ==========================================
  // Edit / Create
  // ==========================================

  useEffect(() => {

    if (!open) return;

    if (termination) {

      setForm({

        carrier: termination.carrier || "",

        name: termination.name || "",

        prefix: termination.prefix || "",

        currency: termination.currency || "USD",

        payment_term:
          termination.payment_term || "Monthly30",

        carrier_payout:
          termination.carrier_payout || "0.0000",

        daily_payout:
          termination.daily_payout || "0.0000",

        weekly_payout:
          termination.weekly_payout || "0.0000",

        weekly7_payout:
          termination.weekly7_payout || "0.0000",

        monthly30_payout:
          termination.monthly30_payout || "0.0000",

        monthly45_payout:
          termination.monthly45_payout || "0.0000",

        monthly60_payout:
          termination.monthly60_payout || "0.0000",

        max_duration:
          termination.max_duration || 0,

        info:
          termination.info || "",

        is_active:
          termination.is_active ?? true,

      });

    } else {

      setForm(INITIAL_FORM);

    }

  }, [termination, open]);

  // ==========================================
  // API
  // ==========================================

  const loadCarriers = async () => {

    try {

      const res = await getCarriers();

      setCarriers(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  // ==========================================
  // Form
  // ==========================================

  const handleChange = (e) => {

    const {

      name,

      value,

      checked,

      type,

    } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]:

        type === "checkbox"

          ? checked

          : value,

    }));

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    onSave(form);

  };

  if (!open) return null;

  return (

    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >

      <div
        className="w-full max-w-6xl rounded-xl bg-white dark:bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">

            {termination

              ? "Edit Termination"

              : "Add Termination"}

          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-red-600"
          >

            ×

          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[85vh] overflow-y-auto p-6"
        >
                      {/* ===========================
              Basic Information
          ============================ */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Carrier */}

            <div>

              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

                Carrier

              </label>

              <select
                name="carrier"
                value={form.carrier}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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

            {/* Name */}

            <div>

              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

                Name

              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Termination Name"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

            {/* Prefix */}

            <div>

              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

                Prefix

              </label>

              <input
                type="text"
                name="prefix"
                value={form.prefix}
                onChange={handleChange}
                placeholder="880, 91, 1..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

            {/* Currency */}

            <div>

              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

                Currency

              </label>

              <input
                type="text"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                placeholder="USD"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

            {/* Payment Term */}

            <div>

              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

                Payment Term

              </label>

              <select
                name="payment_term"
                value={form.payment_term}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >

                {PAYMENT_TERMS.map((item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                ))}

              </select>

            </div>

            {/* Max Duration */}

            <div>

              <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

                Max Duration (Sec)

              </label>

              <input
                type="number"
                min="0"
                name="max_duration"
                value={form.max_duration}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

            </div>

          </div>
                    {/* ===========================
              Payout Settings
          ============================ */}

          <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700">

            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">

                Payout Settings

              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                Configure payout values for each billing cycle.

              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">

              <Input
                label="Carrier Payout"
                name="carrier_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Daily Payout"
                name="daily_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Weekly Payout"
                name="weekly_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Weekly 7 Payout"
                name="weekly7_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Monthly 30 Payout"
                name="monthly30_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Monthly 45 Payout"
                name="monthly45_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Monthly 60 Payout"
                name="monthly60_payout"
                form={form}
                onChange={handleChange}
              />

            </div>

          </div>
                    {/* ===========================
              Information
          ============================ */}

          <div className="mt-8">

            <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

              Information

            </label>

            <textarea
              name="info"
              rows={4}
              value={form.info}
              onChange={handleChange}
              placeholder="Additional Information..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

          </div>

          {/* Active */}

          <div className="mt-6 flex items-center gap-3">

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />

            <label className="font-medium text-slate-700 dark:text-slate-300">

              Active

            </label>

          </div>

          {/* Footer */}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >

              Cancel

            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >

              {saving
                ? "Saving..."
                : termination
                ? "Update Termination"
                : "Create Termination"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

function Input({

  label,

  name,

  form,

  onChange,

}) {

  return (

    <div>

      <label className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">

        {label}

      </label>

      <input
        type="number"
        step="0.0001"
        name={name}
        value={form[name]}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />

    </div>

  );

}