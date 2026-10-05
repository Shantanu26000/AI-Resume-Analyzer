"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobMatchResultPage() {
  const router = useRouter();

  const [result, setResult] = useState<any>(null);

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

    setResult(JSON.parse(data));
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Loading results...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">

          <div className="inline-block bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-full">
            <span className="text-cyan-400 font-semibold">
              ✦ AI JOB ANALYSIS
            </span>
          </div>

          <h1 className="text-5xl font-bold mt-5">
            Job Match Results
          </h1>

          <p className="text-slate-400 mt-3">
            Here's how well your resume matches this job.
          </p>

        </div>

        {/* MATCH SCORE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-xl">

          <div className="flex flex-col items-center">

            <h2 className="text-2xl font-bold">
              Match Score
            </h2>

            <div className="relative w-52 h-52 mt-8">

              <svg
                className="w-52 h-52 -rotate-90"
                viewBox="0 0 120 120"
              >

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#1e293b"
                  strokeWidth="10"
                  fill="none"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#22d3ee"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset={
                    314 - (314 * result.matchScore) / 100
                  }
                />

              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-6xl font-bold text-cyan-400">
                  {result.matchScore}%
                </span>

                <span className="text-slate-400">
                  Match
                </span>

              </div>

            </div>

            <p className="text-xl font-bold mt-6">

              {result.matchScore >= 80
                ? "Excellent Match 🚀"
                : result.matchScore >= 60
                ? "Good Match 👍"
                : "Needs Improvement ⚠️"}

            </p>

          </div>

        </div>

        {/* SKILLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          {/* MATCHED SKILLS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Matched Skills
              </h2>

              <span className="bg-green-400/10 border border-green-400/20 text-green-400 px-3 py-1 rounded-lg text-sm font-bold">
                {result.matchedSkills.length}
              </span>

            </div>

            <div className="flex flex-wrap gap-3">

              {result.matchedSkills.length === 0 ? (

                <p className="text-slate-400">
                  No strong skill matches found.
                </p>

              ) : (

                result.matchedSkills.map(
                  (skill: string, index: number) => (

                    <span
                      key={index}
                      className="bg-green-400/10 border border-green-400/20 text-green-400 px-4 py-2 rounded-full font-semibold"
                    >
                      ✓ {skill}
                    </span>

                  )
                )

              )}

            </div>

          </div>

          {/* MISSING SKILLS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Missing Skills
              </h2>

              <span className="bg-red-400/10 border border-red-400/20 text-red-400 px-3 py-1 rounded-lg text-sm font-bold">
                {result.missingSkills.length}
              </span>

            </div>

            <div className="flex flex-wrap gap-3">

              {result.missingSkills.length === 0 ? (

                <p className="text-green-400">
                  No major missing skills 🎉
                </p>

              ) : (

                result.missingSkills.map(
                  (skill: string, index: number) => (

                    <span
                      key={index}
                      className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-2 rounded-full font-semibold"
                    >
                      ⚠ {skill}
                    </span>

                  )
                )

              )}

            </div>

          </div>

        </div>

        {/* RECOMMENDATIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-8">

          <div className="flex justify-between items-start mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                AI Recommendations
              </h2>

              <p className="text-slate-400 mt-2">
                How you can improve your resume for this role.
              </p>
            </div>

            <span className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 px-4 py-2 rounded-xl font-semibold">
              ✦ AI Powered
            </span>

          </div>

          <div className="space-y-4">

            {result.recommendations.map(
              (item: string, index: number) => (

                <div
                  key={index}
                  className="flex gap-4 bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:border-cyan-400/40 transition"
                >

                  <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">

                    <span className="text-cyan-400 font-bold">
                      {index + 1}
                    </span>

                  </div>

                  <p className="text-slate-300 leading-relaxed pt-2">
                    {item}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mt-10">

          <button
            onClick={() => router.push("/job-match")}
            className="px-6 py-3 rounded-xl border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 transition font-semibold"
          >
            Analyze Another Job
          </button>

          <button
            onClick={() => router.push("/analysis")}
            className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition font-bold"
          >
            View Resume Analysis
          </button>

        </div>

      </div>

    </main>
  );
}