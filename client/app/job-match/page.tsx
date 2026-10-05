"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobMatchPage() {
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

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

  try {
    setLoading(true);

    // Get the uploaded resume filename
    const savedFile = localStorage.getItem("resumeFile");

    if (!savedFile) {
      alert("Resume file not found. Please upload your resume again.");
      router.push("/upload");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/job-match",
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
      throw new Error(
        data.message || "Job matching failed"
      );
    }

    localStorage.setItem(
      "jobMatch",
      JSON.stringify(data)
    );

    router.push("/job-match/result");

  } catch (error: any) {

    alert(
      error.message || "Something went wrong"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">

          <div className="inline-block bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-full mb-5">
            <span className="text-cyan-400 font-semibold">
              ✦ AI JOB MATCHING
            </span>
          </div>

          <h1 className="text-5xl font-bold">
            Match Your Resume
            <span className="text-cyan-400"> With a Job</span>
          </h1>

          <p className="text-slate-400 mt-4 text-lg">
            Compare your resume with a job description and discover
            how well you match the role.
          </p>

        </div>

        {/* JOB DESCRIPTION CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-2xl font-bold">
                Job Description
              </h2>

              <p className="text-slate-400 mt-1">
                Paste the job description you want to apply for.
              </p>
            </div>

            <div className="text-cyan-400 text-2xl">
              ✦
            </div>

          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here...

Example:

We are looking for a Software Engineer with experience in C++, JavaScript, Node.js, MongoDB, REST APIs and Docker..."
            className="w-full h-80 bg-slate-800 border border-slate-700 rounded-xl p-5 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition resize-none"
          />

          <div className="flex justify-between items-center mt-4">

            <span className="text-sm text-slate-500">
              {jobDescription.length} characters
            </span>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-cyan-400 text-slate-950 font-bold px-8 py-3 rounded-xl hover:bg-cyan-300 transition disabled:opacity-50"
            >
              {loading
                ? "Analyzing..."
                : "Analyze Job Match →"}
            </button>

          </div>

        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <div className="text-2xl mb-3">
              🎯
            </div>

            <h3 className="font-bold">
              Match Score
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              See how closely your resume matches the job.
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <div className="text-2xl mb-3">
              🧠
            </div>

            <h3 className="font-bold">
              Skill Analysis
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Find skills you have and skills you are missing.
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <div className="text-2xl mb-3">
              ✦
            </div>

            <h3 className="font-bold">
              AI Recommendations
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Get personalized suggestions to improve your match.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}