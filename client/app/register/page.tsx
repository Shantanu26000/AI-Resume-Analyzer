"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration Successful");
      router.push("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8">

        <h1 className="text-4xl font-bold text-center">
          Create Account
        </h1>

        <div className="space-y-5 mt-8">

          <input
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-slate-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            onClick={handleRegister}
            className="w-full bg-green-500 text-black rounded-xl py-3 font-bold"
          >
            Create Account
          </button>

          <p className="text-center text-slate-400">
            Already have an account?
            <Link href="/login">
              <span className="text-cyan-400 ml-2">Login</span>
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}