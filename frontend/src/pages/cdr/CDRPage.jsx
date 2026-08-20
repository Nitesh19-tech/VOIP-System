import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  FileText,
  Filter,
  RefreshCw,
} from "lucide-react";

import {
  getCDR,
  exportCDR,
} from "../../services/cdrService";

import CDRFilters from "../../components/cdr/CDRFilters";
import CDRTable from "../../components/cdr/CDRTable";
import CDRPagination from "../../components/cdr/CDRPagination";
import CDRDetailsModal from "../../components/cdr/CDRDetailsModal";


const INITIAL_FILTERS = {
  from: "",
  to: "",
  carrier: "",
  termination: "",
  number: "",
  manager: "",
  client: "",
  cli: "",
  group_by: "",
  search: "",
  status: "",
};


export default function CDRPage() {

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [cdr, setCdr] = useState([]);
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [filters, setFilters] =
    useState(INITIAL_FILTERS);

  const [selectedCall, setSelectedCall] =
    useState(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [error, setError] = useState("");


  // =====================================================
  // BUILD API PARAMS
  // =====================================================

  const buildParams = useCallback(
    (
      requestedPage,
      requestedPageSize,
      requestedFilters
    ) => {

      const params = {
        page: requestedPage,
        page_size: requestedPageSize,

        start_date:
          requestedFilters.from || "",

        end_date:
          requestedFilters.to || "",

        search:
          requestedFilters.search ||
          requestedFilters.number ||
          "",

        disposition:
          requestedFilters.status || "",

        carrier:
          requestedFilters.carrier || "",

        termination:
          requestedFilters.termination || "",

        number:
          requestedFilters.number || "",

        manager:
          requestedFilters.manager || "",

        client:
          requestedFilters.client || "",

        cli:
          requestedFilters.cli || "",

        group_by:
          requestedFilters.group_by || "",
      };

      return Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) =>
            value !== "" &&
            value !== null &&
            value !== undefined
        )
      );

    },
    []
  );


  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = useCallback(
    async (
      requestedPage = page,
      requestedPageSize = pageSize,
      requestedFilters = filters
    ) => {

      try {

        setLoading(true);
        setError("");

        const params = buildParams(
          requestedPage,
          requestedPageSize,
          requestedFilters
        );

        const response =
          await getCDR(params);

        const data =
          response?.data || {};

        const rows =
          Array.isArray(data.results)
            ? data.results
            : Array.isArray(data.data)
              ? data.data
              : [];

        const total =
          Number(
            data.count ??
            data.pagination?.count ??
            rows.length
          );

        setCdr(rows);
        setCount(total);

      } catch (err) {

        console.error(
          "CDR Load Error:",
          err
        );

        setCdr([]);
        setCount(0);

        setError(
          getErrorMessage(
            err,
            "Unable to load CDR records."
          )
        );

      } finally {

        setLoading(false);

      }

    },
    [
      page,
      pageSize,
      filters,
      buildParams,
    ]
  );


  // =====================================================
  // PAGE / PAGE SIZE
  // =====================================================

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


  // =====================================================
  // FILTER
  // =====================================================

  const handleFilter = () => {

    setPage(1);

    loadData(
      1,
      pageSize,
      filters
    );

  };


  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {

    const resetFilters = {
      ...INITIAL_FILTERS,
    };

    setFilters(resetFilters);
    setPage(1);

    loadData(
      1,
      pageSize,
      resetFilters
    );

  };


  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = () => {

    loadData(
      page,
      pageSize,
      filters
    );

  };


  // =====================================================
  // EXPORT CSV
  // =====================================================

  const handleExport = async () => {

    try {

      setExporting(true);
      setError("");

      const params =
        buildParams(
          1,
          "all",
          filters
        );

      const response =
        await exportCDR(params);

      const blob =
        response?.data instanceof Blob
          ? response.data
          : new Blob(
              [response?.data],
              {
                type:
                  "text/csv;charset=utf-8;",
              }
            );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `cdr_export_${getDateStamp()}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.error(
        "CDR Export Error:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to export CDR records."
        )
      );

    } finally {

      setExporting(false);

    }

  };


  // =====================================================
  // PAGE SIZE
  // =====================================================

  const handlePageSizeChange = (
    value
  ) => {

    setPageSize(value);
    setPage(1);

  };


  // =====================================================
  // ACTIVE FILTER COUNT
  // =====================================================

  const activeFilterCount =
    useMemo(
      () =>
        Object.entries(filters)
          .filter(
            ([key, value]) =>
              key !== "search" &&
              value !== ""
          )
          .length,
      [filters]
    );


  return (

    <div className="
      min-h-full
      bg-slate-50
      p-2
      sm:p-4
      dark:bg-slate-950
    ">

      <div className="
        mx-auto
        max-w-[1900px]
      ">

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="
          mb-4
          flex
          items-center
          justify-between
          border-b
          border-slate-200
          pb-3
          dark:border-slate-800
        ">

          <div>

            <h1 className="
              text-xl
              font-semibold
              tracking-tight
              text-slate-800
              dark:text-white
            ">

              CDR Reports & Stats

            </h1>

            <p className="
              mt-0.5
              text-xs
              text-slate-500
              dark:text-slate-400
            ">

              Call Detail Records & reporting

            </p>

          </div>


          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
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
              font-medium
              text-slate-600
              shadow-sm
              hover:bg-slate-50
              disabled:opacity-50
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

          <div className="
            mb-4
            rounded-xl
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
          ">

            {error}

          </div>

        )}


        {/* =================================================
            FILTER AREA
        ================================================= */}

        <div className="
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        ">

          <div className="p-4">

            <CDRFilters
              filters={filters}
              setFilters={setFilters}
              onRefresh={handleFilter}
              onReset={handleReset}
              activeFilterCount={
                activeFilterCount
              }
            />

          </div>

        </div>


        {/* =================================================
            REPORT TABLE
        ================================================= */}

        <div className="
          mt-4
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        ">

          {/* TOOLBAR */}

          <div className="
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
          ">

            <div className="
              flex
              flex-wrap
              items-center
              gap-2
            ">

              <span className="
                text-sm
                font-medium
                text-slate-500
              ">

                {formatNumber(count)}
                {" "}
                records

              </span>


              <button
                type="button"
                onClick={() =>
                  copyTableData(cdr)
                }
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-600
                  hover:bg-slate-100
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-slate-300
                "
              >

                Copy

              </button>


              <button
                type="button"
                onClick={handleExport}
                disabled={exporting}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-amber-400
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-amber-500
                  disabled:opacity-50
                "
              >

                {exporting
                  ? "Exporting..."
                  : "CSV"}

              </button>


              <button
                type="button"
                disabled
                title="Excel export requires an Excel endpoint from the backend."
                className="
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-500
                  opacity-50
                  cursor-not-allowed
                "
              >

                Excel

              </button>


              <button
                type="button"
                disabled
                title="PDF export requires a PDF endpoint from the backend."
                className="
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-500
                  opacity-50
                  cursor-not-allowed
                "
              >

                PDF

              </button>


              <button
                type="button"
                onClick={() =>
                  window.print()
                }
                className="
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-600
                  hover:bg-slate-100
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >

                Print

              </button>

            </div>


            <div className="
              flex
              items-center
              gap-3
            ">

              <button
                type="button"
                onClick={handleRefresh}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-200
                  px-3
                  py-2
                  text-sm
                  text-slate-600
                  hover:bg-slate-50
                  dark:border-slate-700
                  dark:text-slate-300
                "
              >

                <RefreshCw
                  size={15}
                />

                Refresh

              </button>

            </div>

          </div>


          {/* TABLE */}

          <CDRTable
            loading={loading}
            data={cdr}
            onView={(call) => {

              setSelectedCall(call);
              setOpenModal(true);

            }}
          />


          {/* PAGINATION */}

          <div className="
            border-t
            border-slate-200
            p-4
            dark:border-slate-800
          ">

            <CDRPagination
              page={page}
              setPage={setPage}
              count={count}
              pageSize={pageSize}
              setPageSize={
                handlePageSizeChange
              }
            />

          </div>

        </div>

      </div>


      <CDRDetailsModal
        open={openModal}
        call={selectedCall}
        onClose={() =>
          setOpenModal(false)
        }
      />

    </div>

  );

}


// =========================================================
// HELPERS
// =========================================================

function formatNumber(value) {

  return Number(
    value || 0
  ).toLocaleString("en-IN");

}


function getDateStamp() {

  const date = new Date();

  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1
    ).padStart(2, "0"),
    String(
      date.getDate()
    ).padStart(2, "0"),
  ].join("-");

}


function getErrorMessage(
  error,
  fallback
) {

  const data =
    error?.response?.data;

  if (data?.message)
    return data.message;

  if (data?.detail)
    return data.detail;

  if (data?.error)
    return data.error;

  if (typeof data === "string")
    return data;

  if (
    data &&
    typeof data === "object"
  ) {

    for (
      const value of Object.values(data)
    ) {

      if (
        Array.isArray(value) &&
        value.length
      ) {

        return String(
          value[0]
        );

      }

      if (
        typeof value === "string"
      ) {

        return value;

      }

    }

  }

  return (
    error?.message ||
    fallback
  );

}


async function copyTableData(rows) {

  if (!rows?.length) {

    return;

  }

  const headers = [
    "Date",
    "Carrier",
    "Termination",
    "Number",
    "CLI",
    "Currency",
    "Duration",
    "Payterm",
    "Payout",
    "Client",
    "C Payterm",
    "C Payout",
    "Cause",
  ];

  const lines = [
    headers.join("\t"),
    ...rows.map(
      (row) =>
        headers.map(
          (header) =>
            getRowValue(
              row,
              header
            )
        ).join("\t")
    ),
  ];

  try {

    await navigator.clipboard.writeText(
      lines.join("\n")
    );

  } catch (error) {

    console.error(
      "Copy failed:",
      error
    );

  }

}


function getRowValue(
  row,
  column
) {

  const map = {
    Date:
      row.start_time ??
      row.date ??
      "",

    Carrier:
      row.carrier_name ??
      row.carrier ??
      "",

    Termination:
      row.termination_name ??
      row.termination ??
      "",

    Number:
      row.number ??
      row.caller_number ??
      row.receiver_number ??
      "",

    CLI:
      row.cli ??
      row.caller_number ??
      "",

    Currency:
      row.currency ??
      "",

    Duration:
      row.duration ??
      "",

    Payterm:
      row.payterm ??
      row.payment_term ??
      "",

    Payout:
      row.payout ??
      "",

    Client:
      row.client_name ??
      row.client ??
      "",

    "C Payterm":
      row.client_payterm ??
      row.c_payterm ??
      "",

    "C Payout":
      row.client_payout ??
      row.c_payout ??
      "",

    Cause:
      row.cause ??
      row.disposition ??
      "",
  };

  return String(
    map[column] ?? ""
  );

}