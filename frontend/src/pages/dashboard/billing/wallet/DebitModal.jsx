import { useEffect, useState } from "react";

export default function DebitModal({
  open,
  onClose,
  onSave,
  wallet,
  saving = false,
}) {

  const emptyForm = {
    amount: "",
    reference: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {

    if (!open) return;

    setForm(emptyForm);

  }, [open]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const submit = (e) => {

    e.preventDefault();

    if (saving) return;

    onSave(form);

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">

          Debit Wallet

        </h2>

        <div className="mb-5 space-y-2">

          <div>

            <span className="text-slate-500">

              Client

            </span>

            <p className="font-semibold">

              {wallet?.client_name}

            </p>

          </div>

          <div>

            <span className="text-slate-500">

              Current Balance

            </span>

            <p className="text-2xl font-bold text-red-600">

              ₹ {wallet?.balance}

            </p>

          </div>

        </div>

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <input
            type="number"
            step="0.01"
            min="0"
            name="amount"
            placeholder="Debit Amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="reference"
            placeholder="Reference"
            value={form.reference}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-300 hover:bg-slate-400"
            >

              Cancel

            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >

              {saving
                ? "Processing..."
                : "Debit"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}