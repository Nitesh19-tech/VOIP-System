import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";

import {
  getCDR,
  exportCDR,
} from "../../services/cdrService";

import CDRFilters from "../../components/cdr/CDRFilters";
import CDRTable from "../../components/cdr/CDRTable";
import CDRPagination from "../../components/cdr/CDRPagination";
import CDRDetailsModal from "../../components/cdr/CDRDetailsModal";

export default function CDRPage() {
  const [loading, setLoading] = useState(true);

  const [cdr, setCdr] = useState([]);

  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);

  const [selectedCall, setSelectedCall] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    from: "",
    to: "",
    status: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getCDR({
        page,
        search: filters.search,
        start_date: filters.from,
        end_date: filters.to,
        disposition: filters.status,
      });

      setCdr(res.data.results);
      setCount(res.data.count);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportCDR({
        search: filters.search,
        start_date: filters.from,
        end_date: filters.to,
        disposition: filters.status,
      });

      const blob = new Blob([res.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "cdr_export.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Export failed", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Call Detail Records
          </h1>

          <p className="text-slate-500">
            Total Records : {count}
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <Download size={18} />
            Export CSV
          </button>

        </div>

      </div>

      <CDRFilters
        filters={filters}
        setFilters={setFilters}
        onRefresh={() => {
          setPage(1);
          loadData();
        }}
      />

      <CDRTable
        loading={loading}
        data={cdr}
        onView={(call) => {
          setSelectedCall(call);
          setOpenModal(true);
        }}
      />

      <CDRPagination
        page={page}
        setPage={setPage}
        count={count}
      />

      <CDRDetailsModal
        open={openModal}
        call={selectedCall}
        onClose={() => setOpenModal(false)}
      />

    </div>
  );
}