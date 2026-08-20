const value = (
  row,
  ...keys
) => {

  for (const key of keys) {

    if (
      row?.[key] !== null &&
      row?.[key] !== undefined &&
      row?.[key] !== ""
    ) {

      return row[key];

    }

  }

  return "-";

};


export default function FailedReportsTable({
  loading,
  data = [],
}) {

  if (loading) {

    return (

      <div className="
        flex
        min-h-[330px]
        items-center
        justify-center
        text-sm
        text-slate-500
      ">

        Loading failed reports...

      </div>

    );

  }


  if (!data.length) {

    return (

      <div className="
        flex
        min-h-[280px]
        items-center
        justify-center
        text-sm
        text-slate-500
      ">

        No Failed Records Found

      </div>

    );

  }


  return (

    <div className="
      w-full
      overflow-x-auto
    ">

      <table className="
        min-w-[1050px]
        w-full
        border-collapse
      ">

        <thead>

          <tr className="
            border-b
            border-slate-200
            dark:border-slate-800
          ">

            {[
              "Date",
              "Carrier",
              "Number",
              "CLI",
              "IP",
              "Cause",
            ].map(
              (heading) => (

                <th
                  key={heading}
                  className="
                    whitespace-nowrap
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >

                  {heading}

                </th>

              )
            )}

          </tr>

        </thead>


        <tbody>

          {data.map(
            (row, index) => (

              <tr
                key={
                  row.id ??
                  `failed-${index}`
                }
                className="
                  border-b
                  border-slate-100
                  hover:bg-slate-50
                  dark:border-slate-800
                  dark:hover:bg-slate-800/40
                "
              >

                <td className="px-4 py-3 text-sm whitespace-nowrap">

                  {formatDate(
                    value(
                      row,
                      "date",
                      "start_time",
                      "created_at"
                    )
                  )}

                </td>

                <td className="px-4 py-3 text-sm">

                  {value(
                    row,
                    "carrier",
                    "carrier_name",
                    "provider"
                  )}

                </td>

                <td className="
                  px-4
                  py-3
                  font-mono
                  text-sm
                  whitespace-nowrap
                ">

                  {value(
                    row,
                    "number",
                    "receiver_number",
                    "destination"
                  )}

                </td>

                <td className="
                  px-4
                  py-3
                  font-mono
                  text-sm
                  whitespace-nowrap
                ">

                  {value(
                    row,
                    "cli",
                    "caller_number"
                  )}

                </td>

                <td className="
                  px-4
                  py-3
                  font-mono
                  text-sm
                  whitespace-nowrap
                ">

                  {value(
                    row,
                    "ip",
                    "source_ip",
                    "caller_ip"
                  )}

                </td>

                <td className="px-4 py-3">

                  <span className="
                    inline-flex
                    rounded-full
                    bg-red-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-red-700
                    dark:bg-red-500/10
                    dark:text-red-400
                  ">

                    {value(
                      row,
                      "cause",
                      "failure_cause",
                      "reason",
                      "disposition"
                    )}

                  </span>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}


function formatDate(value) {

  if (!value) return "-";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(value);

  }

  return date.toLocaleString(
    "en-IN",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  );

}