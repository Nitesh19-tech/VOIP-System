import { useEffect, useState } from "react";

import clientService from "../../../services/clientService";
import userService from "../../../services/userService";

import {
  getCountries,
} from "../../../services/countryService";

import {
  getCarriers,
} from "../../../services/carrierService";

import {
  getTerminations,
} from "../../../services/terminationService";

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

    carrier: "",

    termination: "",

    did_number: "",

    extension: "",

    purchase_price: 0,

    monthly_rental: 0,

    description: "",

  };

  const [form, setForm] = useState(emptyForm);

  const [clients, setClients] = useState([]);

  const [admins, setAdmins] = useState([]);

  const [countries, setCountries] = useState([]);

  const [carriers, setCarriers] = useState([]);

  const [terminations, setTerminations] = useState([]);

  useEffect(() => {

    if (!open) return;

    loadClients();

    loadCountries();

    loadCarriers();

    loadTerminations();

    if (user?.role === "SUPER_ADMIN") {

      loadAdmins();

    }

    if (number) {

      setForm({

        admin: number.admin || "",

        client: number.client || "",

        country: number.country || "",

        carrier: number.carrier || "",

        termination: number.termination || "",

        did_number: number.did_number || "",

        extension: number.extension || "",

        purchase_price:
          number.purchase_price || 0,

        monthly_rental:
          number.monthly_rental || 0,

        description:
          number.description || "",

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

  const loadCarriers = async () => {

    try {

      const res =
        await getCarriers();

      setCarriers(res.data.data || []);

    } catch (err) {

      console.error(err);

    }

  };

  const loadTerminations = async () => {

    try {

      const res =
        await getTerminations();

      setTerminations(res.data.data || []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">

        <h2 className="mb-6 text-2xl font-bold">
          {number ? "Edit Number" : "Add Number"}
        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-2 gap-4"
        >

          {/* Admin */}

          {user?.role === "SUPER_ADMIN" && (

            <select
              name="admin"
              value={form.admin}
              onChange={handleChange}
              className="rounded-lg border p-3"
            >
              <option value="">Select Admin</option>

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
            className="rounded-lg border p-3"
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

          {/* Country */}

          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="rounded-lg border p-3"
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

          {/* Carrier */}

          <select
            name="carrier"
            value={form.carrier}
            onChange={handleChange}
            className="rounded-lg border p-3"
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

          {/* Termination */}

          <select
            name="termination"
            value={form.termination}
            onChange={handleChange}
            className="rounded-lg border p-3"
          >

            <option value="">
              Select Termination
            </option>

            {terminations
              .filter((item) => {

                if (!form.carrier) return true;

                return (
                  Number(item.carrier) ===
                  Number(form.carrier)
                );

              })
              .map((termination) => (

                <option
                  key={termination.id}
                  value={termination.id}
                >
                  {termination.name}
                </option>

              ))}

          </select>

          {/* DID */}

          <input
            name="did_number"
            placeholder="DID Number"
            value={form.did_number}
            onChange={handleChange}
            className="rounded-lg border p-3"
            required
          />

          {/* Extension */}

          <input
            name="extension"
            placeholder="Extension"
            value={form.extension}
            onChange={handleChange}
            className="rounded-lg border p-3"
            required
          />

          {/* Purchase */}

          <input
            type="number"
            step="0.01"
            name="purchase_price"
            placeholder="Purchase Price"
            value={form.purchase_price}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          {/* Rental */}

          <input
            type="number"
            step="0.01"
            name="monthly_rental"
            placeholder="Monthly Rental"
            value={form.monthly_rental}
            onChange={handleChange}
            className="rounded-lg border p-3"
          />

          {/* Description */}

          <textarea
            name="description"
            rows={4}
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="col-span-2 rounded-lg border p-3"
          />

          <div className="col-span-2 mt-4 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-300 px-5 py-2 hover:bg-slate-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
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