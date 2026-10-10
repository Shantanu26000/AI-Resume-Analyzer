
"use client";
import AuthGuard from "../../components/AuthGuard";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to save changes");
      }

      setName(data.name);
      setEmail(data.email);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
      <AuthGuard>
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10 sm:p-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
          Account
        </p>

        <h1 className="text-4xl font-bold mt-2">Settings</h1>

        <p className="text-slate-400 mt-3">
          Manage your ResumeIQ profile information.
        </p>

        <form
          onSubmit={handleSave}
          className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold mb-6">
            Profile Information
          </h2>

          {loading ? (
            <p className="text-slate-400 py-8">
              Loading your profile...
            </p>
          ) : (
            <>
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                autoComplete="name"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 mb-5 outline-none focus:border-cyan-400 transition"
                placeholder="Enter your full name"
              />

              <label
                htmlFor="profile-email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email Address
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                autoComplete="email"
                className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 mb-6 outline-none focus:border-cyan-400 transition"
                placeholder="Enter your email"
              />

              {error && (
                <p role="alert" className="text-red-400 mb-4">
                  {error}
                </p>
              )}

              {message && (
                <p role="status" className="text-green-400 mb-4">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </form>

        <Link
          href="/dashboard"
          className="inline-flex mt-8 bg-cyan-400 text-slate-950 px-8 py-3 rounded-xl font-semibold hover:bg-cyan-300 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
    </AuthGuard>
  );
}
