import React, { useEffect, useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { getLogs } from "../services/api";

export default function ReportsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getLogs();
        setLogs(data || []);
      } catch (error) {
        console.error("Failed to load logs", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Analysis Reports</h1>
        <p className="text-slate-400 mt-1">A complete history of all scanned content and their results.</p>
      </div>

      <div className="bg-[#111113] border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-primary" size={24} />
            Scan History
          </h2>
          {loading && <Loader2 className="animate-spin text-primary" size={20} />}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1d] text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Result</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider">
                      {log.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        log.result === 'Phishing' ? 'bg-danger/20 text-danger' : 
                        log.result === 'Suspicious' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {log.score}/100
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[400px] truncate text-slate-400" title={log.input}>
                        {log.input}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                    {loading ? "Loading logs..." : "No scans performed yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
