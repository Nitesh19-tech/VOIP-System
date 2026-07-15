export default function CarrierDeleteModal({

  open,

  carrier,

  deleting,

  onClose,

  onConfirm,

}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        <div className="px-6 py-5 border-b">

          <h2 className="text-xl font-semibold text-red-600">

            Delete Carrier

          </h2>

        </div>

        <div className="p-6">

          <p className="text-slate-700">

            Are you sure you want to delete

            <strong> {carrier?.name}</strong> ?

          </p>

          <p className="mt-3 text-sm text-slate-500">

            This action cannot be undone.

          </p>

        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t">

          <button

            onClick={onClose}

            className="px-5 py-2 rounded-xl border"

          >

            Cancel

          </button>

          <button

            onClick={() => onConfirm(carrier.id)}

            disabled={deleting}

            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"

          >

            {deleting ? "Deleting..." : "Delete"}

          </button>

        </div>

      </div>

    </div>

  );

}