import { useEffect, useState } from "react";

import clientService from "../../../services/clientService";
import sipService from "../../../services/sipService";
import userService from "../../../services/userService";

export default function SIPFormModal({
  open,
  onClose,
  onSave,
  account,
  user,
  saving = false,
}) {

  const emptyForm = {
    admin: "",
    client: "",
    number: "",

    username: "",
    password: "",
    auth_id: "",

    transport: "UDP",
    context: "from-internal",
    domain: "pbx.local",

    caller_id: "",

    codecs: "ulaw,alaw",

    nat: true,
    qualify: true,

    status: "ACTIVE",
  };

  const [form, setForm] = useState(emptyForm);

  const [clients, setClients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [numbers, setNumbers] = useState([]);

  const [selectedNumber, setSelectedNumber] =
    useState(null);

  useEffect(() => {

    if (!open) return;

    loadClients();

    loadNumbers();

    if (user?.role === "SUPER_ADMIN") {
      loadAdmins();
    }

    if (account) {

      setForm({

        admin: account.admin || "",

        client: account.client || "",

        number: account.number || "",

        username: account.username || "",

        password: account.password || "",

        auth_id: account.auth_id || "",

        transport: account.transport || "UDP",

        context: account.context || "from-internal",

        domain: account.domain || "pbx.local",

        caller_id: account.caller_id || "",

        codecs: account.codecs || "ulaw,alaw",

        nat: account.nat,

        qualify: account.qualify,

        status: account.status || "ACTIVE",

      });

    } else {

      setForm(emptyForm);

      setSelectedNumber(null);

    }

  }, [open, account]);

  const loadClients = async () => {

    try {

      const res =
        await clientService.getClients();

      setClients(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadAdmins = async () => {

    try {

      const res =
        await userService.getUsers();

      setAdmins(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadNumbers = async () => {

    try {

      const res =
        await sipService.getAvailableNumbers();

      let data = res.data.data || [];

      // Edit Mode → Current Number bhi dikhana
      if (
        account &&
        account.number &&
        !data.find(
          (n) => n.id === account.number
        )
      ) {

        data.unshift({

          id: account.number,

          did_number: account.did_number,

          extension: account.extension,

          country_name: account.country_name,

          dial_code: account.dial_code,

          provider: account.provider,

        });

      }

      setNumbers(data);

    } catch (err) {

      console.error(err);

    }

  };
    const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    // Checkbox
    if (type === "checkbox") {

      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;

    }

    // Number Dropdown
    if (name === "number") {

      const selected = numbers.find(
        (n) => String(n.id) === value
      );

      setSelectedNumber(selected || null);

      setForm((prev) => ({

        ...prev,

        number: value,

        username:
          selected?.extension || "",

        auth_id:
          selected?.extension || "",

        caller_id: selected
          ? `${selected.did_number}`
          : "",

      }));

      return;

    }

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

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-6">

          {account
            ? "Edit SIP Account"
            : "Create SIP Account"}

        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-2 gap-4"
        >          {/* Admin */}

          {user?.role === "SUPER_ADMIN" && (

            <select
              name="admin"
              value={form.admin}
              onChange={handleChange}
              className="border rounded-lg p-3"
            >

              <option value="">
                Select Admin
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

          {/* Client */}

          <select
            name="client"
            value={form.client}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
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

          {/* DID Number */}

          <select
            name="number"
            value={form.number}
            onChange={handleChange}
            className="border rounded-lg p-3 col-span-2"
            required
          >

            <option value="">
              Select DID Number
            </option>

            {numbers.map((number) => (

              <option
                key={number.id}
                value={number.id}
              >
                {number.did_number}
                {" "}
                ({number.country_name})
              </option>

            ))}

          </select>

          {/* DID Information */}

          {selectedNumber && (

            <div className="col-span-2 rounded-xl border bg-slate-50 dark:bg-slate-800 p-4">

              <h3 className="font-semibold mb-3">
                Selected DID Information
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <div>

                  <p className="text-xs text-slate-500">
                    Country
                  </p>

                  <p className="font-semibold">
                    {selectedNumber.country_name}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Dial Code
                  </p>

                  <p className="font-semibold">
                    +{selectedNumber.dial_code}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Extension
                  </p>

                  <p className="font-semibold">
                    {selectedNumber.extension}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Provider
                  </p>

                  <p className="font-semibold">
                    {selectedNumber.provider || "-"}
                  </p>

                </div>

              </div>

            </div>

          )}

          {/* Username */}

          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="border rounded-lg p-3"
          />

          {/* Password */}

          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border rounded-lg p-3"
          />

          {/* Auth ID */}

          <input
            name="auth_id"
            value={form.auth_id}
            onChange={handleChange}
            placeholder="Auth ID"
            className="border rounded-lg p-3"
          />

          {/* Transport */}

          <select
            name="transport"
            value={form.transport}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >

            <option value="UDP">UDP</option>

            <option value="TCP">TCP</option>

            <option value="TLS">TLS</option>

          </select>

          {/* Domain */}

          <input
            name="domain"
            value={form.domain}
            onChange={handleChange}
            placeholder="Domain"
            className="border rounded-lg p-3"
          />

          {/* Context */}

          <input
            name="context"
            value={form.context}
            onChange={handleChange}
            placeholder="Context"
            className="border rounded-lg p-3"
          />
                    {/* Caller ID */}

          <input
            name="caller_id"
            value={form.caller_id}
            onChange={handleChange}
            placeholder="Caller ID"
            className="border rounded-lg p-3"
          />

          {/* Codecs */}

          <input
            name="codecs"
            value={form.codecs}
            onChange={handleChange}
            placeholder="Codecs"
            className="border rounded-lg p-3"
          />

          {/* NAT */}

          <label className="flex items-center gap-3 border rounded-lg p-3">

            <input
              type="checkbox"
              name="nat"
              checked={form.nat}
              onChange={handleChange}
            />

            <span>NAT Enabled</span>

          </label>

          {/* Qualify */}

          <label className="flex items-center gap-3 border rounded-lg p-3">

            <input
              type="checkbox"
              name="qualify"
              checked={form.qualify}
              onChange={handleChange}
            />

            <span>Qualify</span>

          </label>

          {/* Status */}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg p-3 col-span-2"
          >

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

            <option value="SUSPENDED">
              Suspended
            </option>

          </select>

          {/* Buttons */}

          <div className="col-span-2 flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : account
                ? "Update SIP Account"
                : "Create SIP Account"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}