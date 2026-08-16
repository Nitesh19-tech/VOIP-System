import { useEffect, useState } from "react";

import {
  X,
  User,
  Globe,
  Building2,
  Server,
  DollarSign,
  FileText,
} from "lucide-react";

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

  // =====================================================
  // EMPTY FORM
  // =====================================================

  const emptyForm = {

    admin: "",

    client: "",

    country: "",

    carrier: "",

    termination: "",

    did_number: "",

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


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    if (!open) return;

    loadClients();

    loadCountries();

    loadCarriers();

    loadTerminations();

    if (user?.role === "SUPER_ADMIN") {

      loadAdmins();

    }


    // ===================================================
    // EDIT EXISTING NUMBER
    // ===================================================

    if (number) {

      setForm({

        admin: number.admin || "",

        client: number.client || "",

        country: number.country || "",

        carrier: number.carrier || "",

        termination: number.termination || "",

        did_number: number.did_number || "",

        purchase_price:
          number.purchase_price || 0,

        monthly_rental:
          number.monthly_rental || 0,

        description:
          number.description || "",

      });

    } else {

      // =================================================
      // CREATE NEW NUMBER
      // =================================================

      setForm(emptyForm);

    }

  }, [open, number]);


  // =====================================================
  // COUNTRIES
  // =====================================================

  const loadCountries = async () => {

    try {

      const res = await getCountries();

      setCountries(
        res.data.data || []
      );

    } catch (err) {

      console.error(
        "Countries Error:",
        err
      );

    }

  };


  // =====================================================
  // CLIENTS
  // =====================================================

  const loadClients = async () => {

    try {

      const res =
        await clientService.getClients();

      setClients(
        res.data.data || []
      );

    } catch (err) {

      console.error(
        "Clients Error:",
        err
      );

    }

  };


  // =====================================================
  // ADMINS
  // =====================================================

  const loadAdmins = async () => {

    try {

      const res =
        await userService.getUsers();

      setAdmins(
        res.data.data || []
      );

    } catch (err) {

      console.error(
        "Admins Error:",
        err
      );

    }

  };


  // =====================================================
  // CARRIERS
  // =====================================================

  const loadCarriers = async () => {

    try {

      const res =
        await getCarriers();

      setCarriers(
        res.data.data || []
      );

    } catch (err) {

      console.error(
        "Carriers Error:",
        err
      );

    }

  };


  // =====================================================
  // TERMINATIONS
  // =====================================================

  const loadTerminations = async () => {

    try {

      const res =
        await getTerminations();

      setTerminations(
        res.data.data || []
      );

    } catch (err) {

      console.error(
        "Terminations Error:",
        err
      );

    }

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const submit = (e) => {

    e.preventDefault();

    if (saving) return;

    // IMPORTANT:

    onSave(form);

  };


  if (!open) return null;


  return (

    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/60
        backdrop-blur-md

        p-6
      "
    >

      <div
        className="
          w-full
          max-w-5xl

          rounded-3xl

          bg-white
          dark:bg-slate-900

          border
          border-slate-200
          dark:border-slate-800

          shadow-2xl

          overflow-hidden
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between

            px-8
            py-6

            border-b
            border-slate-200
            dark:border-slate-800
          "
        >

          <div>

            <h2 className="text-2xl font-bold">

              {number
                ? "Edit DID Number"
                : "Add DID Number"}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Configure DID information.

            </p>

          </div>


          <button
            onClick={onClose}
            disabled={saving}
            className="
              h-11
              w-11

              rounded-xl

              hover:bg-slate-100
              dark:hover:bg-slate-800

              flex
              items-center
              justify-center

              transition
            "
          >

            <X size={20} />

          </button>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={submit}
          className="
            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

            p-8
          "
        >

          {/* =================================================
              ADMIN
          ================================================= */}

          {user?.role === "SUPER_ADMIN" && (

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-600
                  dark:text-slate-300
                "
              >

                Admin

              </label>


              <select
                name="admin"
                value={form.admin}
                onChange={handleChange}
                className="
                  w-full

                  rounded-xl

                  border
                  border-slate-300
                  dark:border-slate-700

                  bg-white
                  dark:bg-slate-950

                  px-4
                  py-3

                  outline-none

                  focus:ring-2
                  focus:ring-blue-500

                  transition
                "
              >

                <option value="">
                  Select Admin
                </option>

                {admins.map((admin) => (

                  <option
                    key={admin.id}
                    value={admin.id}
                  >

                    {admin.first_name}{" "}
                    {admin.last_name}

                  </option>

                ))}

              </select>

            </div>

          )}


          {/* =================================================
              CLIENT
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              Client

            </label>


            <select
              name="client"
              value={form.client}
              onChange={handleChange}
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
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

          </div>


          {/* =================================================
              COUNTRY
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              Country

            </label>


            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
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

          </div>


          {/* =================================================
              CARRIER
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              Carrier

            </label>


            <select
              name="carrier"
              value={form.carrier}
              onChange={handleChange}
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
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


          {/* =================================================
              TERMINATION
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              Termination

            </label>


            <select
              name="termination"
              value={form.termination}
              onChange={handleChange}
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            >

              <option value="">
                Select Termination
              </option>

              {terminations
                .filter((item) => {

                  if (!form.carrier) {
                    return true;
                  }

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

          </div>


          {/* =================================================
              DID NUMBER
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              DID Number

            </label>


            <input
              name="did_number"
              value={form.did_number}
              onChange={handleChange}
              placeholder="e.g. +919876543210"
              required
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>


          {/* =================================================
              PURCHASE PRICE
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              Purchase Price

            </label>


            <input
              type="number"
              step="0.01"
              name="purchase_price"
              value={form.purchase_price}
              onChange={handleChange}
              placeholder="0.00"
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>


          {/* =================================================
              MONTHLY RENTAL
          ================================================= */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              Monthly Rental

            </label>


            <input
              type="number"
              step="0.01"
              name="monthly_rental"
              value={form.monthly_rental}
              onChange={handleChange}
              placeholder="0.00"
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="md:col-span-2">

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-600
                dark:text-slate-300
              "
            >

              Description

            </label>


            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description..."
              className="
                w-full

                rounded-xl

                border
                border-slate-300
                dark:border-slate-700

                bg-white
                dark:bg-slate-950

                px-4
                py-3

                outline-none

                resize-none

                focus:ring-2
                focus:ring-blue-500

                transition
              "
            />

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="md:col-span-2 mt-4">

            <div
              className="
                flex
                items-center
                justify-end
                gap-3

                border-t
                border-slate-200
                dark:border-slate-800

                pt-6
              "
            >

              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="
                  rounded-xl

                  border
                  border-slate-300
                  dark:border-slate-700

                  px-6
                  py-3

                  font-medium

                  hover:bg-slate-100
                  dark:hover:bg-slate-800

                  transition
                "
              >

                Cancel

              </button>


              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-xl

                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500

                  px-6
                  py-3

                  font-semibold
                  text-white

                  shadow-lg

                  hover:shadow-xl
                  hover:scale-[1.02]

                  transition

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {saving
                  ? "Saving..."
                  : number
                  ? "Update Number"
                  : "Create Number"}

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>

  );

}
