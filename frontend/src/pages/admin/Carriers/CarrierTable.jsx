import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function CarrierTable({

  carriers,

  loading,

  onEdit,

  onDelete,

  onViewIPs,

}) {

  if (loading) {

    return (

      <div className="bg-white rounded-xl shadow p-6 text-center">

        Loading...

      </div>

    );

  }

  return (

    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-6 py-3 text-left">
              Name
            </th>

            <th className="px-6 py-3 text-left">
              Description
            </th>

            <th className="px-6 py-3 text-center">
              Status
            </th>

            <th className="px-6 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {

            carriers.length === 0 ?

            (

              <tr>

                <td
                  colSpan="4"
                  className="text-center py-8 text-slate-500"
                >

                  No Carrier Found

                </td>

              </tr>

            )

            :

            carriers.map((carrier)=>(

              <tr
                key={carrier.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-4 font-medium">

                  {carrier.name}

                </td>

                <td className="px-6 py-4">

                  {carrier.description || "-"}

                </td>

                <td className="px-6 py-4 text-center">

                  {

                    carrier.is_active ?

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                      Active

                    </span>

                    :

                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">

                      Inactive

                    </span>

                  }

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button

                      onClick={()=>onViewIPs(carrier)}

                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"

                    >

                      <Eye size={18}/>

                    </button>

                    <button

                      onClick={()=>onEdit(carrier)}

                      className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200"

                    >

                      <Pencil size={18}/>

                    </button>

                    <button

                      onClick={()=>onDelete(carrier)}

                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200"

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

  );

}