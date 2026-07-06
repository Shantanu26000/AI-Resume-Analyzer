import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">

      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8">

        <h1 className="text-4xl font-bold text-center">
          Create Account
        </h1>

        <div className="space-y-5 mt-8">

          <input
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <input
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <Link href="/dashboard">
            <button className="w-full bg-green-500 text-black rounded-xl py-3 font-bold">
              Create Account
            </button>
          </Link>

        </div>

      </div>

    </main>
  );
}