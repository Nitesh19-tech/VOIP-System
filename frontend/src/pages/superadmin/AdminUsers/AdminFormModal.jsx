import { useEffect, useState } from "react";

export default function AdminFormModal({
  open,
  onClose,
  onSave,
  user,
  saving = false,
}) {
  const emptyForm = {
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    role: "COMPANY_ADMIN",
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        role: "COMPANY_ADMIN",
        is_active: user.is_active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [user, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (saving) return;

    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          {user ? "Edit Admin User" : "Create Admin User"}
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-2 gap-4"
        >

          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          {!user && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="border rounded-lg p-3 col-span-2"
              required
            />
          )}

          <label className="flex items-center gap-2 col-span-2">

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            Active User

          </label>

          <div className="col-span-2 flex justify-end gap-3 mt-4">

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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : user
                  ? "Update Admin"
                  : "Create Admin"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}