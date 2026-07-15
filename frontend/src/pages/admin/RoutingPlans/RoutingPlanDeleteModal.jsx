export default function RoutingPlanDeleteModal({

  open,

  plan,

  deleting,

  onClose,

  onConfirm,

}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-5">

          <h2 className="text-xl font-semibold text-red-600">

            Delete Routing Plan

          </h2>

        </div>

        {/* Body */}

        <div className="p-6">

          <p className="text-slate-700 dark:text-slate-300">

            Are you sure you want to delete

            <strong> {plan?.name}</strong> ?

          </p>

          <p className="mt-3 text-sm text-slate-500">

            This action cannot be undone.

          </p>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-6 py-4">

          <button

            onClick={onClose}

            className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"

          >

            Cancel

          </button>

          <button

            onClick={() => onConfirm(plan.id)}

            disabled={deleting}

            className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"

          >

            {deleting ? "Deleting..." : "Delete"}

          </button>

        </div>

      </div>

    </div>

  );

}