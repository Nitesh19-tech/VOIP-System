import {
  Pencil,
  Trash2,
  Phone,
} from "lucide-react";


// =====================================================
// STATUS COLORS
// =====================================================

const statusClasses = {
  AVAILABLE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",

  ASSIGNED:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",

  RESERVED:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",

  DISABLED:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};


// =====================================================
// NUMBER TYPE
// =====================================================

const numberTypeClasses = {
  TEST:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",

  GENERAL:
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};


// =====================================================
// NUMBER MODE LABEL
// =====================================================

const numberModeLabels = {
  SINGLE: "Single",
  RANGE: "Range",
  LIST: "List",
  CSV: "CSV",
};


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function NumberTable({
  numbers = [],
  loading = false,
  onEdit,
  onDelete,
  user,
  selectedNumbers = [],
  setSelectedNumbers,
}) {

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-16
          text-center
          dark:border-slate-800
          dark:bg-slate-900
        "
      >

        <Phone
          className="
            mx-auto
            mb-4
            animate-pulse
            text-blue-500
          "
          size={40}
        />

        <h3
          className="
            text-xl
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Loading Numbers...
        </h3>

      </div>
    );
  }


  // =====================================================
  // EMPTY
  // =====================================================

  if (!numbers.length) {

    return (
      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-white
          p-16
          text-center
          dark:border-slate-700
          dark:bg-slate-900
        "
      >

        <Phone
          className="
            mx-auto
            mb-4
            text-slate-400
          "
          size={40}
        />

        <h3
          className="
            text-xl
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          No Numbers Found
        </h3>

        <p
          className="
            mt-2
            text-slate-500
            dark:text-slate-400
          "
        >
          Import numbers or create a new DID.
        </p>

      </div>
    );
  }


  // =====================================================
  // SELECTABLE NUMBERS
  // RESERVED NUMBERS CANNOT BE SELECTED
  // =====================================================

  const selectableNumbers =
    numbers.filter(
      (number) =>
        number.status !== "RESERVED"
    );


  // =====================================================
  // SELECT ALL
  // =====================================================

  const allSelected =
    selectableNumbers.length > 0 &&
    selectableNumbers.every(
      (number) =>
        selectedNumbers.includes(
          number.id
        )
    );


  // =====================================================
  // SELECT ALL HANDLER
  // =====================================================

  const handleSelectAll = (
    checked
  ) => {

    if (checked) {

      setSelectedNumbers(
        selectableNumbers.map(
          (number) =>
            number.id
        )
      );

    } else {

      setSelectedNumbers([]);

    }
  };


  // =====================================================
  // SELECT SINGLE
  // =====================================================

  const handleSelect = (
    number,
    checked
  ) => {

    if (
      number.status ===
      "RESERVED"
    ) {

      return;
    }


    if (checked) {

      setSelectedNumbers(
        (previous) => {

          if (
            previous.includes(
              number.id
            )
          ) {

            return previous;
          }


          return [
            ...previous,
            number.id,
          ];
        }
      );

    } else {

      setSelectedNumbers(
        (previous) =>
          previous.filter(
            (id) =>
              id !== number.id
          )
      );

    }
  };


  // =====================================================
  // GET NUMBER TYPE
  // =====================================================

  const getNumberType = (
    number
  ) => {

    if (
      number.number_type
    ) {

      return String(
        number.number_type
      ).toUpperCase();

    }


    if (
      number.is_test_number
    ) {

      return "TEST";

    }


    return "GENERAL";
  };


  // =====================================================
  // GET NUMBER MODE
  // =====================================================

  const getNumberMode = (
    number
  ) => {

    const mode =
      String(
        number.number_mode ||
        "SINGLE"
      ).toUpperCase();


    return (
      numberModeLabels[mode] ||
      mode
    );
  };


  // =====================================================
  // GET DID
  // =====================================================

  const getDidNumber = (
    number
  ) => {

    return (
      number.did_number ||
      number.number ||
      "-"
    );
  };


  // =====================================================
  // GET CLIENT
  // =====================================================

  const getClient = (
    number
  ) => {

    return (
      number.client_name ||
      "-"
    );
  };


  // =====================================================
  // GET CARRIER
  // =====================================================

  const getCarrier = (
    number
  ) => {

    return (
      number.carrier_name ||
      "-"
    );
  };


  // =====================================================
  // GET TERMINATION
  // =====================================================

  const getTermination = (
    number
  ) => {

    return (
      number.termination_name ||
      "-"
    );
  };


  // =====================================================
  // GET COUNTRY
  // =====================================================

  const getCountry = (
    number
  ) => {

    return (
      number.country_name ||
      number.country?.name ||
      "-"
    );
  };


  // =====================================================
  // TABLE
  // =====================================================

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >

      <div className="overflow-x-auto">

        <table
          className="
            min-w-[1500px]
            w-full
          "
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <thead
            className="
              sticky
              top-0
              z-10
              bg-slate-100
              dark:bg-slate-800
            "
          >

            <tr
              className="
                text-xs
                uppercase
                tracking-wider
                text-slate-500
              "
            >

              {/* SELECT */}

              <th
                className="
                  w-12
                  px-4
                  py-4
                  text-center
                "
              >

                <input
                  type="checkbox"
                  checked={
                    allSelected
                  }
                  onChange={(e) =>
                    handleSelectAll(
                      e.target.checked
                    )
                  }
                  disabled={
                    selectableNumbers.length ===
                    0
                  }
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                  "
                />

              </th>


              {/* COUNTRY */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                "
              >
                Country
              </th>


              {/* DID */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                "
              >
                DID Number
              </th>


              {/* ADMIN */}

              {user?.role ===
                "SUPER_ADMIN" && (

                <th
                  className="
                    px-6
                    py-4
                    text-left
                  "
                >
                  Admin
                </th>

              )}


              {/* CLIENT */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                "
              >
                Client
              </th>


              {/* CARRIER */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                "
              >
                Carrier
              </th>


              {/* TERMINATION */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                "
              >
                Termination
              </th>


              {/* NUMBER TYPE */}

              <th
                className="
                  px-6
                  py-4
                  text-center
                "
              >
                Type
              </th>


              {/* NUMBER MODE */}

              <th
                className="
                  px-6
                  py-4
                  text-center
                "
              >
                Mode
              </th>


              {/* MAX CALL */}

              <th
                className="
                  px-6
                  py-4
                  text-right
                "
              >
                Max Call
              </th>


              {/* MAX DURATION */}

              <th
                className="
                  px-6
                  py-4
                  text-right
                "
              >
                Max Duration
              </th>


              {/* SERVICE */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                "
              >
                Service
              </th>


              {/* PURCHASE */}

              <th
                className="
                  px-6
                  py-4
                  text-right
                "
              >
                Purchase
              </th>


              {/* MONTHLY */}

              <th
                className="
                  px-6
                  py-4
                  text-right
                "
              >
                Monthly
              </th>


              {/* STATUS */}

              <th
                className="
                  px-6
                  py-4
                  text-center
                "
              >
                Status
              </th>


              {/* ACTIONS */}

              <th
                className="
                  px-6
                  py-4
                  text-center
                "
              >
                Actions
              </th>

            </tr>

          </thead>


          {/* =================================================
              BODY
          ================================================= */}

          <tbody>

            {numbers.map(
              (
                number,
                index
              ) => {

                const isSelected =
                  selectedNumbers.includes(
                    number.id
                  );


                const isReserved =
                  number.status ===
                  "RESERVED";


                const numberType =
                  getNumberType(
                    number
                  );


                const numberMode =
                  getNumberMode(
                    number
                  );


                const service =
                  number.number_service ||
                  "-";


                return (

                  <tr
                    key={
                      number.id
                    }
                    className={`
                      transition-all
                      hover:bg-blue-50
                      dark:hover:bg-slate-800

                      ${
                        index %
                          2 ===
                        0
                          ? "bg-white dark:bg-slate-900"
                          : "bg-slate-50 dark:bg-slate-950"
                      }

                      ${
                        isSelected
                          ? "ring-1 ring-inset ring-blue-400 dark:ring-blue-500"
                          : ""
                      }
                    `}
                  >

                    {/* =================================================
                        CHECKBOX
                    ================================================= */}

                    <td
                      className="
                        px-4
                        py-4
                        text-center
                      "
                    >

                      <input
                        type="checkbox"
                        checked={
                          isSelected
                        }
                        disabled={
                          isReserved
                        }
                        onChange={(e) =>
                          handleSelect(
                            number,
                            e.target.checked
                          )
                        }
                        className={`
                          h-4
                          w-4
                          rounded

                          ${
                            isReserved
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }
                        `}
                      />

                    </td>


                    {/* =================================================
                        COUNTRY
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {getCountry(
                        number
                      )}
                    </td>


                    {/* =================================================
                        DID
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        font-bold
                        text-blue-600
                        dark:text-blue-400
                      "
                    >
                      {getDidNumber(
                        number
                      )}
                    </td>


                    {/* =================================================
                        ADMIN
                    ================================================= */}

                    {user?.role ===
                      "SUPER_ADMIN" && (

                      <td
                        className="
                          px-6
                          py-4
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        {
                          number.admin_name ||
                          "-"
                        }
                      </td>

                    )}


                    {/* =================================================
                        CLIENT
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {getClient(
                        number
                      )}
                    </td>


                    {/* =================================================
                        CARRIER
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {getCarrier(
                        number
                      )}
                    </td>


                    {/* =================================================
                        TERMINATION
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {getTermination(
                        number
                      )}
                    </td>


                    {/* =================================================
                        NUMBER TYPE
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-center
                      "
                    >

                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-bold

                          ${
                            numberTypeClasses[
                              numberType
                            ] ||
                            numberTypeClasses.GENERAL
                          }
                        `}
                      >
                        {numberType}
                      </span>

                    </td>


                    {/* =================================================
                        NUMBER MODE
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-center
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {numberMode}
                    </td>


                    {/* =================================================
                        MAX CALL
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-right
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {
                        Number(
                          number.daily_max_call ||
                          0
                        )
                      }
                    </td>


                    {/* =================================================
                        MAX DURATION
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-right
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >

                      {
                        Number(
                          number.daily_max_duration ||
                          0
                        )
                      }

                      <span
                        className="
                          ml-1
                          text-xs
                          text-slate-400
                        "
                      >
                        sec
                      </span>

                    </td>


                    {/* =================================================
                        SERVICE
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {service}
                    </td>


                    {/* =================================================
                        PURCHASE
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-right
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >

                      ₹{" "}

                      {Number(
                        number.purchase_price ||
                        0
                      ).toFixed(2)}

                    </td>


                    {/* =================================================
                        MONTHLY
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-right
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >

                      ₹{" "}

                      {Number(
                        number.monthly_rental ||
                        0
                      ).toFixed(2)}

                    </td>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                        text-center
                      "
                    >

                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-bold

                          ${
                            statusClasses[
                              number.status
                            ] ||
                            "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }
                        `}
                      >
                        {number.status ||
                          "-"}
                      </span>

                    </td>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <td
                      className="
                        px-6
                        py-4
                      "
                    >

                      <div
                        className="
                          flex
                          justify-center
                          gap-2
                        "
                      >

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              number
                            )
                          }
                          title="Edit Number"
                          className="
                            rounded-xl
                            bg-amber-500
                            p-2.5
                            text-white
                            transition
                            hover:scale-105
                            hover:bg-amber-600
                          "
                        >

                          <Pencil
                            size={16}
                          />

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              number
                            )
                          }
                          title="Delete Number"
                          className="
                            rounded-xl
                            bg-red-600
                            p-2.5
                            text-white
                            transition
                            hover:scale-105
                            hover:bg-red-700
                          "
                        >

                          <Trash2
                            size={16}
                          />

                        </button>

                      </div>

                    </td>

                  </tr>

                );
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}