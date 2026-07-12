import { X } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
};

const formatDuration = (seconds = 0) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};

export default function CDRDetailsModal({
  open,
  onClose,
  call,
}) {
  if (!open || !call) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="w-full max-w-3xl rounded-xl bg-white dark:bg-slate-900 shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-bold">
            Call Details
          </h2>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-6 p-6">

          <Item label="Caller" value={call.caller_number} />
          <Item label="Receiver" value={call.receiver_number} />

          <Item
            label="Start Time"
            value={formatDate(call.start_time)}
          />

          <Item
            label="Answer Time"
            value={formatDate(call.answer_time)}
          />

          <Item
            label="End Time"
            value={formatDate(call.end_time)}
          />

          <Item
            label="Duration"
            value={formatDuration(call.duration)}
          />

          <Item
            label="Talk Time"
            value={formatDuration(call.billsec)}
          />

          <Item
            label="Status"
            value={call.disposition}
          />

          <Item
            label="Channel"
            value={call.channel}
          />

          <Item
            label="Destination Channel"
            value={call.destination_channel}
          />

          <Item
            label="Context"
            value={call.context}
          />

          <Item
            label="Application"
            value={call.application}
          />

        </div>

      </div>

    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold break-all">
        {value || "-"}
      </p>
    </div>
  );
}