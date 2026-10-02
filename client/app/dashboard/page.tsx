"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("analysis");

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">

        <h1 className="text-3xl font-bold">
          Resume<span className="text-cyan-400">IQ</span>
        </h1>

        <div className="flex gap-4 items-center">

          <Link href="/history">
            <button className="px-4 py-2 hover:text-cyan-400 transition">
              History
            </button>
          </Link>

          <Link href="/settings">
            <button className="px-4 py-2 hover:text-cyan-400 transition">
              Settings
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-400 transition"
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="max-w-7xl mx-auto p-10">

        <h1 className="text-5xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-slate-400 mt-3">
          Analyze your resume using AI.
        </p>

        <div className="grid grid-cols-3 gap-6 mt-10">

          <div className="bg-slate-900 rounded-2xl p-8">
            <h3>ATS Score</h3>
            <p className="text-5xl font-bold text-green-400 mt-4">
              92
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8">
            <h3>Resumes</h3>
            <p className="text-5xl font-bold mt-4">
              18
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8">
            <h3>Best Score</h3>
            <p className="text-5xl font-bold text-cyan-400 mt-4">
              96
            </p>
          </div>

        </div>

        <div className="mt-12">

          <Link href="/upload">
            <button className="bg-cyan-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-cyan-400 transition">
              Upload Resume
            </button>
          </Link>

        </div>

      </div>

    </main>
  );
}