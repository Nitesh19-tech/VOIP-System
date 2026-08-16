import { AlertTriangle, X } from "lucide-react";

export default function IncomingRouteDeleteModal({
  open,
  route,
  deleting,
  onConfirm,
  onClose,
}) {
  if (!open || !route) {
    return null;
  }

  const handleClose = () => {
    if (deleting) return;

    onClose();
  };

  const handleConfirm = () => {
    if (deleting) return;

    onConfirm(route.id);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
      onClick={handleClose}
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* =====================================================
            Header
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            px-6
            py-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
              "
            >
              <AlertTriangle
                size={22}
                className="text-red-400"
              />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-bold
                  text-white
                "
              >
                Delete Incoming Route
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
              disabled:opacity-50
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =====================================================
            Body
        ===================================================== */}

        <div className="px-6 py-6">

          <p
            className="
              text-sm
              leading-6
              text-slate-300
            "
          >
            Are you sure you want to delete the
            following incoming route?
          </p>

          {/* Route Information */}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-4
            "
          >

            {/* DID */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-slate-800
                pb-3
              "
            >

              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                DID
              </span>

              <span
                className="
                  font-semibold
                  text-white
                "
              >
                {route.did || "—"}
              </span>

            </div>

            {/* Forward Number */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-slate-800
                py-3
              "
            >

              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                Forward Number
              </span>

              <span
                className="
                  max-w-[220px]
                  truncate
                  text-right
                  font-medium
                  text-slate-200
                "
                title={route.forward_number}
              >
                {route.forward_number || "—"}
              </span>

            </div>

            {/* Termination */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                pt-3
              "
            >

              <span
                className="
                  text-sm
                  text-slate-500
                "
              >
                Termination
              </span>

              <span
                className="
                  max-w-[220px]
                  truncate
                  text-right
                  font-medium
                  text-slate-200
                "
                title={
                  route.termination_name || ""
                }
              >
                {route.termination_name ||
                  (route.termination
                    ? `#${route.termination}`
                    : "—")}
              </span>

            </div>

          </div>

          {/* Warning */}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-red-500/20
              bg-red-500/10
              px-4
              py-3
            "
          >
            <p
              className="
                text-sm
                leading-5
                text-red-300
              "
            >
              Deleting this route will remove it
              from the incoming route configuration.
              You will need to apply the changes to
              update Asterisk.
            </p>
          </div>

        </div>

        {/* =====================================================
            Footer
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
            border-t
            border-slate-800
            px-6
            py-5
          "
        >

          <button
            type="button"
            onClick={handleClose}
            disabled={deleting}
            className="
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-2.5
              font-medium
              text-slate-200
              transition
              hover:bg-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="
              inline-flex
              min-w-[120px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {deleting ? (
              <>
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                  "
                />

                Deleting...
              </>
            ) : (
              "Delete Route"
            )}
          </button>

        </div>

      </div>
    </div>
  );
}