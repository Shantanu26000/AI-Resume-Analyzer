
"use client";
import AuthGuard from "../../components/AuthGuard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
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

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch history");
        }

        setHistory(data);
      } catch (error: any) {
        alert(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this analysis? This action cannot be undone."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `http://localhost:5000/api/analysis/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete analysis");
      }

      setHistory((prev) => prev.filter((item) => item.id !== id));

      if (
        localStorage.getItem("selectedAnalysisId") === String(id)
      ) {
        localStorage.removeItem("selectedAnalysisId");
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreStyle = (score: number) => {
    if (score >= 80) {
      return "bg-green-400/10 text-green-400 border-green-400/20";
    }

    if (score >= 60) {
      return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
    }

    return "bg-red-400/10 text-red-400 border-red-400/20";
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Date unavailable";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
      <AuthGuard>
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8 sm:px-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="text-cyan-400 font-semibold text-sm tracking-widest uppercase">
              ResumeIQ Workspace
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
              Analysis History
            </h1>

            <p className="text-slate-400 mt-3">
              Review your previous resume analyses and ATS scores.
            </p>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition"
          >
            + Analyze Resume
          </Link>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Total Analyses</p>
              <p className="text-3xl font-bold mt-2">{history.length}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Best ATS Score</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">
                {history.length
                  ? `${Math.max(...history.map((item) => Number(item.ats_score) || 0))}/100`
                  : "—"}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">Average ATS Score</p>
              <p className="text-3xl font-bold text-green-400 mt-2">
                {history.length
                  ? `${Math.round(
                      history.reduce(
                        (sum, item) => sum + (Number(item.ats_score) || 0),
                        0
                      ) / history.length
                    )}/100`
                  : "—"}
              </p>
            </div>
          </div>
        )}

        {/* History */}
        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-800">
            <h2 className="text-xl font-bold">Your Resumes</h2>
            <p className="text-slate-400 text-sm mt-1">
              Your saved analyses are stored in your account.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 mt-4">
                Loading your history...
              </p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold">
                No analyses yet
              </h3>
              <p className="text-slate-400 mt-2">
                Upload your first resume to see your results here.
              </p>
              <Link
                href="/upload"
                className="inline-flex mt-6 bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition"
              >
                Upload Resume
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-slate-800/50">
                  <tr className="text-slate-400 text-sm">
                    <th className="text-left px-6 py-4 font-semibold">
                      Resume
                    </th>
                    <th className="text-center px-4 py-4 font-semibold">
                      ATS Score
                    </th>
                    <th className="text-center px-4 py-4 font-semibold">
                      Date Analyzed
                    </th>
                    <th className="text-center px-6 py-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                            PDF
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-semibold truncate max-w-[260px]"
                              title={item.resume_file}
                            >
                              {item.resume_file}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Analysis #{item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg border font-bold ${getScoreStyle(Number(item.ats_score) || 0)}`}
                        >
                          {item.ats_score}/100
                        </span>
                      </td>

                      <td className="px-4 py-5 text-center text-slate-400 text-sm">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center items-center gap-4">
                          <button
                            onClick={() => {
                              localStorage.setItem(
                                "selectedAnalysisId",
                                String(item.id)
                              );
                              router.push("/analysis");
                            }}
                            className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="text-red-400 hover:text-red-300 font-semibold transition disabled:opacity-50"
                          >
                            {deletingId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <Link
          href="/dashboard"
          className="inline-flex mt-8 border border-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-cyan-400 hover:text-cyan-400 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
    </AuthGuard>
  );
}
