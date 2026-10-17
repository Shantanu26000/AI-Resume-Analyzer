
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";
import PageTransition from "../../../components/PageTransition";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

interface JobMatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function JobMatchResultPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [result, setResult] = useState<JobMatchResult | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const data = localStorage.getItem("jobMatch");

    if (!data) {
      router.push("/job-match");
      return;
    }

    try {
      setResult(JSON.parse(data) as JobMatchResult);
    } catch {
      localStorage.removeItem("jobMatch");
      router.push("/job-match");
    }
  }, [router]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: "easeOut",
      },
    },
  };

  const stagger: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  if (!result) {
    return (
      <AuthGuard>
        <main className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={reduceMotion ? {} : { rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-slate-800 border-t-cyan-400"
            />
            <h1 className="text-xl font-bold sm:text-2xl">
              Loading results...
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Preparing your job match report.
            </p>
          </motion.div>
        </main>
      </AuthGuard>
    );
  }

  const score = Math.max(0, Math.min(100, Number(result.matchScore) || 0));
  const circumference = 2 * Math.PI * 50;
  const safeMatchedSkills = Array.isArray(result.matchedSkills)
    ? result.matchedSkills
    : [];
  const safeMissingSkills = Array.isArray(result.missingSkills)
    ? result.missingSkills
    : [];
  const safeRecommendations = Array.isArray(result.recommendations)
    ? result.recommendations
    : [];

  return (
    <AuthGuard>
      <PageTransition>
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-10 text-white sm:px-8 lg:px-10">
          {/* Background glow */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : {
                    x: [0, 30, 0],
                    y: [0, 25, 0],
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
            className="pointer-events-none absolute -right-40 top-96 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : {
                    x: [0, -25, 0],
                    y: [0, -30, 0],
                  }
            }
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10 mx-auto max-w-5xl">
            {/* Header */}
            <motion.header
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mb-12 text-center"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2"
              >
                <span className="text-cyan-400">✦</span>
                <span className="font-semibold tracking-wide text-cyan-400">
                  AI JOB ANALYSIS
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-5 text-4xl font-extrabold sm:text-5xl"
              >
                Job Match{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Results
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-4 text-slate-400"
              >
                Here&apos;s how well your resume matches this job.
              </motion.p>
            </motion.header>

            {/* Match score */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-10"
            >
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold">Match Score</h2>

                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.6,
                    delay: 0.2,
                  }}
                  className="relative mt-8 h-52 w-52"
                >
                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 120 120"
                    role="img"
                    aria-label={`Resume match score: ${score}%`}
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#1e293b"
                      strokeWidth="10"
                      fill="none"
                    />

                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#22d3ee"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{
                        strokeDashoffset: circumference,
                      }}
                      animate={{
                        strokeDashoffset:
                          circumference -
                          (circumference * score) / 100,
                      }}
                      transition={{
                        duration: reduceMotion ? 0 : 1.4,
                        ease: "easeOut",
                        delay: 0.3,
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-6xl font-extrabold text-cyan-400"
                    >
                      {score}%
                    </motion.span>

                    <span className="mt-1 text-slate-400">Match</span>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 text-center text-xl font-bold"
                >
                  {score >= 80
                    ? "Excellent Match 🚀"
                    : score >= 60
                    ? "Good Match 👍"
                    : "Needs Improvement ⚠️"}
                </motion.p>

                <p className="mt-2 max-w-md text-center text-sm text-slate-400">
                  {score >= 80
                    ? "Your resume aligns strongly with this job's requirements."
                    : score >= 60
                    ? "You have a solid starting point. Review the missing skills below."
                    : "Use the skill gaps and recommendations below to improve your alignment."}
                </p>
              </div>
            </motion.section>

            {/* Skills */}
            <motion.section
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {/* Matched skills */}
              <motion.div
                variants={fadeUp}
                whileHover={reduceMotion ? {} : { y: -4 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8"
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Matched Skills
                  </h2>

                  <span className="rounded-lg border border-green-400/20 bg-green-400/10 px-3 py-1 text-sm font-bold text-green-400">
                    {safeMatchedSkills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {safeMatchedSkills.length === 0 ? (
                    <p className="text-slate-400">
                      No strong skill matches found.
                    </p>
                  ) : (
                    safeMatchedSkills.map((skill, index) => (
                      <motion.span
                        key={`${skill}-${index}`}
                        initial={{
                          opacity: 0,
                          scale: reduceMotion ? 1 : 0.8,
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: reduceMotion ? 0 : index * 0.06,
                        }}
                        whileHover={reduceMotion ? {} : { scale: 1.05 }}
                        className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 font-semibold text-green-400"
                      >
                        ✓ {skill}
                      </motion.span>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Missing skills */}
              <motion.div
                variants={fadeUp}
                whileHover={reduceMotion ? {} : { y: -4 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8"
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Missing Skills
                  </h2>

                  <span className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1 text-sm font-bold text-red-400">
                    {safeMissingSkills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {safeMissingSkills.length === 0 ? (
                    <p className="text-green-400">
                      No major missing skills 🎉
                    </p>
                  ) : (
                    safeMissingSkills.map((skill, index) => (
                      <motion.span
                        key={`${skill}-${index}`}
                        initial={{
                          opacity: 0,
                          scale: reduceMotion ? 1 : 0.8,
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: reduceMotion ? 0 : index * 0.06,
                        }}
                        whileHover={reduceMotion ? {} : { scale: 1.05 }}
                        className="rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 font-semibold text-red-400"
                      >
                        ⚠ {skill}
                      </motion.span>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.section>

            {/* Recommendations */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.25 }}
              className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8"
            >
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    AI Recommendations
                  </h2>
                  <p className="mt-2 text-slate-400">
                    How you can improve your resume for this role.
                  </p>
                </div>

                <span className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 font-semibold text-cyan-400">
                  ✦ AI Powered
                </span>
              </div>

              <div className="space-y-4">
                {safeRecommendations.length === 0 ? (
                  <p className="text-slate-400">
                    No recommendations are available for this result.
                  </p>
                ) : (
                  safeRecommendations.map((item, index) => (
                    <motion.div
                      key={`${index}-${item}`}
                      initial={{
                        opacity: 0,
                        x: reduceMotion ? 0 : -16,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : index * 0.1,
                      }}
                      whileHover={
                        reduceMotion ? {} : { x: 4 }
                      }
                      className="flex gap-4 rounded-xl border border-slate-700 bg-slate-800/60 p-4 transition-colors hover:border-cyan-400/40 sm:p-5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">
                        <span className="font-bold text-cyan-400">
                          {index + 1}
                        </span>
                      </div>

                      <p className="pt-2 leading-relaxed text-slate-300">
                        {item}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.section>

            {/* Navigation buttons */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
            >
              <motion.button
                variants={fadeUp}
                type="button"
                onClick={() => router.push("/job-match")}
                whileHover={reduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                ← Analyze Another Job
              </motion.button>

              <motion.button
                variants={fadeUp}
                type="button"
                onClick={() => router.push("/analysis")}
                whileHover={reduceMotion ? {} : { scale: 1.03, y: -2 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:shadow-cyan-400/25"
              >
                View Resume Analysis →
              </motion.button>
            </motion.div>
          </div>
        </main>
      </PageTransition>
    </AuthGuard>
  );
}
