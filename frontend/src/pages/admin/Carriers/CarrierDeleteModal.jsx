import { AlertTriangle, X } from "lucide-react";

export default function CarrierDeleteModal({
  open,
  carrier,
  deleting,
  onClose,
  onConfirm,
}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="rounded-full bg-red-100 p-2">

              <AlertTriangle
                size={22}
                className="text-red-600"
              />

            </div>

            <h2 className="text-xl font-bold text-red-600">
              Delete Carrier
            </h2>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20}/>
          </button>

        </div>

        {/* Body */}

        <div className="px-6 py-6">

          <p className="text-slate-700 dark:text-slate-300">

            Are you sure you want to delete

            <span className="font-semibold">
              {" "}
              {carrier?.name}
            </span>

            ?

          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">

            This action cannot be undone. All carrier IP mappings
            associated with this carrier may also become unavailable.

          </p>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={() => onConfirm(carrier.id)}
            className="rounded-xl bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>

  );

}