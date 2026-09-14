const GROUP_BY_LABELS = {
  "1": "Carrier",
  "2": "Cause",
  "3": "Number",
  "4": "CLI",
  "5": "IP",
  "6": "Date",
  "7": "Hour",
};


/* =========================================================
   VALUE HELPER
========================================================= */

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


/* =========================================================
   GROUPED VALUE
========================================================= */

function getGroupedValue(
  row,
  group
) {

  switch (String(group)) {

    /* Carrier */

    case "1":

      return value(
        row,
        "carrier",
        "carrier_name",
        "provider"
      );


    /* Cause */

    case "2":

      return value(
        row,
        "cause",
        "failure_cause",
        "reason",
        "disposition"
      );


    /* Number */

    case "3":

      return value(
        row,
        "number",
        "receiver_number",
        "destination"
      );


    /* CLI */

    case "4":

      return value(
        row,
        "cli",
        "caller_number"
      );


    /* IP */

    case "5":

      return value(
        row,
        "ip",
        "carrier_ip",
        "source_ip",
        "caller_ip"
      );


    /* Date */

    case "6":

      return value(
        row,
        "date",
        "start_time",
        "created_at"
      );


    /* Hour */

    case "7":

      return value(
        row,
        "hour"
      );


    default:

      return "-";

  }

}


/* =========================================================
   TABLE
========================================================= */

export default function FailedReportsTable({
  loading,
  data = [],
  grouped = false,
  groupBy = [],
}) {


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

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

          <TableHeader
            grouped={grouped}
            groupBy={groupBy}
          />

          <tbody>

            <tr>

              <td
                colSpan={
                  grouped
                    ? Math.max(
                        groupBy.length + 1,
                        2
                      )
                    : 6
                }
                className="
                  px-4
                  py-12
                  text-center
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >

                Loading failed reports...

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    );

  }


  /* =======================================================
     GROUP HEADINGS
  ======================================================= */

  const groupedHeadings =
    Array.isArray(groupBy)
      ? groupBy
          .map(
            (group) =>
              GROUP_BY_LABELS[
                String(group)
              ]
          )
          .filter(Boolean)
      : [];


  /* =======================================================
     NORMAL HEADINGS
  ======================================================= */

  const normalHeadings = [
    "Date",
    "Carrier",
    "Number",
    "CLI",
    "IP",
    "Cause",
  ];


  /* =======================================================
     EMPTY GROUP BY SAFETY
  ======================================================= */

  const isGrouped =
    grouped &&
    groupedHeadings.length > 0;


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
            HEADER
        ================================================= */}

        <TableHeader
          grouped={isGrouped}
          groupBy={groupBy}
        />


        {/* =================================================
            BODY
        ================================================= */}

        <tbody>

          {!data.length ? (

            <tr>

              <td
                colSpan={
                  isGrouped
                    ? groupedHeadings.length + 1
                    : normalHeadings.length
                }
                className="
                  px-4
                  py-12
                  text-center
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >

                No Failed Records Found

              </td>

            </tr>

          ) : (

            data.map(
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

                  {isGrouped ? (

                    <>

                      {groupBy.map(
                        (
                          group,
                          groupIndex
                        ) => {

                          const groupValue =
                            getGroupedValue(
                              row,
                              group
                            );


                          return (

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

                                  {groupValue}

                                </span>

                              ) : (

                                groupValue

                              )}

                            </td>

                          );

                        }
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
            )

          )}

        </tbody>

      </table>

    </div>

  );

}


/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
  grouped = false,
  groupBy = [],
}) {


  const groupedHeadings =
    Array.isArray(groupBy)
      ? groupBy
          .map(
            (group) =>
              GROUP_BY_LABELS[
                String(group)
              ]
          )
          .filter(Boolean)
      : [];


  const headings =
    grouped &&
    groupedHeadings.length > 0

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

    <thead>

      <tr className="
        border-b
        border-slate-200
        dark:border-slate-800
      ">

        {headings.map(
          (
            heading,
            index
          ) => (

            <th
              key={
                `${heading}-${index}`
              }
              scope="col"
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