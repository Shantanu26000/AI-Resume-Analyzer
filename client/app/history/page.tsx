import Link from "next/link";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Analysis History
      </h1>

      <div className="mt-10 bg-slate-900 rounded-2xl p-8">

        <table className="w-full">

          <thead>

            <tr>

              <th className="text-left">Resume</th>
              <th>Score</th>
              <th>Date</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td className="py-5">Resume.pdf</td>

              <td className="text-center">92</td>

              <td className="text-center">Today</td>

            </tr>

          </tbody>

        </table>

      </div>

      <Link href="/dashboard">

        <button className="mt-10 bg-cyan-500 px-8 py-3 rounded-xl text-black">
          Dashboard
        </button>

      </Link>

    </main>
  );
}