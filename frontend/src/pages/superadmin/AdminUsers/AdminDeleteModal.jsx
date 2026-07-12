export default function AdminDeleteModal({
  open,
  onClose,
  onConfirm,
  user,
  deleting = false,
}) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 shadow-xl p-6">

        <h2 className="text-2xl font-bold text-red-600">
          Delete User
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Are you sure you want to delete
          <span className="font-semibold text-red-600">
            {" "}
            {user.first_name} {user.last_name}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-slate-500">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2 rounded-lg bg-slate-300 dark:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(user.id)}
            disabled={deleting}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}