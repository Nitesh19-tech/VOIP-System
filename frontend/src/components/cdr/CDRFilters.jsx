import { Search, RotateCcw } from "lucide-react";

export default function CDRFilters({
  filters,
  setFilters,
  onRefresh,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 p-4">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

        <input
          type="text"
          placeholder="Search Number..."
          value={filters.search}
          onChange={(e) =>
            setFilters({
              ...filters,
              search: e.target.value,
            })
          }
          className="border rounded-lg px-3 py-2 dark:bg-slate-800"
        />

        <input
          type="date"
          value={filters.from}
          onChange={(e) =>
            setFilters({
              ...filters,
              from: e.target.value,
            })
          }
          className="border rounded-lg px-3 py-2 dark:bg-slate-800"
        />

        <input
          type="date"
          value={filters.to}
          onChange={(e) =>
            setFilters({
              ...filters,
              to: e.target.value,
            })
          }
          className="border rounded-lg px-3 py-2 dark:bg-slate-800"
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,
              status: e.target.value,
            })
          }
          className="border rounded-lg px-3 py-2 dark:bg-slate-800"
        >
          <option value="">All Status</option>
          <option>ANSWERED</option>
          <option>BUSY</option>
          <option>FAILED</option>
          <option>NO ANSWER</option>
        </select>

        <button
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Search
        </button>

        <button
          onClick={() =>
            setFilters({
              search: "",
              from: "",
              to: "",
              status: "",
            })
          }
          className="border rounded-lg flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>

      </div>
    </div>
  );
}