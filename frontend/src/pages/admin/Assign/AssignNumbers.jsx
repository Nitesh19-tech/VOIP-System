import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import clientService from "../../../services/clientService";
import { getCarriers } from "../../../services/carrierService";
import { getTerminations } from "../../../services/terminationService";
import assignService from "../../../services/assignService";

export default function AssignNumbers() {
  // =====================================================
  // STATE
  // =====================================================

  const [clients, setClients] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [terminations, setTerminations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    carrier: "",
    payterm: "",
    prefix: "",
    payout: "",
    termination: "",
    quantity: 3,
    client: "",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [
        clientsRes,
        carriersRes,
        terminationsRes,
      ] = await Promise.all([
        clientService.getClients(),
        getCarriers(),
        getTerminations(),
      ]);

      setClients(
        clientsRes.data?.data || []
      );

      setCarriers(
        carriersRes.data?.data || []
      );

      setTerminations(
        terminationsRes.data?.data || []
      );

    } catch (err) {
      console.error(
        "Assign page load error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load assignment data."
      );

    } finally {
      setLoadingData(false);
    }
  };

  // =====================================================
  // FILTER TERMINATIONS BY CARRIER
  // =====================================================

  const filteredTerminations = useMemo(() => {
    if (!form.carrier) {
      return [];
    }

    return terminations.filter(
      (item) =>
        Number(item.carrier) ===
        Number(form.carrier)
    );
  }, [
    form.carrier,
    terminations,
  ]);

  // =====================================================
  // CHANGE
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

    setMessage("");
    setError("");
    setResult(null);

    // Carrier change
    if (name === "carrier") {
      setForm((prev) => ({
        ...prev,
        carrier: value,
        termination: "",
      }));
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setMessage("");
    setError("");
    setResult(null);

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!form.carrier) {
      setError("Please select a carrier.");
      return;
    }

    if (!form.client) {
      setError("Please select a client.");
      return;
    }

    if (
      !form.quantity ||
      Number(form.quantity) < 1
    ) {
      setError(
        "Quantity must be at least 1."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        carrier: Number(form.carrier),

        termination:
          form.termination
            ? Number(form.termination)
            : null,

        client: Number(form.client),

        quantity: Number(
          form.quantity
        ),

        prefix:
          form.prefix.trim() || "",

        payterm:
          form.payterm || "",

        payout:
          form.payout
            ? Number(form.payout)
            : null,
      };

      console.log(
        "Assign Numbers Payload:",
        payload
      );

      const res =
        await assignService.assignNumbers(
          payload
        );

      const data =
        res.data?.data || {};

      setResult(data);

      setMessage(
        res.data?.message ||
        "Numbers allocated successfully."
      );

      // Reset only assignment-specific
      // selection fields.
      setForm((prev) => ({
        ...prev,
        prefix: "",
        payout: "",
        termination: "",
        quantity: 3,
      }));

    } catch (err) {
      console.error(
        "Assign Numbers Error:",
        err
      );

      console.error(
        "Backend Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to allocate numbers."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {
    setForm({
      carrier: "",
      payterm: "",
      prefix: "",
      payout: "",
      termination: "",
      quantity: 3,
      client: "",
    });

    setMessage("");
    setError("");
    setResult(null);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingData) {
    return (
      <div className="
        flex
        min-h-[500px]
        items-center
        justify-center
      ">
        <div className="
          flex
          items-center
          gap-3
          text-slate-500
          dark:text-slate-400
        ">
          <RefreshCw
            size={22}
            className="animate-spin"
          />

          Loading assignment data...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <h1 className="
          text-3xl
          font-bold
          text-slate-900
          dark:text-white
        ">
          Assign Numbers
        </h1>

        <p className="
          mt-2
          text-slate-500
          dark:text-slate-400
        ">
          Automatically allocate available numbers
          from your number inventory.
        </p>
      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <div className="
          flex
          items-start
          gap-3
          rounded-xl
          border
          border-emerald-200
          bg-emerald-50
          p-4
          text-emerald-700
          dark:border-emerald-500/20
          dark:bg-emerald-500/10
          dark:text-emerald-400
        ">

          <CheckCircle2
            size={22}
            className="mt-0.5"
          />

          <div>
            <p className="font-semibold">
              Allocation Successful
            </p>

            <p className="mt-1 text-sm">
              {message}
            </p>
          </div>

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="
          flex
          items-start
          gap-3
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-4
          text-red-700
          dark:border-red-500/20
          dark:bg-red-500/10
          dark:text-red-400
        ">

          <AlertCircle
            size={22}
            className="mt-0.5"
          />

          <div>
            <p className="font-semibold">
              Allocation Failed
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>

        </div>
      )}

      {/* =================================================
          RESULT
      ================================================= */}

      {result && (
        <div className="
          rounded-xl
          border
          border-blue-200
          bg-blue-50
          p-5
          dark:border-blue-500/20
          dark:bg-blue-500/10
        ">

          <div className="
            flex
            flex-wrap
            gap-6
          ">

            <div>
              <p className="
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              ">
                Requested
              </p>

              <p className="
                mt-1
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              ">
                {result.requested || 0}
              </p>
            </div>

            <div>
              <p className="
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              ">
                Allocated
              </p>

              <p className="
                mt-1
                text-2xl
                font-bold
                text-emerald-600
              ">
                {result.allocated || 0}
              </p>
            </div>

            <div>
              <p className="
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              ">
                Client
              </p>

              <p className="
                mt-1
                font-semibold
                text-slate-900
                dark:text-white
              ">
                {result.client_name || "-"}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <div className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      ">

        {/* Header */}

        <div className="
          border-b
          border-slate-200
          px-6
          py-5
          dark:border-slate-800
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-500
            ">

              <ShieldCheck size={24} />

            </div>

            <div>

              <h2 className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              ">
                Bulk Allocation
              </h2>

              <p className="
                text-sm
                text-slate-500
                dark:text-slate-400
              ">
                Select allocation criteria
              </p>

            </div>

          </div>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-2
          ">

            {/* =================================================
                CARRIER
            ================================================= */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              ">
                Choose Carrier
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <select
                name="carrier"
                value={form.carrier}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              >

                <option value="">
                  Please Select Carrier
                </option>

                {carriers.map(
                  (carrier) => (
                    <option
                      key={carrier.id}
                      value={carrier.id}
                    >
                      {carrier.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                PAYTERM
            ================================================= */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              ">
                Choose Payterm
              </label>

              <select
                name="payterm"
                value={form.payterm}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              >

                <option value="">
                  Please Select
                </option>

                <option value="WEEKLY">
                  Weekly
                </option>

                <option value="MONTHLY">
                  Monthly
                </option>

                <option value="DAILY">
                  Daily
                </option>

              </select>

            </div>

            {/* =================================================
                PREFIX
            ================================================= */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              ">
                Termination Start With - Prefix
                <span className="
                  ml-1
                  font-normal
                  text-slate-400
                ">
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                name="prefix"
                value={form.prefix}
                onChange={handleChange}
                placeholder="Termination Prefix"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              />

            </div>

            {/* =================================================
                PAYOUT
            ================================================= */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              ">
                Payout
                <span className="
                  ml-1
                  font-normal
                  text-slate-400
                ">
                  (Optional - Default payout will apply)
                </span>
              </label>

              <input
                type="number"
                name="payout"
                min="0"
                step="0.0001"
                value={form.payout}
                onChange={handleChange}
                placeholder="0"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              />

            </div>

            {/* =================================================
                TERMINATION
            ================================================= */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              ">
                Choose Termination
                <span className="
                  ml-1
                  font-normal
                  text-slate-400
                ">
                  (Optional)
                </span>
              </label>

              <select
                name="termination"
                value={form.termination}
                onChange={handleChange}
                disabled={!form.carrier}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              >

                <option value="">
                  Select Termination
                </option>

                {filteredTerminations.map(
                  (termination) => (
                    <option
                      key={termination.id}
                      value={termination.id}
                    >
                      {termination.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                QUANTITY
            ================================================= */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              ">
                Nos. from each termination to Allocate
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              />

            </div>

            {/* =================================================
                CLIENT
            ================================================= */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-700
                dark:text-slate-300
              ">
                Choose Client
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <select
                name="client"
                value={form.client}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
              >

                <option value="">
                  Please Select
                </option>

                {clients.map(
                  (client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="
            mt-8
            flex
            flex-col-reverse
            gap-3
            border-t
            border-slate-200
            pt-6
            sm:flex-row
            sm:justify-end
            dark:border-slate-800
          ">

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="
                rounded-xl
                border
                border-slate-300
                px-6
                py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-slate-700
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                px-8
                py-3
                font-semibold
                text-white
                shadow-md
                transition
                hover:scale-[1.01]
                hover:shadow-lg
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading ? (
                <>
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />

                  Allocating...
                </>
              ) : (
                "Allocate Numbers"
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}