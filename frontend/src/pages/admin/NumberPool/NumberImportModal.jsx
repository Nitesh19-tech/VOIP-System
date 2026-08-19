import { useEffect, useState } from "react";

import {
  X,
  Upload,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

import numberPoolService from "../../../services/numberPoolService";
import clientService from "../../../services/clientService";
import { getTerminations } from "../../../services/terminationService";

export default function NumberImportModal({
  open,
  onClose,
  onSuccess,
  carriers = [],
}) {
  const [file, setFile] = useState(null);
  const [carrier, setCarrier] = useState("");
  const [termination, setTermination] = useState("");
  const [client, setClient] = useState("");
  const [numberService, setNumberService] = useState("");
  const [serviceVariables, setServiceVariables] = useState("");
  const [isTestNumber, setIsTestNumber] = useState(false);
  const [dailyMaxCall, setDailyMaxCall] = useState(0);
  const [dailyMaxDuration, setDailyMaxDuration] = useState(0);

  const [clients, setClients] = useState([]);
  const [terminations, setTerminations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }

    loadFormData();
  }, [open]);

  const resetForm = () => {
    setFile(null);
    setCarrier("");
    setTermination("");
    setClient("");
    setNumberService("");
    setServiceVariables("");
    setIsTestNumber(false);
    setDailyMaxCall(0);
    setDailyMaxDuration(0);
    setImporting(false);
  };

  const loadFormData = async () => {
    try {
      setLoadingData(true);

      const [clientResponse, terminationResponse] =
        await Promise.all([
          clientService.getClients(),
          getTerminations({ is_active: true }),
        ]);

      const clientData =
        clientResponse?.data?.data ||
        clientResponse?.data?.results ||
        [];

      const terminationData =
        terminationResponse?.data?.data ||
        terminationResponse?.data?.results ||
        [];

      setClients(Array.isArray(clientData) ? clientData : []);
      setTerminations(
        Array.isArray(terminationData) ? terminationData : []
      );
    } catch (error) {
      console.error("Unable to load import form data:", error);
      setClients([]);
      setTerminations([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleClose = () => {
    if (importing) return;
    onClose();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const fileName = selectedFile.name.toLowerCase();

    if (
      !allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
      )
    ) {
      alert("Please select a CSV, XLSX or XLS file.");
      event.target.value = "";
      setFile(null);
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert("File size must be less than 20 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select a CSV or Excel file.");
      return;
    }

    if (!carrier) {
      alert("Please select a carrier.");
      return;
    }

    try {
      setImporting(true);

      // IMPORTANT:
      // These field names match the backend import payload:
      // carrier, termination, client, number_service,
      // service_variables, set_test_number, daily_max_call,
      // daily_max_duration and file.
      const data = {
        file,
        carrier: Number(carrier),
        termination: termination
          ? Number(termination)
          : "",
        client: client
          ? Number(client)
          : "",
        number_service: numberService,
        service_variables: serviceVariables,
        set_test_number: isTestNumber,
        daily_max_call: Number(dailyMaxCall) || 0,
        daily_max_duration: Number(dailyMaxDuration) || 0,
      };

      console.log("Import Number Data:", {
        file: file.name,
        carrier: data.carrier,
        termination: data.termination,
        client: data.client,
        number_service: data.number_service,
        service_variables: data.service_variables,
        set_test_number: data.set_test_number,
        daily_max_call: data.daily_max_call,
        daily_max_duration: data.daily_max_duration,
      });

      const response =
        await numberPoolService.importNumbers(data);

      const responseData = response.data || {};
      const result =
        responseData.data ||
        responseData.result ||
        responseData;

      const imported = Number(result?.imported) || 0;
      const duplicates = Number(result?.duplicates) || 0;
      const invalid = Number(result?.invalid) || 0;
      const skipped = Number(result?.skipped) || 0;

      alert(
        `Import Completed\n\n` +
        `Imported  : ${imported}\n` +
        `Duplicate : ${duplicates}\n` +
        `Invalid   : ${invalid}\n` +
        `Skipped   : ${skipped}`
      );

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Number Import Error:", error);
      console.error(
        "Import Response:",
        error.response?.data
      );

      const errorData = error.response?.data;

      let message = "Import failed.";

      if (errorData?.message) {
        message = errorData.message;
      } else if (errorData?.detail) {
        message = errorData.detail;
      } else if (errorData?.error) {
        message = errorData.error;
      } else if (typeof errorData === "string") {
        message = errorData;
      }

      alert(message);
    } finally {
      setImporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-7 py-5 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Upload size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Upload Numbers
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Import DID numbers from CSV or Excel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={importing}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto px-7 py-7">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

            {/* LEFT */}
            <div className="space-y-6">

              {/* CARRIER */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Select Carrier <span className="text-red-500">*</span>
                </label>

                <select
                  value={carrier}
                  onChange={(e) => {
                    setCarrier(e.target.value);
                    setTermination("");
                  }}
                  disabled={importing || loadingData}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">Please Select</option>

                  {carriers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* TERMINATION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Termination
                </label>

                <select
                  value={termination}
                  onChange={(e) => setTermination(e.target.value)}
                  disabled={importing || loadingData}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">No Termination</option>

                  {terminations
                    .filter(
                      (item) =>
                        !carrier ||
                        String(item.carrier) === String(carrier) ||
                        String(item.carrier_id) === String(carrier)
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* CLIENT */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Client <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <select
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  disabled={importing || loadingData}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">No Client / Available</option>

                  {clients.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* FILE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Upload CSV / Excel <span className="text-red-500">*</span>
                </label>

                <label className="flex min-h-[115px] cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-5 transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-emerald-500">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <FileSpreadsheet size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    {file ? (
                      <>
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                          Click to select file
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          CSV, XLSX or XLS • Max 20 MB
                        </p>
                      </>
                    )}
                  </div>

                  <input
                    type="file"
                    hidden
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={importing}
                  />
                </label>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* NUMBER SERVICE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Numbers Service
                </label>

                <select
                  value={numberService}
                  onChange={(e) => setNumberService(e.target.value)}
                  disabled={importing}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">Select Service</option>
                  <option value="ConferenceCut">ConferenceCut</option>
                  <option value="Playback">Playback</option>
                  <option value="PlaybackLoop">PlaybackLoop</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>

              {/* SERVICE VARIABLES */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Service Variables
                </label>

                <textarea
                  value={serviceVariables}
                  onChange={(e) => setServiceVariables(e.target.value)}
                  disabled={importing}
                  rows={4}
                  placeholder='Optional JSON, e.g. {"file":"welcome"}'
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Leave blank if the selected service does not require variables.
                </p>
              </div>

              {/* TEST NUMBER */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Make 1 Test Number
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isTestNumber}
                    onChange={(e) => setIsTestNumber(e.target.checked)}
                    disabled={importing}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Yes
                </label>
              </div>

              {/* MAX CALL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Maximum Calls in Day
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={dailyMaxCall}
                  onChange={(e) => setDailyMaxCall(e.target.value)}
                  disabled={importing}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* MAX DURATION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Maximum Duration in Day{" "}
                  <span className="font-normal text-slate-400">(Seconds)</span>
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={dailyMaxDuration}
                  onChange={(e) => setDailyMaxDuration(e.target.value)}
                  disabled={importing}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - ALWAYS VISIBLE */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200 bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={handleClose}
            disabled={importing}
            className="min-w-[95px] rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={
              importing ||
              loadingData ||
              !file ||
              !carrier
            }
            className="flex min-w-[105px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload size={18} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}