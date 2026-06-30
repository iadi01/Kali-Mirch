"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login, signup, user } = useApp();
  const router = useRouter();

  const [mode, setMode] = useState<"SIGNIN" | "SIGNUP">("SIGNIN");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (mode === "SIGNIN") {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Authentication failed.");
      }
    } else {
      const res = await signup(name, email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || "Registration failed.");
      }
    }
  };

  // Redirect on user state change
  React.useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  return (
    <div className="w-full min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-zinc-800 font-sans">
      <div className="glass-premium max-w-md w-full p-8 space-y-6 shadow-md">
        {/* Toggle Mode header */}
        <div className="flex border-b border-zinc-150 pb-2 gap-6">
          <button
            onClick={() => { setMode("SIGNIN"); setErrorMsg(""); }}
            className={`text-xs tracking-widest uppercase pb-2 transition-colors font-bold ${
              mode === "SIGNIN"
                ? "text-gold-600 border-b-2 border-gold-500"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("SIGNUP"); setErrorMsg(""); }}
            className={`text-xs tracking-widest uppercase pb-2 transition-colors font-bold ${
              mode === "SIGNUP"
                ? "text-gold-600 border-b-2 border-gold-500"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 uppercase tracking-wider">
            {mode === "SIGNUP" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-zinc-500 text-xs">
            {mode === "SIGNUP" 
              ? "Join the Kali Mirch rewards system to earn loyalty points." 
              : "Access your dashboard, reservations, and orders."}
          </p>
        </div>

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex gap-2 items-center font-bold animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "SIGNUP" && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alexander Vane"
                className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-850 placeholder-zinc-400 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@vane.com"
              className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-850 placeholder-zinc-400 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-850 placeholder-zinc-400 rounded-lg focus:border-gold-500/50 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white py-3 text-xs tracking-widest uppercase font-bold rounded-full transition-all shadow-lg shadow-gold-500/10 mt-6"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === "SIGNUP" ? (
              <>
                <UserPlus className="h-4 w-4" />
                Register Account
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
