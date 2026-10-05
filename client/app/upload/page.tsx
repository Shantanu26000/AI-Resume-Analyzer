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
    router.push("/login");
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
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      // Upload PDF
      const uploadRes = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

if (!uploadRes.ok) {
  if (uploadRes.status === 401) {
    localStorage.removeItem("token");
    alert("Session expired. Please login again.");
    router.push("/login");
    return;
  }

  throw new Error(uploadData.message || "Upload failed");
}

      // Analyze PDF
      const analyzeRes = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            file: uploadData.file,
          }),
        }
      );

      const analysis = await analyzeRes.json();

if (!analyzeRes.ok) {
  if (analyzeRes.status === 401) {
    localStorage.removeItem("token");
    alert("Session expired. Please login again.");
    router.push("/login");
    return;
  }

  throw new Error(analysis.message || "Analysis failed");
}

    localStorage.setItem(
  "analysis",
  JSON.stringify(analysis)
);

localStorage.setItem(
  "resumeFile",
  uploadData.file
);

router.push("/analysis");

    } catch (error: any) {
      alert(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center">
          Upload Resume
        </h1>

        <p className="text-center text-slate-400 mt-2">
          Upload your PDF and let AI analyze your resume
        </p>

        {/* File Selection */}
        <div className="mt-10">

          <label
            htmlFor="resume-upload"
            className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800 p-8 text-center hover:border-cyan-400 hover:bg-slate-750 transition-all duration-200"
          >

            <p className="text-lg font-semibold">
              Select your resume
            </p>

            <p className="text-slate-400 mt-2">
              PDF files only
            </p>

            <span className="inline-block mt-5 bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition">
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
            <div className="mt-4 bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-green-400 font-semibold">
                ✓ Resume selected
              </p>

              <p className="text-slate-300 text-sm mt-1 break-all">
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
          className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
            ${
              loading
                ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                : "bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></span>
              Analyzing Resume...
            </span>
          ) : (
            "Upload & Analyze"
          )}
        </button>

        {loading && (
          <p className="text-center text-slate-400 text-sm mt-4">
            Uploading your resume and generating AI analysis. Please wait...
          </p>
        )}

      </div>

    </main>
  );
}