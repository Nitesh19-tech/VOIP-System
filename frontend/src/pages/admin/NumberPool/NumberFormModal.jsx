import { useEffect, useState } from "react";

import clientService from "../../../services/clientService";
import userService from "../../../services/userService";

import {
  getCountries,
} from "../../../services/countryService";

export default function NumberFormModal({
  open,
  onClose,
  onSave,
  number,
  user,
  saving = false,
}) {

  const emptyForm = {

    admin: "",

    client: "",

    country: "",

    did_number: "",

    extension: "",

    provider: "",

    purchase_price: 0,

    monthly_rental: 0,

    description: "",

  };

  const [form, setForm] = useState(emptyForm);

  const [clients, setClients] = useState([]);

  const [admins, setAdmins] = useState([]);

  const [countries, setCountries] = useState([]);

  useEffect(() => {

    if (!open) return;

    loadClients();

    loadCountries();

    if (user?.role === "SUPER_ADMIN") {

      loadAdmins();

    }

    if (number) {

      setForm({

        admin: number.admin || "",

        client: number.client || "",

        country: number.country || "",

        did_number: number.did_number || "",

        extension: number.extension || "",

        provider: number.provider || "",

        purchase_price: number.purchase_price || 0,

        monthly_rental: number.monthly_rental || 0,

        description: number.description || "",

      });

    } else {

      setForm(emptyForm);

    }

  }, [open, number]);

  const loadCountries = async () => {

    try {

      const res = await getCountries();

      setCountries(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadClients = async () => {

    try {

      const res = await clientService.getClients();

      setClients(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadAdmins = async () => {

    try {

      const res = await userService.getUsers();

      setAdmins(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

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

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          {number ? "Edit Number" : "Add Number"}
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

          <select
            name="client"
            value={form.client}
            onChange={handleChange}
            className="border rounded-lg p-3"
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

          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          >

            <option value="">
              Select Country
            </option>

            {countries.map((country) => (

              <option
                key={country.id}
                value={country.id}
              >
                {country.name} (+{country.dial_code})
              </option>

            ))}

          </select>

          <input
            name="did_number"
            placeholder="DID Number"
            value={form.did_number}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            name="extension"
            placeholder="Extension"
            value={form.extension}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            name="provider"
            placeholder="Provider"
            value={form.provider}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            step="0.01"
            name="purchase_price"
            placeholder="Purchase Price"
            value={form.purchase_price}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="number"
            step="0.01"
            name="monthly_rental"
            placeholder="Monthly Rental"
            value={form.monthly_rental}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <textarea
            name="description"
            rows="4"
            placeholder="Description"
            value={form.description}
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
                : number
                ? "Update Number"
                : "Create Number"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}