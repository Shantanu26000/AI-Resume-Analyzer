"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/analysis",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch history");
        }

        setHistory(data);
      } catch (error: any) {
        alert(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold">
          Analysis History
        </h1>

        <p className="text-slate-400 mt-2">
          View your previously analyzed resumes and ATS scores.
        </p>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          {loading ? (
            <div className="text-center py-10">
              <p className="text-slate-400">
                Loading history...
              </p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl font-semibold">
                No analysis history yet
              </p>

              <p className="text-slate-400 mt-2">
                Upload a resume to create your first analysis.
              </p>

              <Link href="/upload">
                <button className="mt-6 bg-cyan-500 px-6 py-3 rounded-xl text-black font-bold hover:bg-cyan-400 transition">
                  Analyze Resume
                </button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4">
                      Resume
                    </th>

                    <th className="text-center py-4">
                      ATS Score
                    </th>

<th className="text-center py-4">
  Date
</th>

<th className="text-center py-4">
  Action
</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                    >
                      <td className="py-5 font-semibold">
                        {item.resume_file}
                      </td>

                      <td className="text-center">
                        <span className="text-green-400 font-bold">
                          {item.ats_score}
                        </span>
                        <span className="text-slate-500">
                          /100
                        </span>
                      </td>

<td className="text-center text-slate-400">
  {new Date(item.created_at).toLocaleDateString()}
</td>

<td className="text-center">
  <button
    onClick={() => {
      localStorage.setItem(
        "selectedAnalysisId",
        item.id.toString()
      );

      router.push("/analysis");
    }}
    className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
  >
    View Analysis
  </button>
</td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </div>

        <Link href="/dashboard">
          <button className="mt-10 bg-cyan-500 px-8 py-3 rounded-xl text-black font-bold hover:bg-cyan-400 transition">
            Dashboard
          </button>
        </Link>

      </div>
    </main>
  );
}