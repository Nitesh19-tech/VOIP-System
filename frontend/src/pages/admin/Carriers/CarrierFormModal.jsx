import { useEffect, useState } from "react";

export default function CarrierFormModal({
  open,
  onClose,
  onSave,
  carrier,
  saving,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (carrier) {
      setForm({
        name: carrier.name || "",
        description: carrier.description || "",
        is_active:
          carrier.is_active === undefined
            ? true
            : carrier.is_active,
      });
    } else {
      setForm({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [carrier, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2
            style={{
              color: "#111827",
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            {carrier ? "Edit Carrier" : "Add Carrier"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: "24px",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">

          <div className="mb-5">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Carrier Name
            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                padding: "12px",
                borderRadius: "8px",
                color: "#111827",
                background: "#ffffff",
              }}
              placeholder="Carrier Name"
            />
          </div>

          <div className="mb-5">
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#111827",
                fontWeight: "600",
              }}
            >
              Description
            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                padding: "12px",
                borderRadius: "8px",
                color: "#111827",
                background: "#ffffff",
              }}
              placeholder="Description"
            />
          </div>

          <div className="mb-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active: e.target.checked,
                })
              }
            />

            <span
              style={{
                color: "#111827",
                fontWeight: "500",
              }}
            >
              Active
            </span>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}