import {
  AlertTriangle,
  X,
  Trash2,
} from "lucide-react";

export default function NumberDeleteModal({
  open,
  onClose,
  onConfirm,
  number,
  deleting = false,
}) {
  if (!open || !number) return null;

  const isAssigned =
    String(number.status || "").toUpperCase() === "ASSIGNED";

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
          max-w-lg
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          dark:border-slate-800
          bg-white
          dark:bg-slate-900
          shadow-2xl
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            dark:border-slate-800
            px-8
            py-6
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-red-100
                dark:bg-red-500/20
              "
            >
              <AlertTriangle
                size={28}
                className="text-red-600 dark:text-red-400"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Delete DID Number
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This action is permanent.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-900
              dark:hover:bg-slate-800
              dark:hover:text-white
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className="space-y-5 p-8">
          <p className="text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete this DID number?
          </p>

          {/* =====================================================
              NUMBER DETAILS
          ===================================================== */}

          <div
            className="
              space-y-3
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-5
              dark:border-slate-700
              dark:bg-slate-800
            "
          >
            {/* DID NUMBER */}

            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                DID Number
              </span>

              <span className="break-all text-right font-semibold text-slate-900 dark:text-white">
                {number.did_number || number.number || "-"}
              </span>
            </div>

            {/* COUNTRY */}

            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Country
              </span>

              <span className="text-right text-slate-700 dark:text-slate-200">
                {number.country_name || "-"}
              </span>
            </div>

            {/* CARRIER */}

            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Carrier
              </span>

              <span className="text-right text-slate-700 dark:text-slate-200">
                {number.carrier_name || "-"}
              </span>
            </div>

            {/* TERMINATION */}

            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Termination
              </span>

              <span className="text-right text-slate-700 dark:text-slate-200">
                {number.termination_name || "-"}
              </span>
            </div>

            {/* CLIENT */}

            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Client
              </span>

              <span className="text-right text-slate-700 dark:text-slate-200">
                {number.client_name || "-"}
              </span>
            </div>

            {/* STATUS */}

            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Status
              </span>

              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${
                    isAssigned
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  }
                `}
              >
                {number.status || "-"}
              </span>
            </div>
          </div>

          {/* =====================================================
              ASSIGNED WARNING
          ===================================================== */}

          {isAssigned && (
            <div
              className="
                rounded-xl
                border
                border-amber-200
                bg-amber-50
                p-4
                dark:border-amber-500/30
                dark:bg-amber-500/10
              "
            >
              <div className="flex gap-3">
                <AlertTriangle
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-amber-600
                    dark:text-amber-400
                  "
                />

                <p className="text-sm leading-6 text-amber-700 dark:text-amber-400">
                  This number is currently assigned to a carrier/termination.
                  Deleting it will permanently remove the DID from the Number
                  Pool.
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              PERMANENT DELETE WARNING
          ===================================================== */}

          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              p-4
              dark:border-red-500/30
              dark:bg-red-500/10
            "
          >
            <div className="flex gap-3">
              <AlertTriangle
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-red-600
                  dark:text-red-400
                "
              />

              <p className="text-sm leading-6 text-red-600 dark:text-red-400">
                This operation cannot be undone. The DID will be permanently
                removed.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            dark:border-slate-800
            px-8
            py-6
          "
        >
          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="
              rounded-xl
              border
              border-slate-300
              px-6
              py-3
              text-slate-700
              hover:bg-slate-100
              dark:border-slate-700
              dark:text-slate-200
              dark:hover:bg-slate-800
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() => onConfirm(number.id)}
            disabled={deleting}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-600
              px-6
              py-3
              font-medium
              text-white
              shadow-lg
              hover:bg-red-700
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Trash2 size={18} />

            {deleting ? "Deleting..." : "Delete Number"}
          </button>
        </div>
      </div>
    </div>
  );
}