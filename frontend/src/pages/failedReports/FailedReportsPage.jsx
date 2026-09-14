import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RefreshCw,
} from "lucide-react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";


import {
  getFailedReports,
  exportFailedReports,
} from "../../services/failedReportsService";


import FailedReportsFilters
  from "../../components/failedReports/FailedReportsFilters";

import FailedReportsTable
  from "../../components/failedReports/FailedReportsTable";

import FailedReportsPagination
  from "../../components/failedReports/FailedReportsPagination";


/* =========================================================
   INITIAL FILTERS
========================================================= */

const INITIAL_FILTERS = {

  from: "",

  to: "",

  number: "",

  cli: "",

  ip: "",

  cause: "",

  groupBy: [],

};


/* =========================================================
   GROUP BY LABELS
========================================================= */

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
   PAGE
========================================================= */

export default function FailedReportsPage() {


  /* =======================================================
     FILTERS
  ======================================================= */

  const [
    filters,
    setFilters,
  ] = useState(
    INITIAL_FILTERS
  );


  /* =======================================================
     DATA
  ======================================================= */

  const [
    data,
    setData,
  ] = useState([]);


  const [
    count,
    setCount,
  ] = useState(0);


  /* =======================================================
     PAGINATION
  ======================================================= */

  const [
    page,
    setPage,
  ] = useState(1);


  const [
    pageSize,
    setPageSize,
  ] = useState(25);


  /* =======================================================
     STATES
  ======================================================= */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    exporting,
    setExporting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     GROUPED MODE
  ======================================================= */

  const grouped = useMemo(
    () =>
      Array.isArray(filters.groupBy) &&
      filters.groupBy.length > 0,
    [
      filters.groupBy,
    ]
  );


  const selectedGroupLabels = useMemo(
    () =>
      (filters.groupBy || [])
        .map(
          (group) =>
            GROUP_BY_LABELS[
              String(group)
            ]
        )
        .filter(Boolean),
    [
      filters.groupBy,
    ]
  );


  /* =======================================================
     BUILD PARAMS
  ======================================================= */

  const buildParams = useCallback(
    (
      requestedPage = page,
      requestedPageSize = pageSize,
      requestedFilters = filters
    ) => {

      const params = {

        page:
          requestedPage,

        page_size:
          requestedPageSize,

        start_date:
          requestedFilters.from || "",

        end_date:
          requestedFilters.to || "",

        number:
          requestedFilters.number || "",

        cli:
          requestedFilters.cli || "",

        ip:
          requestedFilters.ip || "",

        cause:
          requestedFilters.cause || "",

        group_by:
          requestedFilters.groupBy?.join(",") || "",

      };


      return Object.fromEntries(

        Object.entries(
          params
        ).filter(
          ([, value]) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        )

      );

    },
    [
      page,
      pageSize,
      filters,
    ]
  );


  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = useCallback(
    async (
      requestedPage = page,
      requestedPageSize = pageSize,
      requestedFilters = filters
    ) => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getFailedReports(
            buildParams(
              requestedPage,
              requestedPageSize,
              requestedFilters
            )
          );


        const payload =
          response?.data || {};


        const rows =
          Array.isArray(
            payload.results
          )
            ? payload.results
            : Array.isArray(
                payload.data
              )
              ? payload.data
              : [];


        setData(rows);


        setCount(
          Number(
            payload.count ??
            payload.pagination?.count ??
            rows.length
          )
        );


      } catch (err) {

        console.error(
          "Failed Reports Load Error:",
          err
        );


        setData([]);

        setCount(0);


        setError(
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load failed reports."
        );


      } finally {

        setLoading(false);

      }

    },
    [
      buildParams,
      page,
      pageSize,
      filters,
    ]
  );


  /* =======================================================
     INITIAL LOAD / PAGE CHANGE
  ======================================================= */

  useEffect(() => {

    loadData(
      page,
      pageSize,
      filters
    );

  }, [
    page,
    pageSize,
  ]);


  /* =======================================================
     FILTER
  ======================================================= */

  const handleFilter = () => {

    setPage(1);


    loadData(
      1,
      pageSize,
      filters
    );

  };


  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {

    const resetFilters = {
      ...INITIAL_FILTERS,
      groupBy: [],
    };


    setFilters(
      resetFilters
    );


    setPage(1);


    loadData(
      1,
      pageSize,
      resetFilters
    );

  };


  /* =======================================================
     PAGE SIZE
  ======================================================= */

  const handlePageSize = (
    value
  ) => {

    setPageSize(value);

    setPage(1);

  };


  /* =======================================================
     COPY
  ======================================================= */

  const handleCopy = async () => {

    try {

      let headers = [];

      let rows = [];


      /* ===================================================
         GROUPED COPY
      =================================================== */

      if (grouped) {

        headers = [
          ...selectedGroupLabels,
          "Count",
        ];


        rows = data.map(
          (row) => [

            ...(
              filters.groupBy || []
            ).map(
              (group) =>
                getGroupedValue(
                  row,
                  group
                )
            ),

            row.count ?? 0,

          ]
        );


      }

      /* ===================================================
         NORMAL COPY
      =================================================== */

      else {

        headers = [
          "Date",
          "Carrier",
          "Number",
          "CLI",
          "IP",
          "Cause",
        ];


        rows =
          data.map(
            (row) => [

              row.date ?? "",

              row.carrier ?? "",

              row.number ?? "",

              row.cli ?? "",

              row.ip ?? "",

              row.cause ?? "",

            ]
          );

      }


      const text = [

        headers.join("\t"),

        ...rows.map(
          (row) =>
            row.join("\t")
        ),

      ].join("\n");


      await navigator.clipboard.writeText(
        text
      );


      alert(
        grouped
          ? "Grouped failed reports copied successfully."
          : "Failed reports copied successfully."
      );


    } catch (err) {

      console.error(
        "Copy Error:",
        err
      );


      setError(
        "Unable to copy records."
      );

    }

  };


  /* =======================================================
     CSV EXPORT
  ======================================================= */

  const handleCSVExport =
    async () => {

      try {

        setExporting(true);

        setError("");


        const response =
          await exportFailedReports(
            buildParams(
              1,
              "all",
              filters
            )
          );


        const blob =
          response.data instanceof Blob
            ? response.data
            : new Blob(
                [
                  response.data,
                ],
                {
                  type:
                    "text/csv;charset=utf-8;",
                }
              );


        downloadBlob(
          blob,
          grouped
            ? "failed_reports_grouped.csv"
            : "failed_reports.csv"
        );


      } catch (err) {

        console.error(
          "CSV Export Error:",
          err
        );


        setError(
          "Unable to export CSV."
        );


      } finally {

        setExporting(false);

      }

    };


  /* =======================================================
     EXCEL
  ======================================================= */

  const handleExcelExport = () => {

    try {

      setExporting(true);

      setError("");


      let rows = [];

      let columns = [];


      /* ===================================================
         GROUPED EXCEL
      =================================================== */

      if (grouped) {

        columns = [
          ...selectedGroupLabels,
          "Count",
        ];


        rows =
          data.map(
            (row) => {

              const output = {};


              (
                filters.groupBy || []
              ).forEach(
                (group) => {

                  const label =
                    GROUP_BY_LABELS[
                      String(group)
                    ];


                  output[label] =
                    getGroupedValue(
                      row,
                      group
                    );

                }
              );


              output.Count =
                row.count ?? 0;


              return output;

            }
          );

      }

      /* ===================================================
         NORMAL EXCEL
      =================================================== */

      else {

        columns = [
          "Date",
          "Carrier",
          "Number",
          "CLI",
          "IP",
          "Cause",
        ];


        rows =
          data.map(
            (row) => ({

              Date:
                row.date ?? "",

              Carrier:
                row.carrier ?? "",

              Number:
                row.number ?? "",

              CLI:
                row.cli ?? "",

              IP:
                row.ip ?? "",

              Cause:
                row.cause ?? "",

            })
          );

      }


      const worksheet =
        XLSX.utils.json_to_sheet(
          rows,
          {
            header:
              columns,
          }
        );


      worksheet["!cols"] =
        columns.map(
          (column) => ({

            wch:
              column === "Count"
                ? 12
                : 22,

          })
        );


      const workbook =
        XLSX.utils.book_new();


      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Failed Reports"
      );


      XLSX.writeFile(
        workbook,
        grouped
          ? "failed_reports_grouped.xlsx"
          : "failed_reports.xlsx"
      );


    } catch (err) {

      console.error(
        "Excel Export Error:",
        err
      );


      setError(
        "Unable to export Excel."
      );


    } finally {

      setExporting(false);

    }

  };


  /* =======================================================
     PDF
  ======================================================= */

  const handlePDFExport = () => {

    try {

      setExporting(true);

      setError("");


      const doc =
        new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });


      doc.setFontSize(
        16
      );


      doc.text(
        "Failed Reports & Stats",
        14,
        15
      );


      doc.setFontSize(
        9
      );


      doc.text(
        `Total Records: ${count}`,
        14,
        22
      );


      let headers = [];

      let rows = [];


      /* ===================================================
         GROUPED PDF
      =================================================== */

      if (grouped) {

        headers = [
          ...selectedGroupLabels,
          "Count",
        ];


        rows =
          data.map(
            (row) => [

              ...(
                filters.groupBy || []
              ).map(
                (group) =>
                  getGroupedValue(
                    row,
                    group
                  )
              ),

              row.count ?? 0,

            ]
          );

      }

      /* ===================================================
         NORMAL PDF
      =================================================== */

      else {

        headers = [
          "Date",
          "Carrier",
          "Number",
          "CLI",
          "IP",
          "Cause",
        ];


        rows =
          data.map(
            (row) => [

              row.date ?? "",

              row.carrier ?? "",

              row.number ?? "",

              row.cli ?? "",

              row.ip ?? "",

              row.cause ?? "",

            ]
          );

      }


      autoTable(
        doc,
        {

          startY: 28,

          head: [
            headers,
          ],

          body: rows,

          theme:
            "grid",

          styles: {
            fontSize: 8,
            cellPadding: 2,
          },

          headStyles: {
            fontStyle:
              "bold",
          },

          margin: {
            left: 10,
            right: 10,
          },

        }
      );


      doc.save(
        grouped
          ? "failed_reports_grouped.pdf"
          : "failed_reports.pdf"
      );


    } catch (err) {

      console.error(
        "PDF Export Error:",
        err
      );


      setError(
        "Unable to export PDF."
      );


    } finally {

      setExporting(false);

    }

  };


  /* =======================================================
     PRINT
  ======================================================= */

  const handlePrint = () => {

    let headers = [];

    let rows = [];


    /* ===================================================
       GROUPED PRINT
    =================================================== */

    if (grouped) {

      headers = [
        ...selectedGroupLabels,
        "Count",
      ];


      rows =
        data.map(
          (row) => [

            ...(
              filters.groupBy || []
            ).map(
              (group) =>
                getGroupedValue(
                  row,
                  group
                )
            ),

            row.count ?? 0,

          ]
        );

    }

    /* ===================================================
       NORMAL PRINT
    =================================================== */

    else {

      headers = [
        "Date",
        "Carrier",
        "Number",
        "CLI",
        "IP",
        "Cause",
      ];


      rows =
        data.map(
          (row) => [

            row.date ?? "",

            row.carrier ?? "",

            row.number ?? "",

            row.cli ?? "",

            row.ip ?? "",

            row.cause ?? "",

          ]
        );

    }


    const headerHTML =
      headers
        .map(
          (header) =>
            `<th>${escapeHTML(header)}</th>`
        )
        .join("");


    const bodyHTML =
      rows
        .map(
          (row) => `

            <tr>

              ${row
                .map(
                  (cell) =>
                    `<td>${escapeHTML(cell)}</td>`
                )
                .join("")}

            </tr>

          `
        )
        .join("");


    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1200,height=800"
      );


    if (!printWindow) {

      setError(
        "Please allow popups to print."
      );

      return;

    }


    printWindow.document.write(
      `

        <!DOCTYPE html>

        <html>

        <head>

          <title>
            Failed Reports
          </title>


          <style>

            body {

              font-family:
                Arial,
                sans-serif;

              padding: 30px;

              color: #111;

            }


            h1 {

              font-size: 22px;

              margin-bottom: 5px;

            }


            .count {

              margin-bottom: 20px;

              color: #555;

            }


            table {

              width: 100%;

              border-collapse:
                collapse;

              font-size: 12px;

            }


            th,
            td {

              border:
                1px solid #ccc;

              padding: 8px;

              text-align: left;

            }


            th {

              background:
                #f1f5f9;

            }


            @media print {

              body {

                padding: 0;

              }

            }

          </style>

        </head>


        <body>

          <h1>
            Failed Reports & Stats
          </h1>


          <div class="count">

            Total Records:
            ${count}

          </div>


          <table>

            <thead>

              <tr>

                ${headerHTML}

              </tr>

            </thead>


            <tbody>

              ${bodyHTML}

            </tbody>

          </table>

        </body>

        </html>

      `
    );


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
      () => {

        printWindow.print();

        printWindow.close();

      },
      300
    );

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div
      className="
        min-h-full
        bg-slate-50
        p-2
        sm:p-4
        dark:bg-slate-950
      "
    >

      <div
        className="
          mx-auto
          max-w-[1900px]
        "
      >


        {/* =================================================
            TITLE
        ================================================= */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            pb-3
            dark:border-slate-800
          "
        >

          <h1
            className="
              text-xl
              font-semibold
              text-slate-800
              dark:text-white
            "
          >

            Failed Reports & Stats

          </h1>


          <button
            type="button"
            onClick={() =>
              loadData(
                page,
                pageSize,
                filters
              )
            }
            className="
              hidden
              items-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-sm
              text-slate-600
              hover:bg-slate-50
              sm:flex
              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-300
            "
          >

            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className="
              mb-4
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
              dark:border-red-500/30
              dark:bg-red-500/10
              dark:text-red-300
            "
          >

            {error}

          </div>

        )}


        {/* =================================================
            FILTER CARD
        ================================================= */}

        <div
          className="
            relative
            z-30
            overflow-visible
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >

          <div
            className="
              relative
              z-30
              overflow-visible
              p-5
            "
          >

            <FailedReportsFilters
              filters={filters}
              setFilters={setFilters}
              onFilter={handleFilter}
              onReset={handleReset}
            />

          </div>

        </div>


        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div
          className="
            relative
            z-10
            mt-4
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >


          {/* TOOLBAR */}

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-slate-200
              px-4
              py-4
              lg:flex-row
              lg:items-center
              lg:justify-between
              dark:border-slate-800
            "
          >

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-1
                overflow-hidden
                rounded-lg
                bg-slate-100
                p-1
                dark:bg-slate-800
              "
            >


              {/* COPY */}

              <button
                type="button"
                onClick={handleCopy}
                disabled={
                  loading ||
                  !data.length
                }
                className="
                  rounded-md
                  px-4
                  py-2
                  text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:text-slate-200
                  dark:hover:bg-slate-700
                "
              >

                Copy

              </button>


              {/* CSV */}

              <button
                type="button"
                onClick={
                  handleCSVExport
                }
                disabled={
                  exporting ||
                  loading ||
                  !data.length
                }
                className="
                  rounded-md
                  px-4
                  py-2
                  text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:text-slate-200
                  dark:hover:bg-slate-700
                "
              >

                {exporting
                  ? "Exporting..."
                  : "CSV"}

              </button>


              {/* EXCEL */}

              <button
                type="button"
                onClick={
                  handleExcelExport
                }
                disabled={
                  exporting ||
                  loading ||
                  !data.length
                }
                className="
                  rounded-md
                  px-4
                  py-2
                  text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:text-slate-200
                  dark:hover:bg-slate-700
                "
              >

                Excel

              </button>


              {/* PDF */}

              <button
                type="button"
                onClick={
                  handlePDFExport
                }
                disabled={
                  exporting ||
                  loading ||
                  !data.length
                }
                className="
                  rounded-md
                  px-4
                  py-2
                  text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:text-slate-200
                  dark:hover:bg-slate-700
                "
              >

                PDF

              </button>


              {/* PRINT */}

              <button
                type="button"
                onClick={
                  handlePrint
                }
                disabled={
                  loading ||
                  !data.length
                }
                className="
                  rounded-md
                  px-4
                  py-2
                  text-sm
                  text-slate-700
                  transition
                  hover:bg-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  dark:text-slate-200
                  dark:hover:bg-slate-700
                "
              >

                Print

              </button>

            </div>


            {/* COUNT */}

            <span
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >

              {Number(
                count
              ).toLocaleString(
                "en-IN"
              )}

              {" "}

              {grouped
                ? "groups"
                : "records"}

            </span>

          </div>


          {/* GROUPED INFO */}

          {grouped && (

            <div
              className="
                border-b
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                text-slate-600
                dark:border-slate-800
                dark:bg-slate-950
                dark:text-slate-300
              "
            >

              Grouped By:

              {" "}

              <span
                className="
                  font-semibold
                "
              >

                {selectedGroupLabels.join(
                  " + "
                )}

              </span>

            </div>

          )}


          {/* TABLE */}

          <FailedReportsTable
            loading={loading}
            data={data}
            grouped={grouped}
            groupBy={
              filters.groupBy || []
            }
          />


          {/* PAGINATION */}

          <div
            className="
              border-t
              border-slate-200
              p-4
              dark:border-slate-800
            "
          >

            <FailedReportsPagination
              page={page}
              setPage={setPage}
              count={count}
              pageSize={pageSize}
              setPageSize={
                handlePageSize
              }
            />

          </div>

        </div>

      </div>

    </div>

  );

}


/* =========================================================
   GROUPED VALUE
========================================================= */

function getGroupedValue(
  row,
  group
) {

  switch (
    String(group)
  ) {

    /* Carrier */

    case "1":

      return (
        row?.carrier ??
        "-"
      );


    /* Cause */

    case "2":

      return (
        row?.cause ??
        "-"
      );


    /* Number */

    case "3":

      return (
        row?.number ??
        "-"
      );


    /* CLI */

    case "4":

      return (
        row?.cli ??
        "-"
      );


    /* IP */

    case "5":

      return (
        row?.ip ??
        "-"
      );


    /* Date */

    case "6":

      return (
        row?.date ??
        "-"
      );


    /* Hour */

    case "7":

      return (
        row?.hour ??
        "-"
      );


    default:

      return "-";

  }

}


/* =========================================================
   DOWNLOAD BLOB
========================================================= */

function downloadBlob(
  blob,
  filename
) {

  const url =
    window.URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href = url;

  link.download = filename;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  window.URL.revokeObjectURL(
    url
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}