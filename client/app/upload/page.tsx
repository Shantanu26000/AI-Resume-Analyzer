
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF resume first");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum size is 5 MB");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.replace("/login");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

      if (!apiUrl) {
        throw new Error(
          "API URL is missing. Check NEXT_PUBLIC_API_URL in your deployment settings."
        );
      }

      const formData = new FormData();
      formData.append("resume", file);

      // Upload PDF
      const uploadRes = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        if (uploadRes.status === 401) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again.");
          router.replace("/login");
          return;
        }

        throw new Error(uploadData.message || "Upload failed");
      }

      if (!uploadData.file) {
        throw new Error("Upload succeeded, but the server did not return a file reference.");
      }

      // Analyze PDF
      const analyzeRes = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          file: uploadData.file,
        }),
      });

      const analysis = await analyzeRes.json();

      if (!analyzeRes.ok) {
        if (analyzeRes.status === 401) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again.");
          router.replace("/login");
          return;
        }

        throw new Error(analysis.message || "Analysis failed");
      }

      localStorage.setItem("analysis", JSON.stringify(analysis));
      localStorage.removeItem("selectedAnalysisId");
      localStorage.setItem("resumeFile", uploadData.file);

      router.push("/analysis");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 p-10 shadow-2xl">
        <h1 className="text-center text-3xl font-bold">
          Upload Resume
        </h1>

        <p className="mt-2 text-center text-slate-400">
          Upload your PDF and let AI analyze your resume
        </p>

        {/* File Selection */}
        <div className="mt-10">
          <label
            htmlFor="resume-upload"
            className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800 p-8 text-center transition-all duration-200 hover:border-cyan-400 hover:bg-slate-700"
          >
            <p className="text-lg font-semibold">
              Select your resume
            </p>

            <p className="mt-2 text-slate-400">
              PDF files only (maximum 5 MB)
            </p>

            <span className="mt-5 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400">
              Browse from PC
            </span>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />
          </label>

          {file && (
            <div className="mt-4 rounded-xl bg-slate-800 p-4 text-center">
              <p className="font-semibold text-green-400">
                ✓ Resume selected
              </p>

              <p className="mt-1 break-all text-sm text-slate-300">
                {file.name}
              </p>
            </div>
          )}
        </div>

        {/* Upload & Analyze Button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className={`mt-8 w-full rounded-xl py-4 text-lg font-bold transition-all duration-200 ${
            loading
              ? "cursor-not-allowed bg-slate-600 text-slate-300"
              : "cursor-pointer bg-cyan-500 text-black hover:scale-[1.02] hover:bg-cyan-400 active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
              Analyzing Resume...
            </span>
          ) : (
            "Upload & Analyze"
          )}
        </button>

        {loading && (
          <p className="mt-4 text-center text-sm text-slate-400">
            Uploading your resume and generating AI analysis. Please wait...
          </p>
        )}
      </div>
    </main>
  );
}
