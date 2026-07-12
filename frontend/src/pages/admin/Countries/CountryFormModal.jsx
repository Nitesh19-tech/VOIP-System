import { useEffect, useState } from "react";

export default function CountryFormModal({
  open,
  onClose,
  onSave,
  country,
  saving = false,
}) {

  const emptyForm = {
    name: "",
    iso_code: "",
    dial_code: "",
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {

    if (!open) return;

    if (country) {

      setForm({

        name: country.name || "",

        iso_code: country.iso_code || "",

        dial_code: country.dial_code || "",

        is_active: country.is_active,

      });

    } else {

      setForm(emptyForm);

    }

  }, [open, country]);

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

          {country
            ? "Edit Country"
            : "Add Country"}

        </h2>

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <input
            name="name"
            placeholder="Country Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="iso_code"
            placeholder="ISO Code (IN)"
            value={form.iso_code}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            name="dial_code"
            placeholder="Dial Code (91)"
            value={form.dial_code}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            Active

          </label>

          <div className="flex justify-end gap-3 pt-4">

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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >

              {saving
                ? "Saving..."
                : country
                ? "Update"
                : "Create"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}