"use client";

import AuthGuard from "../../components/AuthGuard";
import PageTransition from "../../components/PageTransition";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type HistoryItem = {
  id: number;
  resume_file?: string;
  ats_score?: number | string;
  created_at?: string;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || ""
).replace(/\/+$/, "");

async function readResponse(response: Response) {
  const text = await response.text();

  let data: any = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `The server returned HTML or invalid JSON (HTTP ${response.status}). Check NEXT_PUBLIC_API_URL and your backend route.`
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export default function HistoryPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      if (!API_BASE_URL) {
        setError(
          "API URL is missing. Set NEXT_PUBLIC_API_URL in your frontend hosting environment."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/api/analysis`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        const data = await readResponse(response);

        if (cancelled) return;

        const items: HistoryItem[] = Array.isArray(data)
          ? data
          : Array.isArray(data.analyses)
            ? data.analyses
            : Array.isArray(data.history)
              ? data.history
              : [];

        setHistory(items);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your analysis history."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchHistory();

    return () => {
      cancelled = true;
    };
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
      router.replace("/login");
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/analysis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      await readResponse(response);

      setHistory((previous) => previous.filter((item) => item.id !== id));

      if (localStorage.getItem("selectedAnalysisId") === String(id)) {
        localStorage.removeItem("selectedAnalysisId");
        localStorage.removeItem("analysis");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this analysis."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreStyle = (score: number) => {
    if (score >= 80) {
      return "border-green-400/20 bg-green-400/10 text-green-400";
    }

    if (score >= 60) {
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-400";
    }

    return "border-red-400/20 bg-red-400/10 text-red-400";
  };

  const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";

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

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.35,
        ease: "easeOut",
      },
    },
  };

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.06,
      },
    },
  };

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + (Number(item.ats_score) || 0),
            0
          ) / history.length
        )
      : null;

  const bestScore =
    history.length > 0
      ? Math.max(...history.map((item) => Number(item.ats_score) || 0))
      : null;

  return (
    <AuthGuard>
      <PageTransition>
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-8 sm:py-12">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : { x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : { x: [0, -25, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }
            }
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            <motion.header
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                  ResumeIQ Workspace
                </p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Analysis History
                </h1>

                <p className="mt-3 text-slate-400">
                  Review your previous resume analyses and ATS scores.
                </p>
              </div>

              <motion.div
                whileHover={reduceMotion ? {} : { scale: 1.04, y: -2 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
              >
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-300"
                >
                  + Analyze Resume
                </Link>
              </motion.div>
            </motion.header>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
              >
                <p className="font-semibold">Unable to load history</p>
                <p className="mt-1 break-words">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 font-semibold underline underline-offset-4 hover:text-white"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={reduceMotion ? {} : { y: -4 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5"
                >
                  <p className="text-sm text-slate-400">Total Analyses</p>
                  <p className="mt-2 text-3xl font-bold">{history.length}</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={reduceMotion ? {} : { y: -4 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5"
                >
                  <p className="text-sm text-slate-400">Best ATS Score</p>
                  <p className="mt-2 text-3xl font-bold text-cyan-400">
                    {bestScore !== null ? `${bestScore}/100` : "—"}
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={reduceMotion ? {} : { y: -4 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5"
                >
                  <p className="text-sm text-slate-400">Average ATS Score</p>
                  <p className="mt-2 text-3xl font-bold text-green-400">
                    {averageScore !== null ? `${averageScore}/100` : "—"}
                  </p>
                </motion.div>
              </motion.div>
            )}

            <motion.section
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90"
            >
              <div className="border-b border-slate-800 p-6 sm:p-8">
                <h2 className="text-xl font-bold">Your Resumes</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your saved analyses are stored in your account.
                </p>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
                  <p className="mt-4 text-slate-400">
                    Loading your history...
                  </p>
                </div>
              ) : error ? (
                <div className="px-6 py-12 text-center text-slate-400">
                  Check the error message above, then try again.
                </div>
              ) : history.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mb-4 text-4xl">📄</div>
                  <h3 className="text-xl font-bold">No analyses yet</h3>
                  <p className="mt-2 text-slate-400">
                    Upload your first resume to see your results here.
                  </p>

                  <Link
                    href="/upload"
                    className="mt-6 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-300"
                  >
                    Upload Resume
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-slate-800/50">
                      <tr className="text-sm text-slate-400">
                        <th className="px-6 py-4 text-left font-semibold">
                          Resume
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          ATS Score
                        </th>
                        <th className="px-4 py-4 text-center font-semibold">
                          Date Analyzed
                        </th>
                        <th className="px-6 py-4 text-center font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <motion.tbody
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {history.map((item) => {
                        const score = Number(item.ats_score) || 0;

                        return (
                          <motion.tr
                            key={item.id}
                            variants={itemVariants}
                            whileHover={
                              reduceMotion
                                ? {}
                                : { backgroundColor: "rgba(30, 41, 59, 0.5)" }
                            }
                            className="border-t border-slate-800 transition-colors"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-bold text-cyan-400">
                                  PDF
                                </div>

                                <div className="min-w-0">
                                  <p
                                    className="max-w-[260px] truncate font-semibold"
                                    title={item.resume_file || "Resume"}
                                  >
                                    {item.resume_file || "Resume"}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Analysis #{item.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-5 text-center">
                              <span
                                className={`inline-flex items-center rounded-lg border px-3 py-1.5 font-bold ${getScoreStyle(
                                  score
                                )}`}
                              >
                                {score}/100
                              </span>
                            </td>

                            <td className="px-4 py-5 text-center text-sm text-slate-400">
                              {formatDate(item.created_at)}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-4">
                                <motion.button
                                  type="button"
                                  whileHover={
                                    reduceMotion ? {} : { scale: 1.06 }
                                  }
                                  whileTap={
                                    reduceMotion ? {} : { scale: 0.95 }
                                  }
                                  onClick={() => {
                                    localStorage.setItem(
                                      "selectedAnalysisId",
                                      String(item.id)
                                    );
                                    router.push("/analysis");
                                  }}
                                  className="font-semibold text-cyan-400 transition hover:text-cyan-300"
                                >
                                  View
                                </motion.button>

                                <motion.button
                                  type="button"
                                  whileHover={
                                    reduceMotion ? {} : { scale: 1.06 }
                                  }
                                  whileTap={
                                    reduceMotion ? {} : { scale: 0.95 }
                                  }
                                  onClick={() => handleDelete(item.id)}
                                  disabled={deletingId === item.id}
                                  className="font-semibold text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {deletingId === item.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </table>
                </div>
              )}
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.2 }}
              className="mt-8"
            >
              <Link
                href="/dashboard"
                className="inline-flex rounded-xl border border-slate-700 px-6 py-3 font-semibold transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                ← Back to Dashboard
              </Link>
            </motion.div>
          </div>
        </main>
      </PageTransition>
    </AuthGuard>
  );
}