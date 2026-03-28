"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import logo from "../../../public/image/SociyoLogo.png";
import Image from "next/image";

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
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-6 py-12">
      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] w-full max-w-[450px] border border-gray-100 transition-all">
        
        {/* Logo Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#1A1A1A] p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform">
              <Image 
              src={logo} 
              alt="Sociyo Logo" 
              width={80} 
              height={80} 
              className="object-contain md:w-[92px] md:h-[92px]"
            />
          </div>
        </div>

        {/* Header text */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-tight italic">CMS PLATFORM</h1>
          <p className="text-gray-400 mt-2 text-sm md:text-[15px] font-medium">Please enter your credentials to manage content.</p>
        </div>

        <form onSubmit={login} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Username or Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-4 rounded-xl border border-gray-100 bg-gray-50/50 text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all text-[15px]"
              placeholder="admin@yourcms.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-4 rounded-xl border border-gray-100 bg-gray-50/50 text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all text-[15px]"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              disabled={loading}
              className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 transition-all active:scale-[0.97] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating...</span>
                </>
              ) : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center border-t border-gray-50 pt-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-300">Secure Admin Access</span>
        </div>
      </div>
    </div>
  );
}