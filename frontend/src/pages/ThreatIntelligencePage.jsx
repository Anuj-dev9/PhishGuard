import React, { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { getAttackFeed } from "../services/api";

export default function ThreatIntelligencePage() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThreats() {
      try {
        const data = await getAttackFeed();
        setThreats(data || []);
      } catch (error) {
        console.error("Failed to load attack feed", error);
      } finally {
        setLoading(false);
      }
    }
    fetchThreats();
  }, []);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Threat Intelligence</h1>
        <p className="text-slate-400 mt-1">Live feed of confirmed phishing attempts detected across the network.</p>
      </div>

      <div className="bg-[#111113] border border-white/10 rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-danger" size={24} />
            Recent Threats
          </h2>
          {loading && <Loader2 className="animate-spin text-primary" size={20} />}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1d] text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Signals</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Input Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {threats.length > 0 ? (
                threats.map((threat) => (
                  <tr key={threat._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(threat.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider">
                      {threat.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        threat.severity === 'High' ? 'bg-danger/20 text-danger' : 
                        threat.severity === 'Medium' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                      }`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {threat.signals?.slice(0, 2).map((sig, i) => (
                          <span key={i} className="bg-[#1a1a1d] px-2 py-1 rounded text-[10px] text-slate-400 truncate max-w-full">
                            {sig}
                          </span>
                        ))}
                        {threat.signals?.length > 2 && (
                          <span className="bg-[#1a1a1d] px-2 py-1 rounded text-[10px] text-slate-400">
                            +{threat.signals.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[300px] truncate text-slate-400" title={threat.input}>
                        {threat.input}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                    {loading ? "Loading threat feed..." : "No threats detected recently."}
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
