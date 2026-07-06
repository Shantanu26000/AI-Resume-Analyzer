import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold">
          <span className="text-cyan-400">Resume</span>IQ
        </h1>

        <Link
          href="/login"
          className="bg-cyan-500 hover:bg-cyan-400 px-5 py-2 rounded-lg text-black font-semibold transition"
        >
          Login
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-10 py-24">

        <div>

          <h1 className="text-6xl font-extrabold leading-tight">
            AI Powered
            <br />
            Resume Analyzer
          </h1>

          <p className="text-slate-400 mt-8 text-lg">
            Improve your ATS score, discover missing skills,
            receive AI suggestions and land more interviews.
          </p>

          <div className="flex gap-5 mt-10">

            <Link
              href="/login"
              className="bg-cyan-500 hover:bg-cyan-400 px-8 py-4 rounded-xl text-black font-bold transition"
            >
              Get Started
            </Link>

            <Link
              href="/register"
              className="border border-slate-700 hover:bg-slate-800 px-8 py-4 rounded-xl"
            >
              Create Account
            </Link>

          </div>

        </div>

        <div className="bg-slate-900 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-8">
            Resume Analysis Preview
          </h2>

          <div className="space-y-6">

            <div>

              <div className="flex justify-between">

                <span>ATS Score</span>

                <span className="text-green-400 font-bold">
                  92%
                </span>

              </div>

              <div className="h-3 rounded-full bg-slate-700 mt-2">

                <div className="w-[92%] h-3 rounded-full bg-green-400"></div>

              </div>

            </div>

            <div>

              <h3 className="font-semibold mb-3">
                Missing Skills
              </h3>

              <div className="flex gap-3 flex-wrap">

                <span className="bg-red-500 px-3 py-1 rounded-full">
                  Docker
                </span>

                <span className="bg-red-500 px-3 py-1 rounded-full">
                  AWS
                </span>

                <span className="bg-red-500 px-3 py-1 rounded-full">
                  Kubernetes
                </span>

              </div>

            </div>

            <div>

              <h3 className="font-semibold mb-3">
                AI Suggestions
              </h3>

              <ul className="list-disc ml-6 text-slate-400">

                <li>Add quantified achievements</li>

                <li>Improve project descriptions</li>

                <li>Use ATS keywords</li>

              </ul>

            </div>

          </div>

        </div>

      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 ResumeIQ AI
      </footer>

    </main>
  );
}