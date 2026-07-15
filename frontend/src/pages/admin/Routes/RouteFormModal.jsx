import { useEffect, useState } from "react";

import { getRoutingPlans } from "../../../services/routingPlanService";
import { getTerminations } from "../../../services/carrierService";

export default function RouteFormModal({
  open,
  route,
  saving,
  onSave,
  onClose,
}) {

  const [routingPlans, setRoutingPlans] = useState([]);
  const [terminations, setTerminations] = useState([]);

  const [form, setForm] = useState({
    routing_plan: "",
    termination: "",
    prefix: "",
    priority: 1,
    strip_digits: 0,
    add_prefix: "",
    description: "",
  });

  useEffect(() => {

    if (!open) return;

    loadDropdowns();

  }, [open]);

  useEffect(() => {

    if (route) {

      setForm({

        routing_plan: route.routing_plan,

        termination: route.termination,

        prefix: route.prefix,

        priority: route.priority,

        strip_digits: route.strip_digits,

        add_prefix: route.add_prefix,

        description: route.description || "",

      });

    } else {

      setForm({

        routing_plan: "",

        termination: "",

        prefix: "",

        priority: 1,

        strip_digits: 0,

        add_prefix: "",

        description: "",

      });

    }

  }, [route]);

  const loadDropdowns = async () => {

    try {

      const [plansRes, terminationRes] = await Promise.all([

        getRoutingPlans(),

        getTerminations(),

      ]);

      setRoutingPlans(plansRes.data.data || []);

      setTerminations(terminationRes.data.data || []);

    } catch (err) {

      console.error(err);

      alert("Unable to load dropdown data.");

    }

  };

  const submit = (e) => {

    e.preventDefault();

    onSave(form);

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 p-6">

        <h2 className="mb-6 text-2xl font-bold">

          {route ? "Edit Route" : "Add Route"}

        </h2>

        <form
          onSubmit={submit}
          className="grid grid-cols-2 gap-5"
        >

          <div>

            <label className="mb-2 block">

              Routing Plan

            </label>

            <select
              value={form.routing_plan}
              onChange={(e) =>
                setForm({
                  ...form,
                  routing_plan: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800"
            >

              <option value="">

                Select

              </option>

              {routingPlans.map((plan) => (

                <option
                  key={plan.id}
                  value={plan.id}
                >

                  {plan.name}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block">

              Termination

            </label>

            <select
              value={form.termination}
              onChange={(e) =>
                setForm({
                  ...form,
                  termination: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800"
            >

              <option value="">

                Select

              </option>

              {terminations.map((termination) => (

                <option
                  key={termination.id}
                  value={termination.id}
                >

                  {termination.name}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block">

              Prefix

            </label>

            <input
              value={form.prefix}
              onChange={(e) =>
                setForm({
                  ...form,
                  prefix: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800"
            />

          </div>

          <div>

            <label className="mb-2 block">

              Priority

            </label>

            <input
              type="number"
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800"
            />

          </div>

          <div>

            <label className="mb-2 block">

              Strip Digits

            </label>

            <input
              type="number"
              value={form.strip_digits}
              onChange={(e) =>
                setForm({
                  ...form,
                  strip_digits: Number(e.target.value),
                })
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800"
            />

          </div>

          <div>

            <label className="mb-2 block">

              Add Prefix

            </label>

            <input
              value={form.add_prefix}
              onChange={(e) =>
                setForm({
                  ...form,
                  add_prefix: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800"
            />

          </div>

          <div className="col-span-2">

            <label className="mb-2 block">

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
              className="w-full rounded-xl border p-3 dark:bg-slate-800"
            />

          </div>

          <div className="col-span-2 flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-6 py-3"
            >

              Cancel

            </button>

            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white"
            >

              {saving ? "Saving..." : "Save"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}