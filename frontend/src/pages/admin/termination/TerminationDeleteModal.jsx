import { AlertTriangle, Trash2, X } from "lucide-react";

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Delete Termination
              </h2>

              <p className="text-sm text-slate-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-slate-300">
              Are you sure you want to permanently delete this termination?
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4 space-y-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Name
              </span>

              <p className="font-semibold text-white">
                {termination.name}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Carrier
              </span>

              <p className="text-slate-300">
                {termination.carrier_name}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Prefix
              </span>

              <p className="text-slate-300">
                {termination.prefix}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-800 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={() => onConfirm(termination.id)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />

            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}