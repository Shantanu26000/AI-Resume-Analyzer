"use client";

import AuthGuard from "../../components/AuthGuard";
import PageTransition from "../../components/PageTransition";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function HistoryPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

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
        const response = await fetch("process.env.NEXT_PUBLIC_API_URL/api/analysis", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        `process.env.NEXT_PUBLIC_API_URL/api/analysis/${id}`,
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

      if (localStorage.getItem("selectedAnalysisId") === String(id)) {
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

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.4,
        ease: "easeOut",
      },
    },
  };

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
      },
    },
  };

  const averageScore = history.length
    ? Math.round(
        history.reduce(
          (sum, item) => sum + (Number(item.ats_score) || 0),
          0
        ) / history.length
      )
    : null;

  const bestScore = history.length
    ? Math.max(...history.map((item) => Number(item.ats_score) || 0))
    : null;

  return (
    <AuthGuard>
      <PageTransition>
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-8 sm:py-12">
          {/* Animated background glow */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : {
                    x: [0, 30, 0],
                    y: [0, 20, 0],
                    scale: [1, 1.12, 1],
                  }
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
                : {
                    x: [0, -25, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                  }
            }
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            {/* Header */}
            <motion.div
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
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition-colors hover:bg-cyan-300"
                >
                  + Analyze Resume
                </Link>
              </motion.div>
            </motion.div>

            {/* Statistics */}
            {!loading && (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={reduceMotion ? {} : { y: -5, scale: 1.02 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 transition-colors hover:border-cyan-400/40"
                >
                  <p className="text-sm text-slate-400">Total Analyses</p>
                  <p className="mt-2 text-3xl font-bold">{history.length}</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={reduceMotion ? {} : { y: -5, scale: 1.02 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 transition-colors hover:border-cyan-400/40"
                >
                  <p className="text-sm text-slate-400">Best ATS Score</p>
                  <p className="mt-2 text-3xl font-bold text-cyan-400">
                    {bestScore !== null ? `${bestScore}/100` : "—"}
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={reduceMotion ? {} : { y: -5, scale: 1.02 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 transition-colors hover:border-green-400/40"
                >
                  <p className="text-sm text-slate-400">Average ATS Score</p>
                  <p className="mt-2 text-3xl font-bold text-green-400">
                    {averageScore !== null ? `${averageScore}/100` : "—"}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* History section */}
            <motion.section
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: reduceMotion ? 0 : 0.15 }}
              className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90"
            >
              <div className="border-b border-slate-800 p-6 sm:p-8">
                <h2 className="text-xl font-bold">Your Resumes</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your saved analyses are stored in your account.
                </p>
              </div>

              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
                  <p className="mt-4 text-slate-400">
                    Loading your history...
                  </p>
                </motion.div>
              ) : history.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 py-16 text-center"
                >
                  <div className="mb-4 text-4xl">📄</div>
                  <h3 className="text-xl font-bold">No analyses yet</h3>
                  <p className="mt-2 text-slate-400">
                    Upload your first resume to see your results here.
                  </p>

                  <motion.div
                    whileHover={reduceMotion ? {} : { scale: 1.04, y: -2 }}
                    whileTap={reduceMotion ? {} : { scale: 0.96 }}
                  >
                    <Link
                      href="/upload"
                      className="mt-6 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-cyan-300"
                    >
                      Upload Resume
                    </Link>
                  </motion.div>
                </motion.div>
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
                      {history.map((item) => (
                        <motion.tr
                          key={item.id}
                          variants={itemVariants}
                          whileHover={
                            reduceMotion ? {} : { backgroundColor: "rgba(30, 41, 59, 0.5)" }
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
                                  title={item.resume_file}
                                >
                                  {item.resume_file}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Analysis #{item.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-5 text-center">
                            <motion.span
                              whileHover={
                                reduceMotion ? {} : { scale: 1.08 }
                              }
                              className={`inline-flex items-center rounded-lg border px-3 py-1.5 font-bold ${getScoreStyle(
                                Number(item.ats_score) || 0
                              )}`}
                            >
                              {item.ats_score}/100
                            </motion.span>
                          </td>

                          <td className="px-4 py-5 text-center text-sm text-slate-400">
                            {formatDate(item.created_at)}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-4">
                              <motion.button
                                type="button"
                                whileHover={
                                  reduceMotion ? {} : { scale: 1.08, y: -1 }
                                }
                                whileTap={
                                  reduceMotion ? {} : { scale: 0.94 }
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
                                  reduceMotion ? {} : { scale: 1.08, y: -1 }
                                }
                                whileTap={
                                  reduceMotion ? {} : { scale: 0.94 }
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
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              )}
            </motion.section>

            {/* Back to dashboard */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.25 }}
              className="mt-8"
            >
              <motion.div
                whileHover={reduceMotion ? {} : { x: -3 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="inline-flex"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex rounded-xl border border-slate-700 px-6 py-3 font-semibold transition-colors hover:border-cyan-400 hover:text-cyan-400"
                >
                  ← Back to Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
    </AuthGuard>
  );
}