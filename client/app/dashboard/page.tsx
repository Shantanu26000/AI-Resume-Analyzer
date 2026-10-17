
"use client";

import AuthGuard from "../../components/AuthGuard";
import PageTransition from "../../components/PageTransition";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useReducedMotion,
  Variants,
} from "framer-motion";

interface Analysis {
  id: number;
  resume_file: string;
  ats_score: number;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [analysisResponse, profileResponse] = await Promise.all([
          fetch("process.env.NEXT_PUBLIC_API_URL/api/analysis", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("process.env.NEXT_PUBLIC_API_URL/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (
          analysisResponse.status === 401 ||
          profileResponse.status === 401
        ) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        const analysisData = await analysisResponse.json();

        if (!analysisResponse.ok) {
          throw new Error(
            analysisData.message || "Failed to load dashboard data"
          );
        }

        setHistory(analysisData);

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserName(profileData.name || "");
        }
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

  const stats = [
    {
      title: "Latest ATS Score",
      value: latestScore,
      color: "text-green-400",
      description: "Score from your most recent saved analysis",
    },
    {
      title: "Total Analyses",
      value: totalResumes,
      color: "text-white",
      description: "Saved resume analyses in your account",
    },
    {
      title: "Best ATS Score",
      value: bestScore,
      color: "text-cyan-400",
      description: "Your highest saved ATS score",
    },
  ];

  return (
    <AuthGuard>
      <PageTransition>
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[100px]" />
            <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-600/[0.06] blur-[100px]" />
          </div>

          <nav className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-6 py-6 sm:px-10">
            <Link
              href="/dashboard"
              className="text-3xl font-bold tracking-tight"
            >
              Resume<span className="text-cyan-400">IQ</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
             
<motion.div
  whileHover={reduceMotion ? {} : { y: -3, scale: 1.04 }}
  whileTap={reduceMotion ? {} : { scale: 0.96 }}
>
  <Link
    href="/job-match"
    className="block rounded-lg border border-transparent px-4 py-2 transition-colors duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
  >
    Job Match
  </Link>
</motion.div>

<motion.div
  whileHover={reduceMotion ? {} : { y: -3, scale: 1.04 }}
  whileTap={reduceMotion ? {} : { scale: 0.96 }}
>
  <Link
    href="/history"
    className="block rounded-lg border border-transparent px-4 py-2 transition-colors duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
  >
    History
  </Link>
</motion.div>

<motion.div
  whileHover={reduceMotion ? {} : { y: -3, scale: 1.04 }}
  whileTap={reduceMotion ? {} : { scale: 0.96 }}
>
  <Link
    href="/settings"
    className="block rounded-lg border border-transparent px-4 py-2 transition-colors duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
  >
    Settings
  </Link>
</motion.div>


              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.04 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-400"
              >
                Logout
              </motion.button>
            </div>
          </nav>

          <div className="relative z-10 mx-auto max-w-7xl p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Your personal workspace
              </p>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Welcome back{userName ? `, ${userName}` : ""}!{" "}
                <motion.span
                  className="inline-block"
                  animate={reduceMotion ? {} : { rotate: [0, 18, -8, 18, 0] }}
                  transition={{
                    duration: 1.2,
                    delay: 0.5,
                    repeat: reduceMotion ? 0 : 1,
                  }}
                >
                  👋
                </motion.span>
              </h1>

              <p className="mt-3 text-slate-400">
                Track your resume performance with AI-powered insights.
              </p>
            </motion.div>

            {error && (
              <div className="mt-8 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-300">
                {error}
                <button
                  onClick={() => window.location.reload()}
                  className="ml-3 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            )}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.13,
                    delayChildren: 0.2,
                  },
                },
              }}
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.title}
                  variants={cardVariants}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={reduceMotion ? {} : { y: -6, scale: 1.01 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-lg shadow-black/10 transition-colors hover:border-cyan-400/30"
                >
                  <p className="font-medium text-slate-300">
                    {stat.title}
                  </p>

                  <p className={`mt-4 text-5xl font-bold ${stat.color}`}>
                    {loading ? "..." : stat.value ?? "—"}
                    {!loading && stat.value !== null && (
                      <span className="text-lg text-slate-500"> /100</span>
                    )}
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {!loading && !error && totalResumes === 0 && (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
              >
                <h2 className="text-xl font-bold">
                  Start your first analysis
                </h2>
                <p className="mt-2 text-slate-400">
                  Your dashboard statistics will update after you analyze
                  and save your first resume.
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.div
                whileHover={reduceMotion ? {} : { y: -3 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
              >
                <Link
                  href="/upload"
                  className="inline-flex rounded-xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Upload Resume →
                </Link>
              </motion.div>

              <motion.div
                whileHover={reduceMotion ? {} : { y: -3 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
              >
                <Link
                  href="/history"
                  className="inline-flex rounded-xl border border-slate-700 px-8 py-4 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  View History
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
    </AuthGuard>
  );
}
