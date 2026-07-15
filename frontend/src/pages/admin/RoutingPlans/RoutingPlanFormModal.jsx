import { useEffect, useState } from "react";

export default function RoutingPlanFormModal({
  open,
  onClose,
  onSave,
  plan,
  saving,
}) {

  const [form, setForm] = useState({
    name: "",
    description: "",
    is_default: false,
    is_active: true,
  });

  useEffect(() => {

    if (plan) {

      setForm({
        name: plan.name || "",
        description: plan.description || "",
        is_default: plan.is_default,
        is_active: plan.is_active,
      });

    } else {

      setForm({
        name: "",
        description: "",
        is_default: false,
        is_active: true,
      });

    }

  }, [plan]);

  if (!open) return null;

  const handleSubmit = (e) => {

    e.preventDefault();

    onSave(form);

  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">

          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">

            {plan ? "Edit Routing Plan" : "Add Routing Plan"}

          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-red-600"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* Name */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">

              Routing Plan Name

            </label>

            <input
              type="text"
              required
              value={form.name}
              onChange={(e)=>
                setForm({
                  ...form,
                  name:e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Enter Routing Plan Name"
            />

          </div>

          {/* Description */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">

              Description

            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e)=>
                setForm({
                  ...form,
                  description:e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Description"
            />

          </div>

          {/* Checkboxes */}

          <div className="space-y-3">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e)=>
                  setForm({
                    ...form,
                    is_default:e.target.checked,
                  })
                }
              />

              <span className="text-sm font-medium">
                Default Routing Plan
              </span>

            </label>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e)=>
                  setForm({
                    ...form,
                    is_active:e.target.checked,
                  })
                }
              />

              <span className="text-sm font-medium">
                Active
              </span>

            </label>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
            >

              Cancel

            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >

              {saving ? "Saving..." : "Save"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}