
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function Home() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Animated background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={
            reduceMotion
              ? {}
              : { x: [0, 35, 0], y: [0, -25, 0], scale: [1, 1.15, 1] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]"
        />
        <motion.div
          animate={
            reduceMotion
              ? {}
              : { x: [0, -30, 0], y: [0, 30, 0] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]"
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12"
      >
        <Link href="/" className="text-2xl font-extrabold tracking-tight md:text-3xl">
          <span className="text-cyan-400">Resume</span>IQ
          <span className="ml-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-xs font-medium text-cyan-300">
            AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-cyan-300 sm:text-base"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 sm:px-5 sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 md:grid-cols-2 md:px-12 md:py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
            <motion.span
              animate={reduceMotion ? {} : { opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-cyan-400"
            />
            AI-powered career improvement
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your Resume.
            <br />
            Your Future.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Upgraded.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            Discover your ATS score, uncover missing skills, match your resume
            against job descriptions, and get AI-powered suggestions to stand
            out to recruiters.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.04, y: -2 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-300"
              >
                Analyze My Resume
                <span aria-hidden="true">→</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.04, y: -2 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center rounded-xl border border-slate-700 bg-white/[0.03] px-7 py-4 font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-white/[0.06]"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <span>✓ ATS score analysis</span>
            <span>✓ Skill gap detection</span>
            <span>✓ Job matching</span>
          </div>
        </motion.div>

        {/* Animated resume preview */}
        <motion.div
          initial={{ opacity: 0, x: reduceMotion ? 0 : 45, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">RESUMEIQ ANALYZER</p>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  Resume Analysis
                </h2>
              </div>
              <div className="rounded-xl border border-green-400/20 bg-green-400/10 px-3 py-2 text-sm font-medium text-green-300">
                Analysis Preview
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "conic-gradient(#22d3ee 0% 92%, #334155 92% 100%)",
                }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-slate-900">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-4xl font-black text-white"
                  >
                    92
                  </motion.span>
                  <span className="text-sm text-slate-400">out of 100</span>
                </div>
              </div>

              <div className="w-full flex-1 space-y-4">
                {[
                  { label: "Skills", score: 95 },
                  { label: "Experience", score: 88 },
                  { label: "Formatting", score: 92 },
                ].map((item, index) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-semibold text-cyan-300">
                        {item.score}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{
                          duration: reduceMotion ? 0 : 1,
                          delay: reduceMotion ? 0 : 0.6 + index * 0.2,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-red-400/10 bg-red-400/5 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Skills to explore</h3>
                <span className="text-xs text-slate-500">Example</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Docker", "AWS", "Kubernetes"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-sm text-red-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">
              <h3 className="mb-2 font-semibold text-cyan-300">
                ✦ AI Recommendation
              </h3>
              <p className="text-sm leading-6 text-slate-400">
                Add measurable project achievements and relevant technical
                keywords to strengthen your resume.
              </p>
            </div>
          </motion.div>

          {/* Decorative floating element */}
          <motion.div
            animate={
              reduceMotion
                ? {}
                : { y: [0, -8, 0], rotate: [0, 3, 0] }
            }
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-3 -top-5 rounded-2xl border border-cyan-400/20 bg-slate-900 px-4 py-3 shadow-xl sm:-right-6"
          >
            <span className="text-sm font-semibold text-cyan-300">
              ✦ AI Insights
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature strip */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.15 },
          },
        }}
        className="relative z-10 mx-auto grid max-w-7xl gap-5 px-6 pb-20 md:grid-cols-3 md:px-12"
      >
        {[
          {
            icon: "◎",
            title: "ATS Score Analysis",
            description:
              "Understand how well your resume aligns with applicant tracking systems.",
          },
          {
            icon: "⌘",
            title: "Skill Gap Detection",
            description:
              "Find missing skills and discover areas to improve before applying.",
          },
          {
            icon: "✧",
            title: "Job Description Matching",
            description:
              "Compare your resume with a target role and receive useful recommendations.",
          },
        ].map((feature) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            whileHover={reduceMotion ? {} : { y: -6 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
<footer className="border-t border-white/10 py-8 text-center">
  <p className="text-base font-medium text-slate-300 sm:text-lg">
    © 2026 ResumeIQ AI. Developed by{" "}
    <span className="font-bold text-white">Shantanu</span>.
  </p>
  <p className="mt-2 text-sm font-medium text-slate-400 sm:text-base">
    Turning ideas into intelligent solutions.
  </p>
</footer>
    </main>
  );
}
