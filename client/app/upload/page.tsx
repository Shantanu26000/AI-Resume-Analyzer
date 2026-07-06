"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) {
      alert("Select a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    // Upload PDF
    const uploadRes = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    // Analyze PDF
    const analyzeRes = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: uploadData.file,
      }),
    });

    const analysis = await analyzeRes.json();

    localStorage.setItem("analysis", JSON.stringify(analysis));

    router.push("/analysis");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center">
          Upload Resume
        </h1>

        <input
          type="file"
          accept=".pdf"
          className="mt-10 w-full"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          className="mt-8 w-full bg-cyan-500 text-black py-3 rounded-xl font-bold"
        >
          Upload & Analyze
        </button>

      </div>
    </main>
  );
}