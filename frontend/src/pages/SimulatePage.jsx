import React, { useState } from 'react';
import { Shield, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';

export default function SimulatePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Fake simulation delay
    setTimeout(() => {
      setLoading(false);
      setResult('flagged');
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Phishing Simulation</h1>
          <p className="text-slate-400 mt-1">Test organizational awareness with ethical simulations.</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Simulation Environment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="max-w-lg w-full mx-auto lg:mx-0 p-10 md:p-12">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
              <Shield className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Continue to your secure workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input 
              label="Email Address" 
              placeholder="john@company.com" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              placeholder="••••••••" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-800" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full h-12 flex items-center justify-center" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </Button>
          </form>

          <p className="text-[10px] text-slate-600 text-center mt-6 uppercase tracking-widest font-bold">
            Controlled Security Test
          </p>
        </Card>

        <div className="flex flex-col gap-6">
          {result === 'flagged' ? (
            <Card className="border-danger/30 bg-danger/5 animate-in zoom-in-95 duration-300 p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-danger" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Compromised!</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    In a real-world scenario, the data you just entered would have been captured by attackers. 
                    This simulation highlights the risk of entering credentials on untrusted pages.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-danger" />
                      <span>Always check the URL before signing in.</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-danger" />
                      <span>Look for unexpected sender addresses.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-slate-800 border-dashed border-slate-700 flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Terminal className="text-slate-500" size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-400">Awaiting Simulation Data</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Submit the form on the left to analyze the simulation results.
              </p>
            </Card>
          )}

          <Card className="p-8 md:p-10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Why this matters</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              90% of data breaches start with a phishing email. Simulations are the most effective way to build 
              "human firewall" defense layers within an organization.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

const Terminal = ({ className, size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);
