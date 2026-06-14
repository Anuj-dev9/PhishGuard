import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeySquare, Loader2, CheckCircle2 } from "lucide-react";
import { resetPassword } from "../services/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Please enter a new password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. The token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0a0a0b] text-white p-4">
      <div className="w-full max-w-lg bg-[#111113] border border-white/10 rounded-2xl shadow-xl p-10 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
            <KeySquare size={28} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
          <p className="text-slate-400">Enter a new secure password for your account.</p>
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
              <p className="text-success font-medium">Password Reset Successfully!</p>
              <p className="text-sm text-success/80">Redirecting to sign in...</p>
            </div>
            
            <Link to="/signin" className="w-full inline-block bg-[#1a1a1d] hover:bg-white/5 border border-white/10 text-white font-medium py-3 rounded-lg transition-colors mt-2">
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1d] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                disabled={!token}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !token}
              className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
            
            <div className="mt-4 text-center">
              <Link to="/signin" className="text-sm text-slate-400 hover:text-white transition-colors">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
