
"use client";
import AuthGuard from "../../components/AuthGuard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Analysis {
  id: number;
  resume_file: string;
  ats_score: number;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/analysis",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard data"
          );
        }

        setHistory(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const totalResumes = history.length;

  const latestScore =
    totalResumes > 0 ? Number(history[0].ats_score) : null;

  const bestScore =
    totalResumes > 0
      ? Math.max(
          ...history.map((item) => Number(item.ats_score) || 0)
        )
      : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("analysis");
    localStorage.removeItem("jobMatch");
    localStorage.removeItem("resumeFile");
    localStorage.removeItem("selectedAnalysisId");

    router.push("/login");
  };

  return (
      <AuthGuard>
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex flex-wrap justify-between items-center gap-4 px-6 sm:px-10 py-6 border-b border-slate-800">
        <Link href="/dashboard" className="text-3xl font-bold">
          Resume<span className="text-cyan-400">IQ</span>
        </Link>

        <div className="flex flex-wrap gap-3 items-center">
          <Link
            href="/job-match"
            className="px-3 py-2 hover:text-cyan-400 transition"
          >
            Job Match
          </Link>

          <Link
            href="/history"
            className="px-3 py-2 hover:text-cyan-400 transition"
          >
            History
          </Link>

          <Link
            href="/settings"
            className="px-3 py-2 hover:text-cyan-400 transition"
          >
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-400 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 sm:p-10">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-slate-400 mt-3">
          Track your resume performance with AI-powered insights.
        </p>

        {error && (
          <div className="mt-8 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-3 underline font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <p className="text-slate-300 font-medium">
              Latest ATS Score
            </p>

            <p className="text-5xl font-bold text-green-400 mt-4">
              {loading
                ? "..."
                : latestScore !== null
                ? latestScore
                : "—"}
              {!loading && latestScore !== null && (
                <span className="text-lg text-slate-500"> /100</span>
              )}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              Score from your most recent saved analysis
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <p className="text-slate-300 font-medium">
              Total Analyses
            </p>

            <p className="text-5xl font-bold mt-4">
              {loading ? "..." : totalResumes}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              Saved resume analyses in your account
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <p className="text-slate-300 font-medium">
              Best ATS Score
            </p>

            <p className="text-5xl font-bold text-cyan-400 mt-4">
              {loading
                ? "..."
                : bestScore !== null
                ? bestScore
                : "—"}
              {!loading && bestScore !== null && (
                <span className="text-lg text-slate-500"> /100</span>
              )}
            </p>

            <p className="text-sm text-slate-500 mt-3">
              Your highest saved ATS score
            </p>
          </div>
        </div>

        {!loading && !error && totalResumes === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">
              Start your first analysis
            </h2>
            <p className="text-slate-400 mt-2">
              Your dashboard statistics will update after you analyze
              and save your first resume.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-10">
          <Link
            href="/upload"
            className="inline-flex bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl hover:bg-cyan-300 transition"
          >
            Upload Resume
          </Link>

          <Link
            href="/history"
            className="inline-flex border border-slate-700 font-semibold px-8 py-4 rounded-xl hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            View History
          </Link>
        </div>
      </div>
    </main>
    </AuthGuard>
  );
}
