import {
  CalendarDays,
  ChevronDown,
  RotateCcw,
  Search,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";


const GROUP_OPTIONS = [
  ["1", "Carrier"],
  ["2", "Cause"],
  ["3", "Number"],
  ["4", "CLI"],
  ["5", "IP"],
  ["6", "Date"],
  ["7", "Hour"],
];


export default function FailedReportsFilters({
  filters,
  setFilters,
  onFilter,
  onReset,
}) {

  const update = (key, value) => {

    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));

  };


  return (
    <div
      className="
        relative
        z-30
        grid
        grid-cols-1
        gap-4
        overflow-visible
        md:grid-cols-2
        xl:grid-cols-4
      "
    >

      {/* =====================================================
          FROM DATE
      ===================================================== */}

      <DateField
        value={filters.from}
        onChange={(value) =>
          update("from", value)
        }
      />


      {/* =====================================================
          TO DATE
      ===================================================== */}

      <DateField
        value={filters.to}
        onChange={(value) =>
          update("to", value)
        }
      />


      {/* =====================================================
          NUMBER
      ===================================================== */}

      <Input
        placeholder="Search Number"
        value={filters.number}
        onChange={(value) =>
          update("number", value)
        }
      />


      {/* =====================================================
          CLI
      ===================================================== */}

      <Input
        placeholder="Search CLI"
        value={filters.cli}
        onChange={(value) =>
          update("cli", value)
        }
      />


      {/* =====================================================
          IP
      ===================================================== */}

      <Input
        placeholder="Search IP"
        value={filters.ip}
        onChange={(value) =>
          update("ip", value)
        }
      />


      {/* =====================================================
          CAUSE
      ===================================================== */}

      <Input
        placeholder="Search Cause"
        value={filters.cause}
        onChange={(value) =>
          update("cause", value)
        }
      />


      {/* =====================================================
          GROUP BY
      ===================================================== */}

      <GroupByDropdown
        value={filters.groupBy || []}
        onChange={(value) =>
          update("groupBy", value)
        }
      />


      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div
        className="
          flex
          items-end
          gap-2
        "
      >

        {/* RESET */}

        <button
          type="button"
          onClick={onReset}
          className="
            inline-flex
            h-11
            flex-1
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-slate-200
            bg-white
            px-4
            text-sm
            font-medium
            text-slate-600
            transition
            hover:bg-slate-50
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-300
            dark:hover:bg-slate-800
          "
        >

          <RotateCcw size={16} />

          Reset

        </button>


        {/* FILTER */}

        <button
          type="button"
          onClick={onFilter}
          className="
            inline-flex
            h-11
            flex-1
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-sky-500
            px-4
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-sky-600
          "
        >

          <Search size={16} />

          Filter

        </button>

      </div>

    </div>
  );
}


/* =========================================================
   GROUP BY DROPDOWN
========================================================= */

function GroupByDropdown({
  value = [],
  onChange,
}) {

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);


  /* =======================================================
     OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {

        setOpen(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  /* =======================================================
     TOGGLE OPTION
  ======================================================= */

  const toggleOption = (optionValue) => {

    const exists =
      value.includes(optionValue);


    if (exists) {

      onChange(
        value.filter(
          (item) =>
            item !== optionValue
        )
      );

    } else {

      onChange([
        ...value,
        optionValue,
      ]);

    }

  };


  /* =======================================================
     SELECTED LABELS
  ======================================================= */

  const selectedLabels =
    GROUP_OPTIONS
      .filter(
        ([optionValue]) =>
          value.includes(optionValue)
      )
      .map(
        ([, label]) => label
      );


  let displayText = "Group By";


  if (selectedLabels.length === 1) {

    displayText =
      selectedLabels[0];

  } else if (selectedLabels.length > 1) {

    displayText =
      `${selectedLabels.length} selected`;

  }


  return (

    <div
      ref={dropdownRef}
      className="
        relative
        z-[100]
        w-full
      "
    >

      {/* ===================================================
          BUTTON
      =================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous
          )
        }
        className="
          relative
          flex
          h-11
          w-full
          items-center
          justify-between
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3
          text-left
          text-sm
          outline-none
          transition
          hover:border-slate-300
          focus:border-sky-400
          dark:border-slate-700
          dark:bg-slate-900
          dark:hover:border-slate-600
        "
      >

        <span
          className={
            selectedLabels.length > 0
              ? "text-slate-700 dark:text-slate-200"
              : "text-slate-400"
          }
        >
          {displayText}
        </span>


        <ChevronDown
          size={16}
          className={`
            text-slate-400
            transition-transform
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />

      </button>


      {/* ===================================================
          DROPDOWN MENU
      =================================================== */}

      {open && (

        <div
          className="
            absolute
            left-0
            right-0
            top-full
            z-[99999]
            mt-2
            rounded-lg
            border
            border-slate-200
            bg-white
            shadow-2xl
            dark:border-slate-700
            dark:bg-slate-900
          "
        >

          {/* OPTIONS */}

          <div
            className="
              max-h-64
              overflow-y-auto
              py-1
            "
          >

            {GROUP_OPTIONS.map(
              ([optionValue, label]) => {

                const checked =
                  value.includes(
                    optionValue
                  );


                return (

                  <button
                    key={optionValue}
                    type="button"
                    onClick={() =>
                      toggleOption(
                        optionValue
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      dark:text-slate-200
                      dark:hover:bg-slate-800
                    "
                  >

                    {/* CHECKBOX */}

                    <span
                      className={`
                        flex
                        h-4
                        w-4
                        shrink-0
                        items-center
                        justify-center
                        rounded
                        border
                        text-xs
                        font-bold
                        ${
                          checked
                            ? "border-sky-500 bg-sky-500 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }
                      `}
                    >

                      {checked
                        ? "✓"
                        : ""}

                    </span>


                    {/* LABEL */}

                    <span>
                      {label}
                    </span>

                  </button>

                );

              }
            )}

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-slate-200
              px-3
              py-2
              dark:border-slate-700
            "
          >

            <span
              className="
                text-xs
                text-slate-400
              "
            >
              {selectedLabels.length} selected
            </span>


            {selectedLabels.length > 0 && (

              <button
                type="button"
                onClick={() =>
                  onChange([])
                }
                className="
                  text-xs
                  font-medium
                  text-sky-500
                  hover:text-sky-600
                "
              >
                Clear
              </button>

            )}

          </div>

        </div>

      )}

    </div>

  );
}


/* =========================================================
   TEXT INPUT
========================================================= */

function Input({
  placeholder,
  value,
  onChange,
}) {

  return (

    <input
      type="text"
      value={value || ""}
      placeholder={placeholder}
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
        px-3
        text-sm
        text-slate-700
        outline-none
        placeholder:text-slate-400
        focus:border-sky-400
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-200
      "
    />

  );

}


/* =========================================================
   DATE FIELD
========================================================= */

function DateField({
  value,
  onChange,
}) {

  return (

    <div
      className="
        relative
        z-10
        w-full
      "
    >

      <CalendarDays
        size={16}
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          z-10
          -translate-y-1/2
          text-slate-400
        "
      />


      <input
        type="datetime-local"
        value={value || ""}
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
          dark:border-slate-700
          dark:bg-slate-900
          dark:text-slate-200
        "
      />

    </div>

  );

}