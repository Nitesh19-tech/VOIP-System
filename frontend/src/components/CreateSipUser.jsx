import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { createSipUser } from "../services/sip";

export default function CreateSipUser({ onCreated }) {
  const [extension, setExtension] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!extension || !secret) return alert("All fields required");

    try {
      setLoading(true);
      await createSipUser({ extension, secret });
      setExtension("");
      setSecret("");
      onCreated();
    } catch {
      alert("Failed to create SIP user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardCard className="p-6">
      <div className="flex items-center gap-2 mb-4 text-white">
        <UserPlus size={18} />
        <h3 className="font-semibold">Create SIP User</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={extension}
          onChange={e => setExtension(e.target.value)}
          placeholder="Extension (e.g. 3001)"
          className="input"
        />
        <input
          value={secret}
          onChange={e => setSecret(e.target.value)}
          placeholder="Secret (password)"
          className="input"
        />
        <button
          onClick={submit}
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Create
        </button>
      </div>
    </DashboardCard>
  );
}
