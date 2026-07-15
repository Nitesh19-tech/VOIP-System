export default function NumberDeleteModal({
  open,
  onClose,
  onConfirm,
  number,
  deleting = false,
}) {

  if (!open || !number) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">

        {/* Header */}

        <h2 className="text-2xl font-bold text-red-600">

          Delete Number

        </h2>

        {/* Body */}

        <div className="mt-5 space-y-2">

          <p className="text-slate-600 dark:text-slate-300">

            Are you sure you want to delete this DID number?

          </p>

          <div className="rounded-lg border bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">

            <p>
              <span className="font-semibold">
                DID :
              </span>{" "}
              {number.did_number}
            </p>

            <p>
              <span className="font-semibold">
                Extension :
              </span>{" "}
              {number.extension}
            </p>

            <p>
              <span className="font-semibold">
                Country :
              </span>{" "}
              {number.country_name || "-"}
            </p>

            <p>
              <span className="font-semibold">
                Carrier :
              </span>{" "}
              {number.carrier_name || "-"}
            </p>

            <p>
              <span className="font-semibold">
                Termination :
              </span>{" "}
              {number.termination_name || "-"}
            </p>

            <p>
              <span className="font-semibold">
                Client :
              </span>{" "}
              {number.client_name || "-"}
            </p>

          </div>

          <p className="text-sm text-red-500">

            This action cannot be undone.

          </p>

        </div>

        {/* Footer */}

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg bg-slate-300 px-5 py-2 dark:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(number.id)}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>

  );

}