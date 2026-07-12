export default function DeleteTrunkModal({
  open,
  onClose,
  onConfirm,
  trunk,
}) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-xl font-bold text-red-600 mb-4">

          Delete Trunk

        </h2>

        <p className="text-slate-600 dark:text-slate-300">

          Are you sure you want to delete

          <strong>

            {" "}
            {trunk?.provider_name}
            {" "}

          </strong>

          ?

        </p>

        <p className="text-sm text-red-500 mt-3">

          This action cannot be undone.

        </p>

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
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >

            Delete

          </button>

        </div>

      </div>

    </div>

  );

}