import { useEffect, useState } from "react";
import userService from "../../../services/userService";

export default function ClientFormModal({
  open,
  onClose,
  onSave,
  client,
  user,
  saving = false,
}) {
  const emptyForm = {
    admin: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [admins, setAdmins] = useState([]);

  const loadAdmins = async () => {
    try {
      const res = await userService.getUsers();

      const users = res.data.data || [];

      setAdmins(
        users.filter(
          (u) => u.role === "COMPANY_ADMIN"
        )
      );
    } catch (err) {
      console.error("Load Admin Error", err);
    }
  };

  useEffect(() => {
    if (!open) return;

    if (user?.role === "SUPER_ADMIN") {
      loadAdmins();
    }

    if (client) {
      setForm({
        admin: client.admin || "",
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [client, open, user]);

  if (!open) return null;

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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          {client ? "Edit Client" : "Create Client"}
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-2 gap-4"
        >

          {user?.role === "SUPER_ADMIN" && (
            <select
              name="admin"
              value={form.admin}
              onChange={handleChange}
              className="border rounded-lg p-3 col-span-2"
            >
              <option value="">Not Assigned</option>

              {admins.map((admin) => (
                <option
                  key={admin.id}
                  value={admin.id}
                >
                  {admin.first_name} {admin.last_name}
                </option>
              ))}
            </select>
          )}

          <input
            name="name"
            placeholder="Client Name"
            value={form.name}
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
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <textarea
            name="address"
            rows="4"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border rounded-lg p-3 col-span-2"
          />

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
                : client
                ? "Update Client"
                : "Create Client"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}