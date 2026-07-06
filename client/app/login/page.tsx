"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login Successful");
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-xl">

        <h1 className="text-4xl font-bold text-center">
          Resume<span className="text-cyan-400">IQ</span>
        </h1>

        <p className="text-center text-slate-400 mt-2">
          Login to your account
        </p>

        <div className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-slate-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-slate-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-cyan-500 text-black font-bold rounded-xl py-3"
          >
            Login
          </button>

          <p className="text-center text-slate-400">
            Don't have an account?
            <Link href="/register">
              <span className="text-cyan-400 ml-2">Register</span>
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}