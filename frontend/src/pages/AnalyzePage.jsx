import React, { useState } from 'react';
import { Search, Loader2, ShieldCheck, ShieldAlert, ChevronRight, Info } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { scanContent } from '../services/api';

export default function AnalyzePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      // Reusing the scanContent function from api service
      const analysis = await scanContent({ text: url, type: 'link' });
      setResult(analysis);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-white">AI Threat Analysis</h1>
        <p className="text-slate-400 mt-1">Deep-scan URLs and domains for phishing signatures.</p>
      </div>

      <Card className="p-1">
        <form onSubmit={handleAnalyze} className="flex gap-2">
          <div className="relative flex-1">
            <input 
              className="w-full bg-transparent border-none px-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
              placeholder="Enter URL or domain to analyze (e.g., http://login-verify.xyz)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="px-8" disabled={loading || !url.trim()}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Analyze"}
          </Button>
        </form>
      </Card>

      {error && (
        <div className="bg-danger/10 border border-danger/20 p-4 rounded-xl text-danger text-sm font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
          <Card className={`lg:col-span-1 flex flex-col items-center justify-center text-center p-10 border-2 ${
            result.result === 'Phishing' ? 'border-danger/30 bg-danger/5' : 'border-success/30 bg-success/5'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              result.result === 'Phishing' ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'
            }`}>
              {result.result === 'Phishing' ? <ShieldAlert size={40} /> : <ShieldCheck size={40} />}
            </div>
            <h2 className={`text-3xl font-black uppercase tracking-tighter ${
              result.result === 'Phishing' ? 'text-danger' : 'text-success'
            }`}>
              {result.result}
            </h2>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Level</span>
              <span className={`text-lg font-bold ${
                result.severity === 'High' ? 'text-danger' : result.severity === 'Medium' ? 'text-warning' : 'text-success'
              }`}>{result.severity}</span>
            </div>
            <div className="mt-6 w-full pt-6 border-t border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-400">ML Confidence</span>
                <span className="text-sm font-bold text-white">{result.score}%</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    result.result === 'Phishing' ? 'bg-danger' : 'bg-success'
                  }`} 
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-10 md:p-12">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Info size={20} className="text-primary" />
              Analysis Signals
            </h3>
            
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Detected Patterns</span>
                <div className="flex flex-wrap gap-2">
                  {result.signals?.length > 0 ? result.signals.map((signal, idx) => (
                    <span key={idx} className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300">
                      {signal}
                    </span>
                  )) : (
                    <span className="text-sm text-slate-500 italic">No suspicious patterns detected.</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Recommendation</span>
                <p className="text-slate-300 text-sm bg-slate-800 p-4 rounded-xl border border-slate-800 italic">
                  "{result.recommendation}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Scanner Engine</span>
                  <span className="text-slate-300 font-medium">{result.model?.name}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search size={32} />
          </div>
          <p className="text-slate-400 font-medium italic">Enter a URL above to begin high-speed AI analysis</p>
        </div>
      )}
    </div>
  );
}
