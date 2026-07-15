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

        is_active: carrier.is_active,

      });

    } else {

      setForm({

        name: "",

        description: "",

        is_active: true,

      });

    }

  }, [carrier]);

  if (!open) return null;

  const handleSubmit = (e) => {

    e.preventDefault();

    onSave(form);

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

        <div className="px-6 py-4 border-b">

          <h2 className="text-xl font-semibold">

            {carrier ? "Edit Carrier" : "Add Carrier"}

          </h2>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">

              Carrier Name

            </label>

            <input

              type="text"

              value={form.name}

              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }

              required

              className="w-full border rounded-xl px-4 py-3"

            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Description

            </label>

            <textarea

              rows="3"

              value={form.description}

              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }

              className="w-full border rounded-xl px-4 py-3"

            />

          </div>

          <div className="flex items-center gap-3">

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

            <label>

              Active

            </label>

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button

              type="button"

              onClick={onClose}

              className="px-5 py-2 rounded-xl border"

            >

              Cancel

            </button>

            <button

              type="submit"

              disabled={saving}

              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"

            >

              {saving ? "Saving..." : "Save"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}