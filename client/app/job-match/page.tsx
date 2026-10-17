
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";
import PageTransition from "../../components/PageTransition";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

export default function JobMatchPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
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

  const cardContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const analysisData = localStorage.getItem("analysis");

    if (!analysisData) {
      alert("Please analyze your resume first");
      router.push("/upload");
      return;
    }

    const savedFile = localStorage.getItem("resumeFile");

    if (!savedFile) {
      alert("Resume file not found. Please upload your resume again.");
      router.push("/upload");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "process.env.NEXT_PUBLIC_API_URL/api/job-match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            file: savedFile,
            jobDescription: jobDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Job matching failed");
      }

      localStorage.setItem("jobMatch", JSON.stringify(data));
      router.push("/job-match/result");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "🎯",
      title: "Match Score",
      description:
        "See how closely your resume matches the job requirements.",
    },
    {
      icon: "🧠",
      title: "Skill Analysis",
      description:
        "Discover the skills you have and the important skills you're missing.",
    },
    {
      icon: "✦",
      title: "AI Recommendations",
      description:
        "Get personalized suggestions to improve your job match.",
    },
  ];

  return (
    <AuthGuard>
      <PageTransition>
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-10 text-white sm:px-8 lg:px-10">
          {/* Animated background glow */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : {
                    x: [0, 35, 0],
                    y: [0, 25, 0],
                    scale: [1, 1.15, 1],
                  }
            }
            transition={{
              duration: 9,
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
                    x: [0, -30, 0],
                    y: [0, -25, 0],
                  }
            }
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10 mx-auto max-w-5xl">
            {/* Header */}
            <motion.header
              variants={cardContainer}
              initial="hidden"
              animate="visible"
              className="mb-12 text-center"
            >
              <motion.div
                variants={fadeUp}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2"
              >
                <motion.span
                  animate={reduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="text-cyan-400"
                >
                  ✦
                </motion.span>
                <span className="font-semibold tracking-wide text-cyan-400">
                  AI JOB MATCHING
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-extrabold leading-tight sm:text-5xl"
              >
                Match Your Resume
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  With a Job
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg"
              >
                Compare your resume with a job description and discover how
                well you match the role.
              </motion.p>
            </motion.header>

            {/* Job description card */}
            <motion.section
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    Job Description
                  </h2>
                  <p className="mt-2 text-sm text-slate-400 sm:text-base">
                    Paste the job description you want to apply for.
                  </p>
                </div>

                <motion.div
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          scale: [1, 1.12, 1],
                          opacity: [0.7, 1, 0.7],
                        }
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-400"
                >
                  ✦
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: reduceMotion ? 1 : 1.003 }}
                className="rounded-xl"
              >
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder={`Paste the complete job description here...

Example:

We are looking for a Software Engineer with experience in C++, JavaScript, Node.js, MongoDB, REST APIs and Docker...`}
                  className="h-72 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 p-5 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 sm:h-80"
                />
              </motion.div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    {jobDescription.length} characters
                  </span>

                  {jobDescription.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setJobDescription("")}
                      type="button"
                      className="text-sm text-slate-400 transition hover:text-cyan-400"
                    >
                      Clear text
                    </motion.button>
                  )}
                </div>

                <motion.button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  whileHover={
                    reduceMotion || loading ? {} : { scale: 1.03, y: -2 }
                  }
                  whileTap={reduceMotion || loading ? {} : { scale: 0.97 }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:shadow-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <motion.span
                      animate={reduceMotion ? {} : { rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block"
                    >
                      ◌
                    </motion.span>
                  )}
                  {loading ? "Analyzing..." : "Analyze Job Match →"}
                </motion.button>
              </div>

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4 text-sm text-cyan-200"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  AI is comparing your resume against the job requirements.
                </motion.div>
              )}
            </motion.section>

            {/* Feature cards */}
            <motion.section
              variants={cardContainer}
              initial="hidden"
              animate="visible"
              className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3"
            >
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={
                    reduceMotion
                      ? {}
                      : { y: -7, scale: 1.015 }
                  }
                  className="group rounded-xl border border-slate-800 bg-slate-900/70 p-6 transition-colors duration-300 hover:border-cyan-400/40 hover:bg-slate-900"
                >
                  <motion.div
                    whileHover={reduceMotion ? {} : { scale: 1.15, rotate: 5 }}
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-2xl"
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="font-bold transition-colors group-hover:text-cyan-300">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "2.5rem" }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                    className="mt-5 h-0.5 rounded-full bg-cyan-400/70"
                  />
                </motion.article>
              ))}
            </motion.section>

            {/* Back to dashboard */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <motion.button
                type="button"
                onClick={() => router.push("/dashboard")}
                whileHover={reduceMotion ? {} : { x: -3 }}
                className="text-sm text-slate-400 transition hover:text-cyan-400"
              >
                ← Back to Dashboard
              </motion.button>
            </motion.div>
          </div>
        </main>
      </PageTransition>
    </AuthGuard>
  );
}
