export default function RouteDeleteModal({
  open,
  route,
  deleting,
  onConfirm,
  onClose,
}) {

  if (!open || !route) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6">

        <h2 className="text-xl font-bold">

          Delete Route

        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300">

          Are you sure you want to delete this route?

        </p>

        <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 p-4">

          <div>

            <strong>Prefix:</strong> {route.prefix}

          </div>

          <div>

            <strong>Priority:</strong> {route.priority}

          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >

            Cancel

          </button>

          <button
            onClick={() => onConfirm(route.id)}
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