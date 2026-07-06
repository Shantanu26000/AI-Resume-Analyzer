import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Settings
      </h1>

      <div className="mt-10 max-w-xl bg-slate-900 rounded-2xl p-8">

        <input
          defaultValue="Shantanu Billaiya"
          className="w-full p-3 rounded-xl bg-slate-800 mb-5"
        />

        <input
          defaultValue="shantanu@email.com"
          className="w-full p-3 rounded-xl bg-slate-800 mb-5"
        />

        <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold">
          Save Changes
        </button>

      </div>

      <Link href="/dashboard">

        <button className="mt-10 bg-cyan-500 px-8 py-3 rounded-xl text-black">
          Back
        </button>

      </Link>

    </main>
  );
}