import {
  Edit,
  Trash2,
  PhoneIncoming,
  CheckCircle2,
  XCircle,
} from "lucide-react";


export default function IncomingRouteTable({
  routes = [],
  loading,
  onEdit,
  onDelete,
}) {

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {

    return (

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
        "
      >

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr
                className="
                  border-b
                  border-slate-800
                  bg-slate-950
                "
              >

                {[
                  "Company",
                  "DID",
                  "Forward Number",
                  "Termination",
                  "Priority",
                  "Status",
                  "Actions",
                ].map((heading) => (

                  <th
                    key={heading}
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    {heading}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody>

              {[1, 2, 3].map((item) => (

                <tr
                  key={item}
                  className="
                    animate-pulse
                    border-b
                    border-slate-800
                  "
                >

                  <td className="px-6 py-5">
                    <div className="h-5 w-32 rounded bg-slate-800" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="h-5 w-32 rounded bg-slate-800" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="h-5 w-36 rounded bg-slate-800" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="h-5 w-32 rounded bg-slate-800" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="h-5 w-10 rounded bg-slate-800" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="h-6 w-20 rounded-full bg-slate-800" />
                  </td>

                  <td className="px-6 py-5">
                    <div className="ml-auto h-8 w-20 rounded bg-slate-800" />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    );

  }


  // =====================================================
  // Empty
  // =====================================================

  if (!routes.length) {

    return (

      <div
        className="
          flex
          min-h-[300px]
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-slate-700
          bg-slate-900
          px-6
          text-center
        "
      >

        <div
          className="
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-slate-800
          "
        >

          <PhoneIncoming
            size={26}
            className="text-slate-500"
          />

        </div>


        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >
          No Incoming Routes
        </h3>


        <p
          className="
            mt-2
            max-w-md
            text-sm
            text-slate-500
          "
        >
          No incoming DID routes are configured
          yet.
        </p>

      </div>

    );

  }


  // =====================================================
  // Helpers
  // =====================================================

  const getCompanyName = (route) => {

    if (route.company_name) {
      return route.company_name;
    }

    if (route.company_detail?.name) {
      return route.company_detail.name;
    }

    if (route.company) {
      return `Company #${route.company}`;
    }

    return "—";

  };


  const getTerminationName = (route) => {

    if (route.termination_name) {
      return route.termination_name;
    }

    if (route.termination_detail?.name) {
      return route.termination_detail.name;
    }

    if (route.termination) {
      return `Termination #${route.termination}`;
    }

    return "—";

  };


  const getCarrierName = (route) => {

    if (route.carrier_name) {
      return route.carrier_name;
    }

    if (route.termination_detail?.carrier_name) {
      return route.termination_detail.carrier_name;
    }

    return "";

  };


  // =====================================================
  // Render
  // =====================================================

  return (

    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-xl
      "
    >

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* =================================================
              Header
          ================================================= */}

          <thead>

            <tr
              className="
                border-b
                border-slate-800
                bg-slate-950
              "
            >

              {/* Company */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Company
              </th>


              {/* DID */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                DID
              </th>


              {/* Forward Number */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Forward Number
              </th>


              {/* Termination */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Termination
              </th>


              {/* Priority */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Priority
              </th>


              {/* Status */}

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Status
              </th>


              {/* Actions */}

              <th
                className="
                  px-6
                  py-4
                  text-right
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Actions
              </th>

            </tr>

          </thead>


          {/* =================================================
              Body
          ================================================= */}

          <tbody>

            {routes.map((route) => {

              const companyName =
                getCompanyName(route);

              const terminationName =
                getTerminationName(route);

              const carrierName =
                getCarrierName(route);


              return (

                <tr
                  key={route.id}
                  className="
                    border-b
                    border-slate-800
                    transition
                    hover:bg-slate-800/50
                  "
                >

                  {/* =========================================
                      Company
                  ========================================= */}

                  <td className="px-6 py-5">

                    <div>

                      <p
                        className="
                          font-semibold
                          text-white
                        "
                      >
                        {companyName}
                      </p>

                      {route.company && (
                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          Company ID: {route.company}
                        </p>
                      )}

                    </div>

                  </td>


                  {/* =========================================
                      DID
                  ========================================= */}

                  <td className="px-6 py-5">

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
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-blue-500/10
                        "
                      >

                        <PhoneIncoming
                          size={17}
                          className="text-blue-400"
                        />

                      </div>


                      <div>

                        <p
                          className="
                            font-semibold
                            text-white
                          "
                        >
                          {route.did || "—"}
                        </p>

                        {route.description && (

                          <p
                            className="
                              mt-1
                              max-w-[220px]
                              truncate
                              text-xs
                              text-slate-500
                            "
                            title={route.description}
                          >
                            {route.description}
                          </p>

                        )}

                      </div>

                    </div>

                  </td>


                  {/* =========================================
                      Forward Number
                  ========================================= */}

                  <td className="px-6 py-5">

                    <span
                      className="
                        font-medium
                        text-slate-200
                      "
                    >
                      {route.forward_number || "—"}
                    </span>

                  </td>


                  {/* =========================================
                      Termination
                  ========================================= */}

                  <td className="px-6 py-5">

                    <div>

                      <p
                        className="
                          font-medium
                          text-slate-200
                        "
                      >
                        {terminationName}
                      </p>

                      {carrierName && (

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          {carrierName}
                        </p>

                      )}

                    </div>

                  </td>


                  {/* =========================================
                      Priority
                  ========================================= */}

                  <td className="px-6 py-5">

                    <span
                      className="
                        inline-flex
                        min-w-[32px]
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-800
                        px-2
                        py-1
                        text-sm
                        font-semibold
                        text-slate-300
                      "
                    >
                      {route.priority ?? 1}
                    </span>

                  </td>


                  {/* =========================================
                      Status
                  ========================================= */}

                  <td className="px-6 py-5">

                    {route.enabled ? (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-emerald-500/10
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-emerald-400
                        "
                      >

                        <CheckCircle2 size={14} />

                        Active

                      </span>

                    ) : (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-red-500/10
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          text-red-400
                        "
                      >

                        <XCircle size={14} />

                        Disabled

                      </span>

                    )}

                  </td>


                  {/* =========================================
                      Actions
                  ========================================= */}

                  <td className="px-6 py-5">

                    <div
                      className="
                        flex
                        items-center
                        justify-end
                        gap-2
                      "
                    >

                      {/* Edit */}

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(route)
                        }
                        title="Edit route"
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-700
                          bg-slate-800
                          text-slate-300
                          transition
                          hover:border-blue-500/50
                          hover:bg-blue-500/10
                          hover:text-blue-400
                        "
                      >

                        <Edit size={16} />

                      </button>


                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(route)
                        }
                        title="Delete route"
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-slate-700
                          bg-slate-800
                          text-slate-300
                          transition
                          hover:border-red-500/50
                          hover:bg-red-500/10
                          hover:text-red-400
                        "
                      >

                        <Trash2 size={16} />

                      </button>

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}