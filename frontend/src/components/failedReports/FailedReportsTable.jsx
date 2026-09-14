const GROUP_BY_LABELS = {
  "1": "Carrier",
  "2": "Cause",
  "3": "Number",
  "4": "CLI",
  "5": "IP",
  "6": "Date",
  "7": "Hour",
};


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


function getGroupedValue(
  row,
  group
) {

  switch (String(group)) {

    case "1":
      return value(
        row,
        "carrier",
        "carrier_name",
        "provider"
      );

    case "2":
      return value(
        row,
        "cause",
        "failure_cause",
        "reason",
        "disposition"
      );

    case "3":
      return value(
        row,
        "number",
        "receiver_number",
        "destination"
      );

    case "4":
      return value(
        row,
        "cli",
        "caller_number"
      );

    case "5":
      return value(
        row,
        "ip",
        "carrier_ip",
        "source_ip",
        "caller_ip"
      );

    case "6":
      return value(
        row,
        "date",
        "start_time",
        "created_at"
      );

    case "7":
      return value(
        row,
        "hour"
      );

    default:
      return "-";
  }

}


export default function FailedReportsTable({
  loading,
  data = [],
  grouped = false,
  groupBy = [],
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


  /*
   * GROUPED HEADERS
   *
   * Example:
   * groupBy = ["1", "2"]
   *
   * Result:
   * Carrier | Cause | Count
   */

  const groupedHeadings = (
    Array.isArray(groupBy)
      ? groupBy
      : []
  )
    .map(
      (group) =>
        GROUP_BY_LABELS[
          String(group)
        ]
    )
    .filter(Boolean);


  const headings = grouped

    ? [
        ...groupedHeadings,
        "Count",
      ]

    : [
        "Date",
        "Carrier",
        "Number",
        "CLI",
        "IP",
        "Cause",
      ];


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


        {/* =================================================
            TABLE HEADER
        ================================================= */}

        <thead>

          <tr className="
            border-b
            border-slate-200
            dark:border-slate-800
          ">

            {headings.map(
              (heading, index) => (

                <th
                  key={`${heading}-${index}`}
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


        {/* =================================================
            TABLE BODY
        ================================================= */}

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


                {/* =================================================
                    GROUPED MODE
                ================================================= */}

                {grouped ? (

                  <>

                    {(
                      Array.isArray(groupBy)
                        ? groupBy
                        : []
                    ).map(
                      (group, groupIndex) => (

                        <td
                          key={
                            `${group}-${groupIndex}`
                          }
                          className="
                            px-4
                            py-3
                            text-sm
                            whitespace-nowrap
                          "
                        >

                          {String(group) === "2" ? (

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

                              {getGroupedValue(
                                row,
                                group
                              )}

                            </span>

                          ) : (

                            getGroupedValue(
                              row,
                              group
                            )

                          )}

                        </td>

                      )
                    )}


                    {/* COUNT */}

                    <td className="
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      whitespace-nowrap
                    ">

                      {row.count ?? 0}

                    </td>

                  </>

                ) : (

                  /* =================================================
                     NORMAL MODE
                  ================================================= */

                  <>

                    {/* DATE */}

                    <td className="
                      px-4
                      py-3
                      text-sm
                      whitespace-nowrap
                    ">

                      {formatDate(
                        value(
                          row,
                          "date",
                          "start_time",
                          "created_at"
                        )
                      )}

                    </td>


                    {/* CARRIER */}

                    <td className="
                      px-4
                      py-3
                      text-sm
                    ">

                      {value(
                        row,
                        "carrier",
                        "carrier_name",
                        "provider"
                      )}

                    </td>


                    {/* NUMBER */}

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


                    {/* CLI */}

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


                    {/* IP */}

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
                        "carrier_ip",
                        "source_ip",
                        "caller_ip"
                      )}

                    </td>


                    {/* CAUSE */}

                    <td className="
                      px-4
                      py-3
                    ">

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

                  </>

                )}

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(value) {

  if (!value) {

    return "-";

  }


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