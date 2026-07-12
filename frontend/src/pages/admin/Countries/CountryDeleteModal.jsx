export default function CountryDeleteModal({
  open,
  onClose,
  onConfirm,
  country,
  deleting = false,
}) {

  if (!open || !country) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-4">
          Delete Country
        </h2>

        <p className="text-slate-600 dark:text-slate-300">

          Are you sure you want to delete

          <span className="font-semibold">
            {" "}
            {country.name}
          </span>

          ?

        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2 rounded-lg bg-slate-300 hover:bg-slate-400"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={() => onConfirm(country.id)}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>

  );

}