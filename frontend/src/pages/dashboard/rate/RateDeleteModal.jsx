export default function RateDeleteModal({
  open,
  onClose,
  onConfirm,
  rate,
  deleting = false,
}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold text-red-600 mb-4">

          Delete Rate

        </h2>

        <p className="text-slate-600 dark:text-slate-300">

          Are you sure you want to delete this rate?

        </p>

        <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 space-y-2">

          <div>

            <strong>Country:</strong>{" "}

            {rate?.country_name}

          </div>

          <div>

            <strong>Destination:</strong>{" "}

            {rate?.destination}

          </div>

          <div>

            <strong>Prefix:</strong>{" "}

            {rate?.prefix}

          </div>

          <div>

            <strong>Provider:</strong>{" "}

            {rate?.provider || "-"}

          </div>

          <div>

            <strong>Sell Rate:</strong>{" "}

            ${Number(
              rate?.sell_rate || 0
            ).toFixed(6)}

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-300 hover:bg-slate-400"
          >

            Cancel

          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >

            {deleting
              ? "Deleting..."
              : "Delete"}

          </button>

        </div>

      </div>

    </div>

  );

}