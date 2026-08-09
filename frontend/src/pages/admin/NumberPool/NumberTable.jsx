import {
  Pencil,
  Trash2,
  Phone,
} from "lucide-react";

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

export default function NumberTable({
  numbers,
  loading,
  onEdit,
  onDelete,
  user,
  selectedNumbers,
  setSelectedNumbers,
}) {

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="
        rounded-2xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-slate-900
        p-16
        text-center
      ">

        <Phone
          className="mx-auto mb-4 animate-pulse text-blue-500"
          size={40}
        />

        <h3 className="
          text-xl
          font-semibold
          text-slate-900
          dark:text-white
        ">
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
      <div className="
        rounded-2xl
        border
        border-dashed
        border-slate-300
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        p-16
        text-center
      ">

        <Phone
          className="mx-auto mb-4 text-slate-400"
          size={40}
        />

        <h3 className="
          text-xl
          font-semibold
          text-slate-900
          dark:text-white
        ">
          No Numbers Found
        </h3>

        <p className="
          mt-2
          text-slate-500
          dark:text-slate-400
        ">
          Import numbers or create a new DID.
        </p>

      </div>
    );
  }

  // =====================================================
  // SELECT ALL
  // =====================================================

  const selectableNumbers = numbers.filter(
    (number) =>
      number.status !== "RESERVED"
  );

  const allSelected =
    selectableNumbers.length > 0 &&
    selectableNumbers.every(
      (number) =>
        selectedNumbers.includes(number.id)
    );

  const handleSelectAll = (checked) => {

    if (checked) {

      setSelectedNumbers(
        selectableNumbers.map(
          (number) => number.id
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
      number.status === "RESERVED"
    ) {
      return;
    }

    if (checked) {

      setSelectedNumbers((prev) => {

        if (prev.includes(number.id)) {
          return prev;
        }

        return [
          ...prev,
          number.id,
        ];
      });

    } else {

      setSelectedNumbers((prev) =>
        prev.filter(
          (id) =>
            id !== number.id
        )
      );
    }
  };

  // =====================================================
  // TABLE
  // =====================================================

  return (

    <div className="
      overflow-hidden
      rounded-2xl
      border
      border-slate-200
      dark:border-slate-800
      bg-white
      dark:bg-slate-900
      shadow-sm
    ">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* =================================================
              HEADER
          ================================================= */}

          <thead className="
            sticky
            top-0
            bg-slate-100
            dark:bg-slate-800
          ">

            <tr className="
              text-xs
              uppercase
              tracking-wider
              text-slate-500
            ">

              {/* SELECT */}

              <th className="
                w-12
                px-4
                py-4
                text-center
              ">

                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) =>
                    handleSelectAll(
                      e.target.checked
                    )
                  }
                  disabled={
                    selectableNumbers.length === 0
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

              <th className="
                px-6
                py-4
                text-left
              ">
                Country
              </th>

              {/* DID */}

              <th className="
                px-6
                py-4
                text-left
              ">
                DID Number
              </th>

              {/* EXTENSION */}

              <th className="
                px-6
                py-4
                text-left
              ">
                Extension
              </th>

              {/* ADMIN */}

              {user?.role === "SUPER_ADMIN" && (

                <th className="
                  px-6
                  py-4
                  text-left
                ">
                  Admin
                </th>

              )}

              {/* CLIENT */}

              <th className="
                px-6
                py-4
                text-left
              ">
                Client
              </th>

              {/* CARRIER */}

              <th className="
                px-6
                py-4
                text-left
              ">
                Carrier
              </th>

              {/* TERMINATION */}

              <th className="
                px-6
                py-4
                text-left
              ">
                Termination
              </th>

              {/* PURCHASE */}

              <th className="
                px-6
                py-4
                text-right
              ">
                Purchase
              </th>

              {/* MONTHLY */}

              <th className="
                px-6
                py-4
                text-right
              ">
                Monthly
              </th>

              {/* STATUS */}

              <th className="
                px-6
                py-4
                text-center
              ">
                Status
              </th>

              {/* ACTIONS */}

              <th className="
                px-6
                py-4
                text-center
              ">
                Actions
              </th>

            </tr>

          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody>

            {numbers.map(
              (number, index) => {

                const isSelected =
                  selectedNumbers.includes(
                    number.id
                  );

                const isReserved =
                  number.status === "RESERVED";

                return (

                  <tr
                    key={number.id}
                    className={`
                      transition-all
                      hover:bg-blue-50
                      dark:hover:bg-slate-800

                      ${
                        index % 2 === 0
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

                    <td className="
                      px-4
                      py-4
                      text-center
                    ">

                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isReserved}
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

                    {/* COUNTRY */}

                    <td className="
                      px-6
                      py-4
                      text-slate-700
                      dark:text-slate-300
                    ">
                      {number.country_name || "-"}
                    </td>

                    {/* DID */}

                    <td className="
                      px-6
                      py-4
                      font-bold
                      text-blue-600
                      dark:text-blue-400
                    ">
                      {number.did_number}
                    </td>

                    {/* EXTENSION */}

                    <td className="
                      px-6
                      py-4
                      text-slate-700
                      dark:text-slate-300
                    ">
                      {number.extension || "-"}
                    </td>

                    {/* ADMIN */}

                    {user?.role === "SUPER_ADMIN" && (

                      <td className="
                        px-6
                        py-4
                        text-slate-700
                        dark:text-slate-300
                      ">
                        {number.admin_name || "-"}
                      </td>

                    )}

                    {/* CLIENT */}

                    <td className="
                      px-6
                      py-4
                      text-slate-700
                      dark:text-slate-300
                    ">
                      {number.client_name || "-"}
                    </td>

                    {/* CARRIER */}

                    <td className="
                      px-6
                      py-4
                      text-slate-700
                      dark:text-slate-300
                    ">
                      {number.carrier_name || "-"}
                    </td>

                    {/* TERMINATION */}

                    <td className="
                      px-6
                      py-4
                      text-slate-700
                      dark:text-slate-300
                    ">
                      {number.termination_name || "-"}
                    </td>

                    {/* PURCHASE */}

                    <td className="
                      px-6
                      py-4
                      text-right
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    ">
                      ₹{" "}
                      {Number(
                        number.purchase_price || 0
                      ).toFixed(2)}
                    </td>

                    {/* MONTHLY */}

                    <td className="
                      px-6
                      py-4
                      text-right
                      font-medium
                      text-slate-700
                      dark:text-slate-300
                    ">
                      ₹{" "}
                      {Number(
                        number.monthly_rental || 0
                      ).toFixed(2)}
                    </td>

                    {/* STATUS */}

                    <td className="
                      px-6
                      py-4
                      text-center
                    ">

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
                            "bg-slate-100 text-slate-700"
                          }
                        `}
                      >
                        {number.status}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="
                      px-6
                      py-4
                    ">

                      <div className="
                        flex
                        justify-center
                        gap-2
                      ">

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            onEdit(number)
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

                          <Pencil size={16} />

                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            onDelete(number)
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

                          <Trash2 size={16} />

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