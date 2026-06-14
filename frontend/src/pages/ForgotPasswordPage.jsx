import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0a0a0b] text-white p-4">
      <div className="w-full max-w-lg bg-[#111113] border border-white/10 rounded-2xl shadow-xl p-10 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
            <KeyRound size={28} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-slate-400">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-success/10 border border-success/20 p-4 rounded-xl mb-6 flex flex-col items-center gap-3">
              <CheckCircle2 className="text-success" size={32} />
              <p className="text-success font-medium">If an account exists, a reset link has been sent to your email.</p>
            </div>
            
            <Link to="/signin" className="w-full inline-block bg-[#1a1a1d] hover:bg-white/5 border border-white/10 text-white font-medium py-3 rounded-lg transition-colors mt-2">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1d] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-6 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/signin" className="text-sm text-slate-400 hover:text-white transition-colors">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
