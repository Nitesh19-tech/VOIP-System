import {
  Eye,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";


const formatDate = (value) => {

  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime()))
    return String(value);

  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

};


const formatDuration = (value) => {

  const seconds =
    Number(value) || 0;

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );

  const remaining =
    Math.floor(
      seconds % 60
    );

  return [
    hours,
    minutes,
    remaining,
  ]
    .map(
      (part) =>
        String(part).padStart(
          2,
          "0"
        )
    )
    .join(":");

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


export default function CDRTable({
  loading,
  data = [],
  onView,
}) {

  if (loading) {

    return (

      <div className="
        min-h-[360px]
        flex
        items-center
        justify-center
        bg-white
        dark:bg-slate-900
      ">

        <div className="
          flex
          flex-col
          items-center
          gap-3
          text-slate-500
        ">

          <div className="
            h-9
            w-9
            animate-spin
            rounded-full
            border-4
            border-slate-200
            border-t-sky-500
            dark:border-slate-700
            dark:border-t-sky-400
          " />

          Loading CDR records...

        </div>

      </div>

    );

  }


  if (!data.length) {

    return (

      <div className="
        min-h-[300px]
        flex
        flex-col
        items-center
        justify-center
        bg-white
        px-6
        text-center
        dark:bg-slate-900
      ">

        <div className="
          mb-3
          rounded-full
          bg-slate-100
          px-4
          py-3
          text-sm
          font-medium
          text-slate-500
          dark:bg-slate-800
        ">

          No Call Records Found

        </div>

        <p className="
          text-xs
          text-slate-400
        ">

          Try changing the filters or date range.

        </p>

      </div>

    );

  }


  return (

    <div className="
      w-full
      overflow-x-auto
    ">

      <table className="
        min-w-[1450px]
        w-full
        border-collapse
      ">

        <thead>

          <tr className="
            border-b
            border-slate-200
            bg-white
            dark:border-slate-800
            dark:bg-slate-900
          ">

            <Header>
              Date
            </Header>

            <Header>
              Carrier
            </Header>

            <Header>
              Termination
            </Header>

            <Header>
              Number
            </Header>

            <Header>
              CLI
            </Header>

            <Header>
              Currency
            </Header>

            <Header>
              Duration
            </Header>

            <Header>
              Payterm
            </Header>

            <Header>
              Payout
            </Header>

            <Header>
              Client
            </Header>

            <Header>
              C Payterm
            </Header>

            <Header>
              C Payout
            </Header>

            <Header>
              Cause
            </Header>

            <Header align="center">
              Action
            </Header>

          </tr>

        </thead>


        <tbody>

          {data.map(
            (row, index) => (

              <tr
                key={
                  row.id ??
                  `cdr-${index}`
                }
                className="
                  border-b
                  border-slate-100
                  transition
                  hover:bg-slate-50
                  dark:border-slate-800
                  dark:hover:bg-slate-800/40
                "
              >

                <Cell>
                  <span className="
                    whitespace-nowrap
                    text-sm
                    text-slate-700
                    dark:text-slate-200
                  ">

                    {formatDate(
                      value(
                        row,
                        "start_time",
                        "date",
                        "created_at"
                      )
                    )}

                  </span>
                </Cell>


                <Cell>
                  <span className="
                    whitespace-nowrap
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                  ">

                    {value(
                      row,
                      "carrier_name",
                      "carrier"
                    )}

                  </span>
                </Cell>


                <Cell>
                  <span className="
                    whitespace-nowrap
                    text-sm
                    text-slate-700
                    dark:text-slate-200
                  ">

                    {value(
                      row,
                      "termination_name",
                      "termination"
                    )}

                  </span>
                </Cell>


                <Cell>
                  <div className="
                    flex
                    items-center
                    gap-2
                    whitespace-nowrap
                  ">

                    <PhoneOutgoing
                      size={15}
                      className="
                        text-sky-500
                      "
                    />

                    <span className="
                      font-mono
                      text-sm
                      text-slate-700
                      dark:text-slate-200
                    ">

                      {value(
                        row,
                        "number",
                        "caller_number",
                        "receiver_number"
                      )}

                    </span>

                  </div>
                </Cell>


                <Cell>
                  <div className="
                    flex
                    items-center
                    gap-2
                    whitespace-nowrap
                  ">

                    <PhoneIncoming
                      size={15}
                      className="
                        text-emerald-500
                      "
                    />

                    <span className="
                      font-mono
                      text-sm
                      text-slate-700
                      dark:text-slate-200
                    ">

                      {value(
                        row,
                        "cli",
                        "caller_number"
                      )}

                    </span>

                  </div>
                </Cell>


                <Cell>
                  {value(
                    row,
                    "currency"
                  )}
                </Cell>


                <Cell>
                  <span className="
                    whitespace-nowrap
                    font-mono
                    text-sm
                  ">

                    {formatDuration(
                      value(
                        row,
                        "duration"
                      )
                    )}

                  </span>
                </Cell>


                <Cell>
                  {value(
                    row,
                    "payterm",
                    "payment_term"
                  )}
                </Cell>


                <Cell>
                  <span className="
                    whitespace-nowrap
                    font-medium
                  ">

                    {value(
                      row,
                      "payout"
                    )}

                  </span>
                </Cell>


                <Cell>
                  {value(
                    row,
                    "client_name",
                    "client"
                  )}
                </Cell>


                <Cell>
                  {value(
                    row,
                    "client_payterm",
                    "c_payterm"
                  )}
                </Cell>


                <Cell>
                  {value(
                    row,
                    "client_payout",
                    "c_payout"
                  )}
                </Cell>


                <Cell>
                  <CauseBadge
                    value={
                      value(
                        row,
                        "cause",
                        "disposition"
                      )
                    }
                  />
                </Cell>


                <Cell align="center">

                  <button
                    type="button"
                    onClick={() =>
                      onView?.(row)
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-sky-200
                      bg-sky-50
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-sky-700
                      hover:bg-sky-100
                      dark:border-sky-500/30
                      dark:bg-sky-500/10
                      dark:text-sky-300
                    "
                  >

                    <Eye
                      size={14}
                    />

                    View

                  </button>

                </Cell>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}


function Header({
  children,
  align = "left",
}) {

  return (

    <th className={`
      whitespace-nowrap
      px-4
      py-4
      text-left
      text-sm
      font-medium
      text-slate-700
      dark:text-slate-200
      ${
        align === "center"
          ? "text-center"
          : ""
      }
    `}>

      {children}

    </th>

  );

}


function Cell({
  children,
  align = "left",
}) {

  return (

    <td className={`
      max-w-[260px]
      px-4
      py-3.5
      text-sm
      text-slate-600
      dark:text-slate-300
      ${
        align === "center"
          ? "text-center"
          : ""
      }
    `}>

      {children}

    </td>

  );

}


function CauseBadge({
  value,
}) {

  const text =
    String(value);

  const upper =
    text.toUpperCase();

  let className =
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  if (upper === "ANSWERED") {

    className =
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

  } else if (
    upper === "BUSY"
  ) {

    className =
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

  } else if (
    upper === "FAILED"
  ) {

    className =
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

  }

  return (

    <span className={`
      inline-flex
      whitespace-nowrap
      rounded-full
      px-2.5
      py-1
      text-xs
      font-semibold
      ${className}
    `}>

      {text}

    </span>

  );

}