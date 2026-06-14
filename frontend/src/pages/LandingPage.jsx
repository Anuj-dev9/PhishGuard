import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Lock, Eye } from 'lucide-react';
import { Button, Card } from '../components/ui';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 md:p-12 text-center gap-8 py-24">
      {/* Background decoration removed for flat look */}

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
          <Shield className="text-white w-7 h-7" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">PhishGuard AI</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
        AI-Powered Phishing Detection
      </h1>
      
      <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
        Empowering security analysts with state-of-the-art AI to identify, simulate, and analyze threats before they compromise your data.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button 
          variant="primary" 
          className="px-10 py-4 text-lg flex items-center gap-2"
          onClick={() => navigate('/simulate')}
        >
          Start Simulation <ArrowRight size={20} />
        </Button>
        <Button 
          variant="outline" 
          className="px-10 py-4 text-lg"
          onClick={() => navigate('/analyze')}
        >
          Analyze URL
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-12">
        <Card className="flex flex-col items-center text-center p-10">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700">
            <Zap className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Real-time Analysis</h3>
          <p className="text-base text-slate-400 leading-relaxed">Scan suspicious emails and links instantly with our advanced ML models.</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-10">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700">
            <Lock className="text-success" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Secure Simulation</h3>
          <p className="text-base text-slate-400 leading-relaxed">Conduct ethical phishing simulations to train and test user awareness safely.</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-10">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700">
            <Eye className="text-warning" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Explainable AI</h3>
          <p className="text-base text-slate-400 leading-relaxed">Get detailed insights into why content was flagged with clear risk assessments.</p>
        </Card>
      </div>
    </div>
  );
}
