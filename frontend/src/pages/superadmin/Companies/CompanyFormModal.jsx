import { useEffect, useState } from "react";

export default function CompanyFormModal({
  open,
  onClose,
  onSave,
  company,
  saving = false,
}) {
  const emptyForm = {
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (company) {
      setForm({
        name: company.name || "",
        code: company.code || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        country: company.country || "India",
      });
    } else {
      setForm(emptyForm);
    }
  }, [company, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (saving) return;

    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          {company ? "Edit Company" : "Add Company"}
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-2 gap-4"
        >

          <input
            name="name"
            placeholder="Company Name"
            value={form.name}
            onChange={handleChange}
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent"
            required
          />

          <input
            name="code"
            placeholder="Company Code"
            value={form.code}
            onChange={handleChange}
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent"
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent"
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent"
          />

          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-transparent col-span-2"
          />

          <div className="col-span-2 flex justify-end gap-3 mt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-slate-300 dark:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : company
                ? "Update Company"
                : "Create Company"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}