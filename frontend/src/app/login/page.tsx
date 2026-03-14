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

  const login = async () => {

    await api.post("/auth/login", {
      email,
      password,
    });

    await fetchUser();

    router.push("/dashboard");

  };

  return (
    <div className="h-screen flex items-center justify-center">

      <div className="bg-card p-8 rounded-xl w-96">

        <h1 className="text-2xl mb-6">Login</h1>

        <input
          className="w-full p-2 mb-3 text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 text-black"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-primary px-4 py-2 rounded"
        >
          Login
        </button>

      </div>

    </div>
  );
}