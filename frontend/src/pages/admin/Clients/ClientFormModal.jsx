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
        users.filter((u) => u.role === "COMPANY_ADMIN")
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

  <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">

    {/* Header */}

    <div className="border-b border-slate-800 px-6 py-5">

      <h2 className="text-2xl font-bold text-white">
        {client ? "Edit Client" : "Create Client"}
      </h2>

    </div>

    {/* Body */}

    <div className="p-6">

      <form
        onSubmit={submit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        {user?.role === "SUPER_ADMIN" && (

          <select
            name="admin"
            value={form.admin}
            onChange={handleChange}
            className="
              col-span-1 md:col-span-2

              w-full

              rounded-xl

              border
              border-slate-700

              bg-slate-800

              text-white

              px-4
              py-3

              outline-none

              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20

              transition
            "
          >

            <option value="">
              Not Assigned
            </option>

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
          required
          className="
            w-full

            rounded-xl

            border
            border-slate-700

            bg-slate-800

            text-white

            placeholder:text-slate-400

            px-4
            py-3

            outline-none

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20

            transition
          "
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="
            w-full

            rounded-xl

            border
            border-slate-700

            bg-slate-800

            text-white

            placeholder:text-slate-400

            px-4
            py-3

            outline-none

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20

            transition
          "
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="
            w-full

            rounded-xl

            border
            border-slate-700

            bg-slate-800

            text-white

            placeholder:text-slate-400

            px-4
            py-3

            outline-none

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20

            transition
          "
        />

        <textarea
          name="address"
          rows={4}
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="
            col-span-1
            md:col-span-2

            w-full

            rounded-xl

            border
            border-slate-700

            bg-slate-800

            text-white

            placeholder:text-slate-400

            px-4
            py-3

            outline-none

            resize-none

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20

            transition
          "
        />

        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-800">

          <button
            type="button"
            onClick={onClose}
            className="
              px-6
              py-2.5

              rounded-xl

              border
              border-slate-700

              bg-slate-800

              text-slate-300

              hover:bg-slate-700

              transition
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              px-6
              py-2.5

              rounded-xl

              bg-blue-600

              text-white

              hover:bg-blue-700

              disabled:opacity-50
              disabled:cursor-not-allowed

              transition
            "
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

</div>
);
}