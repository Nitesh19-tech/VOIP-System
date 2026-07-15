export default function TerminationDeleteModal({
  open,
  termination,
  deleting,
  onConfirm,
  onClose,
}) {

  if (!open || !termination) return null;

  return (

    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >

      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}

        <div className="border-b px-6 py-4">

          <h2 className="text-xl font-bold text-red-600">

            Delete Termination

          </h2>

        </div>

        {/* Body */}

        <div className="px-6 py-6">

          <p className="text-gray-700">

            Are you sure you want to delete

          </p>

          <p className="mt-2 text-lg font-semibold text-gray-900">

            {termination.name}

          </p>

          <p className="mt-1 text-sm text-gray-500">

            Carrier : {termination.carrier_name}

          </p>

          <p className="mt-1 text-sm text-gray-500">

            Prefix : {termination.prefix}

          </p>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={() => onConfirm(termination.id)}
            className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>

  );

}