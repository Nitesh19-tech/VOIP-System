export default function CompanyDeleteModal({
  open,
  onClose,
  onConfirm,
  company,
  deleting = false,
}) {
  if (!open || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 shadow-xl p-6">

        <h2 className="text-2xl font-bold text-red-600">
          Delete Company
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
          Are you sure you want to permanently delete
          <span className="font-semibold text-red-600">
            {" "}
            {company.name}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-slate-500">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2 rounded-lg bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={() => onConfirm(company.id)}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}