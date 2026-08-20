import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";


const OPTIONS = [
  25,
  50,
  100,
  500,
  "all",
];


export default function FailedReportsPagination({
  page,
  setPage,
  count,
  pageSize = 25,
  setPageSize,
}) {

  const totalPages =
    pageSize === "all"
      ? 1
      : Math.max(
          1,
          Math.ceil(
            Number(count || 0) /
            Number(pageSize || 25)
          )
        );

  const currentPage =
    Math.min(
      Math.max(
        Number(page) || 1,
        1
      ),
      totalPages
    );


  const changeSize = (
    event
  ) => {

    const value =
      event.target.value === "all"
        ? "all"
        : Number(
            event.target.value
          );

    setPageSize(value);
    setPage(1);

  };


  return (

    <div className="
      flex
      flex-col
      gap-4
      sm:flex-row
      sm:items-center
      sm:justify-between
    ">

      <div className="
        flex
        items-center
        gap-2
        text-sm
        text-slate-500
      ">

        <span>
          Show
        </span>

        <select
          value={pageSize}
          onChange={changeSize}
          className="
            h-9
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            text-sm
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-slate-200
          "
        >

          {OPTIONS.map(
            (option) => (

              <option
                key={option}
                value={option}
              >

                {option === "all"
                  ? "All"
                  : option}

              </option>

            )
          )}

        </select>

        <span>
          entries
        </span>

      </div>


      {totalPages > 1 && (

        <div className="
          flex
          items-center
          gap-1
        ">

          <Button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setPage(1)
            }
          >
            <ChevronsLeft size={16} />
          </Button>

          <Button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setPage(
                currentPage - 1
              )
            }
          >
            <ChevronLeft size={16} />
          </Button>

          {getPages(
            currentPage,
            totalPages
          ).map(
            (item, index) =>
              item === "..."
                ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 text-slate-400"
                  >
                    ...
                  </span>
                )
                : (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setPage(item)
                    }
                    className={`
                      h-8
                      min-w-8
                      rounded-lg
                      px-2
                      text-sm
                      ${
                        item === currentPage
                          ? "bg-sky-500 text-white"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    {item}
                  </button>
                )
          )}

          <Button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setPage(
                currentPage + 1
              )
            }
          >
            <ChevronRight size={16} />
          </Button>

          <Button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setPage(totalPages)
            }
          >
            <ChevronsRight size={16} />
          </Button>

        </div>

      )}

    </div>

  );

}


function Button({
  children,
  disabled,
  onClick,
}) {

  return (

    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="
        flex
        h-8
        min-w-8
        items-center
        justify-center
        rounded-lg
        border
        border-slate-200
        bg-white
        text-slate-600
        hover:bg-slate-50
        disabled:opacity-40
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-300
      "
    >

      {children}

    </button>

  );

}


function getPages(
  current,
  total
) {

  if (total <= 7) {

    return Array.from(
      { length: total },
      (_, index) =>
        index + 1
    );

  }

  if (current <= 4) {

    return [
      1, 2, 3, 4, 5,
      "...",
      total,
    ];

  }

  if (
    current >=
    total - 3
  ) {

    return [
      1,
      "...",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total,
    ];

  }

  return [
    1,
    "...",
    current - 1,
    current,
    current + 1,
    "...",
    total,
  ];

}