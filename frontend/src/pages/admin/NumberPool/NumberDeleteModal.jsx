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

        {/* Header */}

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
                className="text-red-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Delete DID Number
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This action is permanent.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            disabled={deleting}
            className="
              h-10
              w-10

              rounded-xl

              hover:bg-slate-100
              dark:hover:bg-slate-800

              transition
            "
          >

            <X size={20} />

          </button>

        </div>

        {/* Body */}

        <div className="space-y-5 p-8">

          <p className="text-slate-600 dark:text-slate-300">

            Are you sure you want to permanently delete this DID number?

          </p>

          <div
            className="
              rounded-2xl

              border
              border-slate-200
              dark:border-slate-700

              bg-slate-50
              dark:bg-slate-800

              p-5

              space-y-3
            "
          >

            {/* DID NUMBER */}

            <div className="flex justify-between">

              <span className="font-medium text-slate-500">
                DID Number
              </span>

              <span className="font-semibold">
                {number.did_number}
              </span>

            </div>

            {/* COUNTRY */}

            <div className="flex justify-between">

              <span className="font-medium text-slate-500">
                Country
              </span>

              <span>
                {number.country_name || "-"}
              </span>

            </div>

            {/* CARRIER */}

            <div className="flex justify-between">

              <span className="font-medium text-slate-500">
                Carrier
              </span>

              <span>
                {number.carrier_name || "-"}
              </span>

            </div>

            {/* TERMINATION */}

            <div className="flex justify-between">

              <span className="font-medium text-slate-500">
                Termination
              </span>

              <span>
                {number.termination_name || "-"}
              </span>

            </div>

            {/* CLIENT */}

            <div className="flex justify-between">

              <span className="font-medium text-slate-500">
                Client
              </span>

              <span>
                {number.client_name || "-"}
              </span>

            </div>

          </div>

          <div
            className="
              rounded-xl

              border
              border-red-200
              dark:border-red-500/30

              bg-red-50
              dark:bg-red-500/10

              p-4
            "
          >

            <p className="text-sm text-red-600 dark:text-red-400">

              ⚠ This operation cannot be undone. The DID will be permanently removed.

            </p>

          </div>

        </div>

        {/* Footer */}

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

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="
              rounded-xl

              border
              border-slate-300
              dark:border-slate-700

              px-6
              py-3

              hover:bg-slate-100
              dark:hover:bg-slate-800

              transition
            "
          >

            Cancel

          </button>

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

              hover:bg-red-700

              shadow-lg

              transition

              disabled:opacity-50
            "
          >

            <Trash2 size={18} />

            {deleting
              ? "Deleting..."
              : "Delete Number"}

          </button>

        </div>

      </div>

    </div>

  );

}