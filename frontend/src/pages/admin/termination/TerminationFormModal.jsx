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

const INITIAL_STATE = {
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

  const [form, setForm] = useState(INITIAL_STATE);

  useEffect(() => {

    loadCarriers();

  }, []);

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

      setForm(INITIAL_STATE);

    }

  }, [termination, open]);

  const loadCarriers = async () => {

    try {

      const res = await getCarriers();

      setCarriers(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

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
        className="w-full max-w-6xl rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-2xl font-bold text-gray-800">

            {termination
              ? "Edit Termination"
              : "Add Termination"}

          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-red-500"
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[85vh] overflow-y-auto p-6"
        >

          <div className="grid grid-cols-2 gap-5">

            {/* Carrier */}

            <div>

              <label className="mb-2 block font-semibold text-gray-700">

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

            {/* Name */}

            <div>

              <label className="mb-2 block font-semibold">

                Name

              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              />

            </div>

            {/* Prefix */}

            <div>

              <label className="mb-2 block font-semibold">

                Prefix

              </label>

              <input
                type="text"
                name="prefix"
                value={form.prefix}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

            </div>

            {/* Currency */}

            <div>

              <label className="mb-2 block font-semibold">

                Currency

              </label>

              <input
                type="text"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

            </div>

            {/* Payment Term */}

            <div>

              <label className="mb-2 block font-semibold">

                Payment Term

              </label>

              <select
                name="payment_term"
                value={form.payment_term}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
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

              <label className="mb-2 block font-semibold">

                Max Duration

              </label>

              <input
                type="number"
                name="max_duration"
                value={form.max_duration}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />

            </div>

          </div>

          {/* Payout Section */}

          <div className="mt-8">

            <h3 className="mb-4 text-lg font-bold">

              Payout Settings

            </h3>

            <div className="grid grid-cols-3 gap-5">

              <Input
                label="Carrier"
                name="carrier_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Daily"
                name="daily_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Weekly"
                name="weekly_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Weekly7"
                name="weekly7_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Monthly30"
                name="monthly30_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Monthly45"
                name="monthly45_payout"
                form={form}
                onChange={handleChange}
              />

              <Input
                label="Monthly60"
                name="monthly60_payout"
                form={form}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* Info */}

          <div className="mt-6">

            <label className="mb-2 block font-semibold">

              Information

            </label>

            <textarea
              rows={4}
              name="info"
              value={form.info}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
            />

          </div>

          {/* Active */}

          <div className="mt-5 flex items-center gap-3">

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            <span>Active</span>

          </div>

          {/* Footer */}

          <div className="mt-8 flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-6 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-8 py-2 text-white"
            >
              {saving ? "Saving..." : "Save"}
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

      <label className="mb-2 block font-semibold">
        {label}
      </label>

      <input
        type="number"
        step="0.0001"
        name={name}
        value={form[name]}
        onChange={onChange}
        className="w-full rounded-lg border p-3"
      />

    </div>
  );

}