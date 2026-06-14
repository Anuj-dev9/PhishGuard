import { useState } from "react";
import { Shield, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { login, register } from "../services/api";
import { Button, Card, Input } from "./ui";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const session =
        mode === "login"
          ? await login({ email: form.email, password: form.password })
          : await register(form);
      onAuth(session);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] -z-10" />
      
      <Card className="max-w-md w-full p-8 md:p-10 border-slate-700">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/30">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {mode === "login" ? "Sign in to your analyst dashboard" : "Join the PhishGuard security network"}
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5">
          {mode === "register" && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-[38px] text-slate-500" size={18} />
              <Input 
                label="Full Name"
                className="pl-12"
                placeholder="Alex Thompson"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-[38px] text-slate-500" size={18} />
            <Input 
              label="Email Address"
              className="pl-12"
              type="email"
              placeholder="alex@company.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-[38px] text-slate-500" size={18} />
            <Input 
              label="Password"
              className="pl-12"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 mt-2 flex items-center justify-center" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm">
            <span className="text-slate-500">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button 
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary font-bold hover:underline"
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
