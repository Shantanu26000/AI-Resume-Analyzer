"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalysisPage() {
  const router = useRouter();

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const data = localStorage.getItem("analysis");

    if (data) {
      setResult(JSON.parse(data));
    }
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-center">
        Resume Analysis
      </h1>

      <div className="max-w-4xl mx-auto mt-12 space-y-8">

        {/* ATS SCORE */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">

          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-2xl font-bold">
                ATS Score
              </h2>

              <p className="text-slate-400 mt-1">
                Resume compatibility with Applicant Tracking Systems
              </p>
            </div>

            <div className="bg-green-400/10 border border-green-400/20 px-4 py-2 rounded-xl">
              <span className="text-green-400 font-semibold">
                AI Analyzed
              </span>
            </div>

          </div>

          <div className="mt-10 flex flex-col items-center">

            <div className="relative w-48 h-48">

              <svg
                className="w-48 h-48 -rotate-90"
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
                  stroke="#22c55e"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset={
                    314 - (314 * result.atsScore) / 100
                  }
                />

              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-5xl font-bold text-green-400">
                  {result.atsScore}
                </span>

                <span className="text-slate-400">
                  out of 100
                </span>

              </div>

            </div>

            <p className="mt-6 text-xl font-bold">
              {result.atsScore >= 80
                ? "Excellent Resume 🚀"
                : result.atsScore >= 60
                ? "Good Resume 👍"
                : "Needs Improvement ⚠️"}
            </p>

            <p className="text-slate-400 mt-2 text-center">
              Your resume has been analyzed for ATS compatibility,
              skills and formatting.
            </p>

          </div>

        </div>

        {/* SCORE BREAKDOWN */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">

          <div className="flex justify-between items-center mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                Score Breakdown
              </h2>

              <p className="text-slate-400 mt-1">
                How your resume performs across key areas
              </p>
            </div>

            <div className="text-cyan-400 text-2xl">
              ✦
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <ScoreCard
              title="Keywords"
              score={result.scoreBreakdown.keywords}
            />

            <ScoreCard
              title="Skills"
              score={result.scoreBreakdown.skills}
            />

            <ScoreCard
              title="Formatting"
              score={result.scoreBreakdown.formatting}
            />

            <ScoreCard
              title="Experience"
              score={result.scoreBreakdown.experience}
            />

          </div>

        </div>

        {/* RESUME STRENGTH CHART */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">

          <div className="flex justify-between items-start mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                Resume Strength
              </h2>

              <p className="text-slate-400 mt-2">
                Performance across key resume categories
              </p>
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-xl">
              <span className="text-cyan-400 font-semibold">
                AI Analysis
              </span>
            </div>

          </div>

          <div className="w-full h-80">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={[
                  {
                    category: "Keywords",
                    score: result.scoreBreakdown.keywords,
                  },
                  {
                    category: "Skills",
                    score: result.scoreBreakdown.skills,
                  },
                  {
                    category: "Formatting",
                    score: result.scoreBreakdown.formatting,
                  },
                  {
                    category: "Experience",
                    score: result.scoreBreakdown.experience,
                  },
                ]}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />

                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(34,211,238,0.05)",
                  }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(value: any) => [
                    `${value}%`,
                    "Score",
                  ]}
                />

                <Bar
                  dataKey="score"
                  fill="#22d3ee"
                  radius={[10, 10, 0, 0]}
                  barSize={55}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

{/* MISSING SKILLS */}
<div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">

  <div className="flex justify-between items-start mb-8">

    <div>
      <h2 className="text-2xl font-bold">
        Missing Skills
      </h2>

      <p className="text-slate-400 mt-2">
        Skills that could strengthen your resume for ATS screening
      </p>
    </div>

    <div className="bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-xl">
      <span className="text-red-400 font-semibold">
        {result.missingSkills.length} Missing
      </span>
    </div>

  </div>

  {result.missingSkills.length === 0 ? (

    <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-6 text-center">

      <div className="text-3xl mb-2">
        ✓
      </div>

      <p className="text-green-400 font-bold text-lg">
        Excellent!
      </p>

      <p className="text-slate-400 mt-1">
        No major missing skills were detected.
      </p>

    </div>

  ) : (

    <div className="space-y-4">

      {result.missingSkills.map(
        (skill: string, index: number) => (

          <div
            key={index}
            className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 hover:border-red-400/40 transition"
          >

            <div className="flex items-start justify-between">

              {/* LEFT */}
              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center flex-shrink-0">

                  <span className="text-red-400 text-xl font-bold">
                    !
                  </span>

                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <h3 className="text-lg font-bold">
                      {skill}
                    </h3>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">
                      HIGH PRIORITY
                    </span>

                  </div>

                  <p className="text-sm text-slate-400 mt-2">
                    Adding this skill may improve your ATS compatibility
                    and increase your chances of matching relevant job
                    requirements.
                  </p>

                </div>

              </div>

            </div>

            {/* BOTTOM */}
            <div className="mt-5 pt-4 border-t border-slate-700 flex items-center justify-between">

              <span className="text-sm text-slate-500">
                AI Recommendation
              </span>

              <button
                className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
                onClick={() => {
                  navigator.clipboard.writeText(skill);
                }}
              >
                Copy Skill
              </button>

            </div>

          </div>

        )
      )}

    </div>

  )}

</div>

        {/* AI SUGGESTIONS */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">

          <div className="flex justify-between items-start mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                AI Suggestions
              </h2>

              <p className="text-slate-400 mt-2">
                Personalized recommendations to improve your resume
              </p>
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-xl">

              <span className="text-cyan-400 font-semibold">
                ✦ AI Powered
              </span>

            </div>

          </div>

          <div className="space-y-4">

            {result.suggestions.map(
              (item: string, index: number) => (

                <div
                  key={index}
                  className="flex gap-4 bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:border-cyan-400/40 transition"
                >

                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">

                    <span className="text-cyan-400 font-bold">
                      {index + 1}
                    </span>

                  </div>

                  <div>

                    <p className="font-semibold mb-1">
                      Recommendation {index + 1}
                    </p>

                    <p className="text-slate-300 leading-relaxed">
                      {item}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </main>
  );
}

function ScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-5">

      <div className="flex justify-between mb-3">

        <span className="font-semibold">
          {title}
        </span>

        <span className="text-cyan-400 font-bold">
          {score}%
        </span>

      </div>

      <div className="w-full bg-slate-700 rounded-full h-2.5">

        <div
          className="bg-cyan-400 h-2.5 rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
          }}
        ></div>

      </div>

    </div>
  );
}