"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const router = useRouter();

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Get analysis result
    const data = localStorage.getItem("analysis");

    if (data) {
      setResult(JSON.parse(data));
    }
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-center">
        Resume Analysis
      </h1>

      <div className="max-w-4xl mx-auto mt-12 space-y-8">

        <div className="bg-slate-900 rounded-2xl p-8">
          <h2 className="text-2xl font-bold">
            ATS Score
          </h2>

          <p className="text-6xl text-green-400 font-bold mt-5">
            {result.atsScore}/100
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Missing Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {result.missingSkills.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-red-500 px-4 py-2 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

        </div>

        <div className="bg-slate-900 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Suggestions
          </h2>

          <ul className="space-y-4 list-disc ml-6">
            {result.suggestions.map((item: string, index: number) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>

        </div>

      </div>

    </main>
  );
}