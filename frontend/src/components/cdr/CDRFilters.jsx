import {
  CalendarDays,
  ChevronDown,
  RotateCcw,
  Search,
  X,
} from "lucide-react";


const INITIAL_FILTERS = {
  from: "",
  to: "",
  carrier: "",
  termination: "",
  number: "",
  manager: "",
  client: "",
  cli: "",
  group_by: "",
  search: "",
  status: "",
};


export default function CDRFilters({
  filters,
  setFilters,
  onRefresh,
  onReset,
}) {

  const update = (
    key,
    value
  ) => {

    setFilters(
      (previous) => ({
        ...previous,
        [key]: value,
      })
    );

  };


  const reset = () => {

    if (onReset) {

      onReset();

    } else {

      setFilters(
        INITIAL_FILTERS
      );

    }

  };


  return (

    <div className="w-full">

      <div className="
        grid
        grid-cols-1
        gap-4
        md:grid-cols-2
        xl:grid-cols-5
      ">

        <DateField
          label="Date From"
          value={filters.from}
          onChange={(value) =>
            update("from", value)
          }
        />

        <DateField
          label="Date To"
          value={filters.to}
          onChange={(value) =>
            update("to", value)
          }
        />

        <InputField
          label="Carrier"
          placeholder="Filter Carrier"
          value={filters.carrier}
          onChange={(value) =>
            update("carrier", value)
          }
        />

        <InputField
          label="Termination"
          placeholder="Filter Termination"
          value={filters.termination}
          onChange={(value) =>
            update(
              "termination",
              value
            )
          }
        />

        <InputField
          label="Number"
          placeholder="Search Number"
          value={filters.number}
          onChange={(value) =>
            update("number", value)
          }
          icon={Search}
        />

        <InputField
          label="Manager"
          placeholder="Select Manager"
          value={filters.manager}
          onChange={(value) =>
            update("manager", value)
          }
        />

        <InputField
          label="Client"
          placeholder="Filter Client"
          value={filters.client}
          onChange={(value) =>
            update("client", value)
          }
        />

        <InputField
          label="CLI"
          placeholder="Search CLI"
          value={filters.cli}
          onChange={(value) =>
            update("cli", value)
          }
          icon={Search}
        />

        <SelectField
          label="Group By"
          value={filters.group_by}
          onChange={(value) =>
            update(
              "group_by",
              value
            )
          }
          options={[
            ["", "Group By"],
            ["carrier", "Carrier"],
            ["termination", "Termination"],
            ["client", "Client"],
            ["number", "Number"],
            ["date", "Date"],
          ]}
        />


        <SelectField
          label="Disposition"
          value={filters.status}
          onChange={(value) =>
            update(
              "status",
              value
            )
          }
          options={[
            ["", "All Status"],
            ["ANSWERED", "ANSWERED"],
            ["BUSY", "BUSY"],
            ["FAILED", "FAILED"],
            ["NO ANSWER", "NO ANSWER"],
          ]}
        />

      </div>


      <div className="
        mt-5
        flex
        flex-col
        gap-3
        border-t
        border-slate-100
        pt-4
        sm:flex-row
        sm:items-center
        sm:justify-end
        dark:border-slate-800
      ">

        <button
          type="button"
          onClick={reset}
          className="
            inline-flex
            h-10
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-slate-200
            bg-white
            px-5
            text-sm
            font-medium
            text-slate-600
            hover:bg-slate-50
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300
          "
        >

          <RotateCcw
            size={16}
          />

          Reset

        </button>


        <button
          type="button"
          onClick={onRefresh}
          className="
            inline-flex
            h-10
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-sky-500
            px-6
            text-sm
            font-semibold
            text-white
            shadow-sm
            hover:bg-sky-600
          "
        >

          <Search
            size={16}
          />

          Filter

        </button>

      </div>

    </div>

  );

}


// =========================================================
// INPUT
// =========================================================

function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
}) {

  return (

    <div>

      <label className="
        mb-1.5
        block
        text-xs
        font-medium
        text-slate-500
        dark:text-slate-400
      ">

        {label}

      </label>

      <div className="relative">

        {Icon && (

          <Icon
            size={16}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

        )}

        <input
          type="text"
          value={value || ""}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className={`
            h-11
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            ${Icon ? "pl-9" : "px-3"}
            pr-9
            text-sm
            text-slate-700
            outline-none
            placeholder:text-slate-400
            focus:border-sky-400
            focus:ring-2
            focus:ring-sky-400/10
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-100
          `}
        />

        {value && (

          <button
            type="button"
            onClick={() =>
              onChange("")
            }
            className="
              absolute
              right-2
              top-1/2
              flex
              h-7
              w-7
              -translate-y-1/2
              items-center
              justify-center
              rounded
              text-slate-400
              hover:bg-slate-100
              dark:hover:bg-slate-800
            "
          >

            <X
              size={14}
            />

          </button>

        )}

      </div>

    </div>

  );

}


// =========================================================
// DATE
// =========================================================

function DateField({
  label,
  value,
  onChange,
}) {

  return (

    <div>

      <label className="
        mb-1.5
        block
        text-xs
        font-medium
        text-slate-500
        dark:text-slate-400
      ">

        {label}

      </label>

      <div className="relative">

        <CalendarDays
          size={16}
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="datetime-local"
          value={
            value || ""
          }
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="
            h-11
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            pl-9
            pr-3
            text-sm
            text-slate-700
            outline-none
            focus:border-sky-400
            focus:ring-2
            focus:ring-sky-400/10
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-100
          "
        />

      </div>

    </div>

  );

}


// =========================================================
// SELECT
// =========================================================

function SelectField({
  label,
  value,
  onChange,
  options,
}) {

  return (

    <div>

      <label className="
        mb-1.5
        block
        text-xs
        font-medium
        text-slate-500
        dark:text-slate-400
      ">

        {label}

      </label>

      <div className="relative">

        <select
          value={value || ""}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="
            h-11
            w-full
            appearance-none
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            pr-9
            text-sm
            text-slate-700
            outline-none
            focus:border-sky-400
            focus:ring-2
            focus:ring-sky-400/10
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-100
          "
        >

          {options.map(
            ([value, label]) => (

              <option
                key={value}
                value={value}
              >

                {label}

              </option>

            )
          )}

        </select>

        <ChevronDown
          size={16}
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

      </div>

    </div>

  );

}