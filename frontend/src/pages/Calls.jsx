import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";

import { getDashboardActiveCalls } from "../services/stats";

export default function Calls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCalls = async () => {
    try {
      setLoading(true);

      const res = await getDashboardActiveCalls();

      setCalls(res.data);

    } catch (err) {
      console.error(err);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();

    const timer = setInterval(loadCalls, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center gap-3">

        <PhoneCall
          size={28}
          className="text-sky-500"
        />

        <div>

          <h1 className="text-3xl font-bold">
            Active Calls
          </h1>

          <p className="text-slate-500">
            Live calls from Asterisk
          </p>

        </div>

      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100 dark:bg-slate-800">

            <tr>

              <th className="px-5 py-3 text-left">
                Extension
              </th>

              <th className="px-5 py-3 text-left">
                Connected To
              </th>

              <th className="px-5 py-3 text-left">
                State
              </th>

              <th className="px-5 py-3 text-left">
                Application
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="4"
                  className="text-center py-10"
                >
                  Loading...
                </td>

              </tr>

            ) : calls.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="text-center py-10"
                >
                  No Active Calls
                </td>

              </tr>

            ) : (

              calls.map((call, index) => (

                <tr
                  key={index}
                  className="border-t border-slate-200 dark:border-slate-800"
                >

                  <td className="px-5 py-4">
                    {call.extension}
                  </td>

                  <td className="px-5 py-4">
                    {call.connected_to}
                  </td>

                  <td className="px-5 py-4">
                    {call.state}
                  </td>

                  <td className="px-5 py-4">
                    {call.application}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}