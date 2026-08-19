import { useEffect, useState } from "react";
import { X, Search, ChevronDown } from "lucide-react";

import { getCarriers } from "../../../services/carrierService";
import { getTerminations } from "../../../services/terminationService";

const EMPTY_FORM = {
  carrier: "",
  termination: "",

  // Previous panel:
  // 1 = Test Number
  // 2 = General
  numberType: "2",

  // single | range | list | csv
  numberMode: "single",

  number: "",
  length: 1,

  dailyMaxCall: 0,
  dailyMaxDuration: 0,

  numberService: "",
  serviceVariables: "",

  testNumber: false,

  csvFile: null,
};

const SERVICES = [
  {
    id: "3",
    name: "ConferenceCut",
  },
  {
    id: "1",
    name: "Playback",
  },
  {
    id: "2",
    name: "PlaybackLoop",
  },
  {
    id: "4",
    name: "Reject",
  },
];

export default function NumberFormModal({
  open,
  onClose,
  onSave,
  number,
  saving = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [carriers, setCarriers] = useState([]);
  const [terminations, setTerminations] = useState([]);

  // =====================================================
  // LOAD FORM DATA
  // =====================================================

  useEffect(() => {
    if (!open) return;

    loadData();

    if (number) {
      setForm({
        ...EMPTY_FORM,

        carrier: number.carrier || "",

        termination:
          number.termination || "",

        numberType:
          number.number_type === "TEST"
            ? "1"
            : "2",

        numberMode:
          number.number_mode
            ? String(number.number_mode).toLowerCase()
            : "single",

        number:
          number.did_number ||
          number.number ||
          "",

        length:
          number.total_numbers || 1,

        dailyMaxCall:
          number.daily_max_call || 0,

        dailyMaxDuration:
          number.daily_max_duration || 0,

        numberService:
          number.number_service || "",

        serviceVariables:
          JSON.stringify(
            number.service_variables || {},
            null,
            2
          ),

        testNumber:
          Boolean(
            number.is_test_number
          ),

        csvFile: null,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
      });
    }
  }, [open, number]);

  // =====================================================
  // LOAD CARRIERS / TERMINATIONS
  // =====================================================

  const loadData = async () => {
    try {
      const [
        carrierRes,
        terminationRes,
      ] = await Promise.all([
        getCarriers(),
        getTerminations(),
      ]);

      setCarriers(
        carrierRes?.data?.data || []
      );

      setTerminations(
        terminationRes?.data?.data || []
      );
    } catch (error) {
      console.error(
        "Number form data error:",
        error
      );
    }
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    // Carrier change => reset termination
    if (name === "carrier") {
      setForm((previous) => ({
        ...previous,
        carrier: value,
        termination: "",
      }));
    }

    // Number Type change
    if (name === "numberType") {
      setForm((previous) => ({
        ...previous,
        numberType: value,

        // If user selects General,
        // don't keep old test checkbox active.
        testNumber:
          value === "1"
            ? previous.testNumber
            : false,
      }));
    }
  };

  // =====================================================
  // PARSE CSV
  // =====================================================

  const parseCSV = (text) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return [];
    }

    // -------------------------------------------------
    // Find header
    // -------------------------------------------------

    const header = lines[0]
      .split(",")
      .map((column) =>
        column
          .trim()
          .replace(/^"|"$/g, "")
          .toLowerCase()
      );

    // -------------------------------------------------
    // Find Number column
    // -------------------------------------------------

    const numberIndex = header.findIndex(
      (column) =>
        column === "number" ||
        column === "did_number" ||
        column === "did" ||
        column === "phone" ||
        column === "phone_number"
    );

    // -------------------------------------------------
    // No known header:
    // fallback to first column
    // -------------------------------------------------

    if (numberIndex === -1) {
      return lines
        .map((line) => {
          const firstColumn =
            line
              .split(",")[0]
              ?.trim();

          return firstColumn?.replace(
            /^"|"$/g,
            ""
          );
        })
        .filter(Boolean);
    }

    // -------------------------------------------------
    // Read Number column
    // -------------------------------------------------

    return lines
      .slice(1)
      .map((line) => {
        const columns = line
          .split(",");

        return columns[numberIndex]
          ?.trim()
          .replace(/^"|"$/g, "");
      })
      .filter(Boolean);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const submit = async (event) => {
    event.preventDefault();

    if (saving) return;

    // -------------------------------------------------
    // CARRIER
    // -------------------------------------------------

    if (!form.carrier) {
      alert(
        "Please select Carrier."
      );
      return;
    }

    // -------------------------------------------------
    // TERMINATION
    // -------------------------------------------------

    if (!form.termination) {
      alert(
        "Please select Termination."
      );
      return;
    }

    // -------------------------------------------------
    // SERVICE
    // -------------------------------------------------

    if (!form.numberService) {
      alert(
        "Please select Numbers Service."
      );
      return;
    }

    // -------------------------------------------------
    // NUMBER
    // -------------------------------------------------

    if (
      form.numberMode !== "csv" &&
      !form.number.trim()
    ) {
      alert(
        "Please enter Number."
      );
      return;
    }

    // =================================================
    // CSV
    // =================================================

    let csvNumbers = [];

    if (form.numberMode === "csv") {
      if (!form.csvFile) {
        alert(
          "Please select a CSV file."
        );
        return;
      }

      try {
        const csvText =
          await form.csvFile.text();

        csvNumbers =
          parseCSV(csvText);
      } catch (error) {
        console.error(
          "CSV read error:",
          error
        );

        alert(
          "Unable to read CSV file."
        );

        return;
      }

      if (!csvNumbers.length) {
        alert(
          "No valid numbers found in CSV."
        );
        return;
      }
    }

    // =================================================
    // LIST
    // =================================================

    let numberList = [];

    if (form.numberMode === "list") {
      numberList = form.number
        .split(/[\n,;]+/)
        .map((value) =>
          value.trim()
        )
        .filter(Boolean);

      if (!numberList.length) {
        alert(
          "Please enter at least one number."
        );
        return;
      }
    }

    // =================================================
    // RANGE
    // =================================================

    if (form.numberMode === "range") {
      const total =
        Number(form.length) || 0;

      if (total < 1) {
        alert(
          "Total Numbers must be greater than zero."
        );
        return;
      }
    }

    // =================================================
    // SERVICE VARIABLES
    // =================================================

    let serviceVariables = {};

    if (
      form.serviceVariables.trim()
    ) {
      try {
        serviceVariables =
          JSON.parse(
            form.serviceVariables
          );

        if (
          typeof serviceVariables !==
          "object" ||
          Array.isArray(
            serviceVariables
          ) ||
          serviceVariables === null
        ) {
          alert(
            "Service Variables must be a JSON object."
          );

          return;
        }
      } catch {
        // Keep plain text compatible
        // with backend normalization.
        serviceVariables = {
          value:
            form.serviceVariables.trim(),
        };
      }
    }

    // =================================================
    // NUMBER TYPE / TEST
    // =================================================

    const numberType =
      form.numberType === "1"
        ? "TEST"
        : "GENERAL";

    const isTestNumber =
      form.testNumber ||
      numberType === "TEST";

    // =================================================
    // NUMBER MODE
    // =================================================

    let numberMode = "SINGLE";

    if (
      form.numberMode === "range"
    ) {
      numberMode = "RANGE";
    } else if (
      form.numberMode === "list"
    ) {
      numberMode = "LIST";
    } else if (
      form.numberMode === "csv"
    ) {
      numberMode = "CSV";
    }

    // =================================================
    // PAYLOAD
    // =================================================

    await onSave({
      carrier:
        Number(form.carrier),

      termination:
        Number(form.termination),

      // Client intentionally optional.
      client: null,

      number_mode:
        numberMode,

      number_type:
        numberType,

      number:
        form.number.trim(),

      did_number:
        form.number.trim(),

      length:
        Number(form.length) || 1,

      number_list:
        numberList,

      csv_numbers:
        csvNumbers,

      daily_max_call:
        Number(
          form.dailyMaxCall
        ) || 0,

      daily_max_duration:
        Number(
          form.dailyMaxDuration
        ) || 0,

      number_service:
        form.numberService,

      service_variables:
        serviceVariables,

      set_test_number:
        isTestNumber,
    });
  };

  // =====================================================
  // FILTER TERMINATIONS
  // =====================================================

  const filteredTerminations =
    terminations.filter((item) => {
      if (!form.carrier) {
        return true;
      }

      return (
        Number(item.carrier) ===
        Number(form.carrier)
      );
    });

  // =====================================================
  // RENDER
  // =====================================================

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
        p-6
        backdrop-blur-md
      "
    >
      <div
        className="
          w-full
          max-w-6xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          dark:bg-slate-900
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
            border-b
            border-slate-200
            px-8
            py-5
            dark:border-slate-800
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {number
                ? "Edit Number"
                : "Add Number"}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Configure DID number
              provisioning options.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              hover:bg-slate-100
              dark:hover:bg-slate-800
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={submit}>
          <div
            className="
              grid
              max-h-[70vh]
              grid-cols-1
              gap-8
              overflow-y-auto
              p-8
              md:grid-cols-3
            "
          >
            {/* =================================================
                LEFT
            ================================================= */}

            <div className="space-y-5">
              {/* CARRIER */}

              <Field
                label="Select Carrier"
                required
              >
                <Select
                  name="carrier"
                  value={form.carrier}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Please Select
                  </option>

                  {carriers.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </Select>
              </Field>

              {/* TERMINATION */}

              <Field
                label="Select Termination"
                required
              >
                <div className="relative">
                  <Search
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    size={17}
                  />

                  <select
                    name="termination"
                    value={form.termination}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      py-3.5
                      pl-10
                      pr-10
                      outline-none
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  >
                    <option value="">
                      Search Termination
                    </option>

                    {filteredTerminations.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    size={17}
                  />
                </div>
              </Field>

              {/* NUMBER TYPE */}

              <Field
                label="Number Type"
                required
              >
                <Select
                  name="numberType"
                  value={form.numberType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Please Select
                  </option>

                  <option value="1">
                    Test Number
                  </option>

                  <option value="2">
                    General
                  </option>
                </Select>
              </Field>

              {/* TEST NUMBER */}

              <Field label="Set Test Number">
                <label
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  <input
                    type="checkbox"
                    name="testNumber"
                    checked={
                      form.testNumber
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      h-4
                      w-4
                      rounded
                      text-blue-600
                    "
                  />

                  Yes
                </label>
              </Field>
            </div>

            {/* =================================================
                CENTER
            ================================================= */}

            <div className="space-y-5">
              {/* NUMBER MODE */}

              <Field label="Number Add Options">
                <div
                  className="
                    flex
                    flex-wrap
                    gap-x-4
                    gap-y-2
                    text-sm
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  {[
                    [
                      "single",
                      "Single Number",
                    ],
                    [
                      "range",
                      "Range",
                    ],
                    [
                      "list",
                      "List",
                    ],
                    [
                      "csv",
                      "CSV Upload",
                    ],
                  ].map(
                    ([
                      value,
                      label,
                    ]) => (
                      <label
                        key={value}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                        "
                      >
                        <input
                          type="radio"
                          name="numberMode"
                          value={value}
                          checked={
                            form.numberMode ===
                            value
                          }
                          onChange={
                            handleChange
                          }
                          className="
                            h-4
                            w-4
                            text-blue-600
                          "
                        />

                        {label}
                      </label>
                    )
                  )}
                </div>
              </Field>

              {/* CSV */}

              {form.numberMode ===
              "csv" ? (
                <Field
                  label="CSV Upload"
                  required
                >
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(event) =>
                      setForm(
                        (previous) => ({
                          ...previous,
                          csvFile:
                            event.target
                              .files?.[0] ||
                            null,
                        })
                      )
                    }
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      px-4
                      py-3
                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                    "
                  />

                  <p
                    className="
                      mt-2
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    CSV must contain a
                    <strong>
                      {" Number "}
                    </strong>
                    column.
                  </p>
                </Field>
              ) : (
                <>
                  {/* NUMBER */}

                  <Field
                    label={
                      form.numberMode ===
                      "list"
                        ? "Number List"
                        : "First Number"
                    }
                    required
                  >
                    <input
                      name="number"
                      value={form.number}
                      onChange={
                        handleChange
                      }
                      placeholder={
                        form.numberMode ===
                        "list"
                          ? "Enter numbers separated by comma, semicolon or new line"
                          : "Enter Number"
                      }
                      required
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        px-4
                        py-3.5
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500
                        dark:border-slate-700
                        dark:bg-slate-950
                        dark:text-white
                      "
                    />
                  </Field>

                  {/* LENGTH */}

                  {form.numberMode !==
                    "list" && (
                    <Field
                      label="Total Numbers"
                      required={
                        form.numberMode ===
                        "range"
                      }
                    >
                      <input
                        type="number"
                        min="1"
                        step="1"
                        name="length"
                        value={
                          form.length
                        }
                        onChange={
                          handleChange
                        }
                        required={
                          form.numberMode ===
                          "range"
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          px-4
                          py-3.5
                          outline-none
                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-500
                          dark:border-slate-700
                          dark:bg-slate-950
                          dark:text-white
                        "
                      />
                    </Field>
                  )}
                </>
              )}

              {/* DAILY MAX CALL */}

              <Field label="Daily Max Call">
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="dailyMaxCall"
                  value={
                    form.dailyMaxCall
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3.5
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                />
              </Field>

              {/* DAILY MAX DURATION */}

              <Field
                label="Daily Max Duration (Seconds)"
              >
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="dailyMaxDuration"
                  value={
                    form.dailyMaxDuration
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3.5
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                />
              </Field>
            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="space-y-5">
              {/* SERVICE */}

              <Field
                label="Numbers Service"
                required
              >
                <Select
                  name="numberService"
                  value={
                    form.numberService
                  }
                  onChange={
                    handleChange
                  }
                  required
                >
                  <option value="">
                    Select Service
                  </option>

                  {SERVICES.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </Select>
              </Field>

              {/* SERVICE VARIABLES */}

              <Field label="Service Variables">
                <textarea
                  name="serviceVariables"
                  rows={7}
                  value={
                    form.serviceVariables
                  }
                  onChange={
                    handleChange
                  }
                  placeholder='{"key":"value"}'
                  className="
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3.5
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                />
              </Field>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              justify-end
              gap-3
              border-t
              border-slate-200
              px-8
              py-5
              dark:border-slate-800
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                rounded-xl
                px-6
                py-3
                font-medium
                text-slate-700
                hover:bg-slate-100
                dark:text-slate-300
                dark:hover:bg-slate-800
                disabled:opacity-50
              "
            >
              Close
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                rounded-xl
                bg-blue-600
                px-7
                py-3
                font-semibold
                text-white
                hover:bg-blue-700
                disabled:opacity-60
              "
            >
              {saving
                ? "Saving..."
                : number
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================================
// FIELD
// =========================================================

function Field({
  label,
  required,
  children,
}) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-sm
          font-medium
          text-slate-700
          dark:text-slate-300
        "
      >
        {label}

        {required && (
          <span className="text-red-500">
            {" "}*
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

// =========================================================
// SELECT
// =========================================================

function Select({
  children,
  ...props
}) {
  return (
    <div className="relative">
      <select
        {...props}
        className="
          w-full
          appearance-none
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3.5
          pr-10
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500
          dark:border-slate-700
          dark:bg-slate-950
          dark:text-white
        "
      >
        {children}
      </select>

      <ChevronDown
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
        size={17}
      />
    </div>
  );
}