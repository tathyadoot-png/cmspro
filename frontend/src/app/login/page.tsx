"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      await fetchUser();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[450px] border border-gray-100">
        
        {/* Logo Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#1A1A1A] p-4 rounded-2xl shadow-lg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Header text */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">CMS Platform</h1>
          <p className="text-gray-400 mt-2 text-[15px]">Please enter your credentials to manage content.</p>
        </div>

        <form onSubmit={login} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Username or Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-gray-50/50 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              placeholder="admin@yourcms.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            {/* <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-[#1A1A1A]">Password</label>
              <button type="button" className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
                Forgot Password?
              </button>
            </div> */}
            <input
              type="password"
              required
              className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-gray-50/50 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* <div className="flex items-center py-2">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500 cursor-pointer" />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-500 cursor-pointer">Remember me for 30 days</label>
          </div> */}

          <button
            disabled={loading}
            className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Secure Admin Access</span>
        </div>
      </div>
    </div>
  );
}