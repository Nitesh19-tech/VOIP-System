export default function CDRPagination({
  page,
  setPage,
  count,
  pageSize = 10,
}) {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3">

      <p className="text-sm text-slate-500">
        Showing page <strong>{page}</strong> of{" "}
        <strong>{totalPages}</strong> ({count} records)
      </p>

      <div className="flex items-center gap-2">

        <button
          disabled={page === 1}
          onClick={() => setPage(1)}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          First
        </button>

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
          .map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded ${
                page === p
                  ? "bg-blue-600 text-white"
                  : "border"
              }`}
            >
              {p}
            </button>
          ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          Last
        </button>

      </div>
    </div>
  );
}