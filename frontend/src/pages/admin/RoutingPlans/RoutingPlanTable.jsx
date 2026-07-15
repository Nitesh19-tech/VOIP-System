import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function RoutingPlanTable({

  plans,

  loading,

  onEdit,

  onDelete,

}) {

  if (loading) {

    return (

      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-700 p-10 text-center">

        Loading Routing Plans...

      </div>

    );

  }

  return (

    <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow border border-slate-200 dark:border-slate-700">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100 dark:bg-slate-800">

            <tr>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Description
              </th>

              <th className="px-6 py-4 text-center">
                Default
              </th>

              <th className="px-6 py-4 text-center">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {

              plans.length === 0 ?

              (

                <tr>

                  <td
                    colSpan={5}
                    className="py-10 text-center text-slate-500"
                  >

                    No Routing Plans Found

                  </td>

                </tr>

              )

              :

              plans.map((plan)=>(

                <tr
                  key={plan.id}
                  className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >

                  <td className="px-6 py-4 font-semibold">

                    {plan.name}

                  </td>

                  <td className="px-6 py-4">

                    {plan.description || "-"}

                  </td>

                  <td className="px-6 py-4 text-center">

                    {

                      plan.is_default ?

                      "Yes"

                      :

                      "No"

                    }

                  </td>

                  <td className="px-6 py-4 text-center">

                    {

                      plan.is_active ?

                      <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">

                        Active

                      </span>

                      :

                      <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">

                        Inactive

                      </span>

                    }

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <button

                        onClick={()=>onEdit(plan)}

                        className="rounded-lg bg-yellow-100 p-2 hover:bg-yellow-200"

                      >

                        <Pencil size={18}/>

                      </button>

                      <button

                        onClick={()=>onDelete(plan)}

                        className="rounded-lg bg-red-100 p-2 hover:bg-red-200"

                      >

                        <Trash2 size={18}/>

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}