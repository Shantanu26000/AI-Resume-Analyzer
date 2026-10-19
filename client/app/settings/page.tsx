"use client";

import AuthGuard from "../../components/AuthGuard";
import PageTransition from "../../components/PageTransition";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ai-resume-analyzer-production-c6b4.up.railway.app"
).replace(/\/+$/, "");

export default function SettingsPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

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
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setName(data.name ?? "");
        setEmail(data.email ?? "");
      } catch (err: unknown) {
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

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to save changes");
      }

      setName(data.name ?? name);
      setEmail(data.email ?? email);
      setMessage("Profile updated successfully!");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <PageTransition>
        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white sm:p-10">
          {/* Animated background glow */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : {
                    x: [0, 30, 0],
                    y: [0, 25, 0],
                    scale: [1, 1.12, 1],
                  }
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
            animate={
              reduceMotion
                ? {}
                : {
                    x: [0, -25, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                  }
            }
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative mx-auto max-w-3xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: "easeOut",
              }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
                Account
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                Settings
              </h1>

              <p className="mt-3 text-slate-400">
                Manage your ResumeIQ profile information.
              </p>
            </motion.div>

            {/* Profile form */}
            <motion.form
              onSubmit={handleSave}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduceMotion ? 0 : 0.15,
                duration: reduceMotion ? 0 : 0.55,
                ease: "easeOut",
              }}
              whileHover={
                reduceMotion
                  ? {}
                  : { borderColor: "rgba(34, 211, 238, 0.25)" }
              }
              className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-8"
            >
              <h2 className="mb-2 text-xl font-bold">
                Profile Information
              </h2>

              <p className="mb-6 text-sm text-slate-400">
                Keep your account information up to date.
              </p>

              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 py-8 text-slate-400"
                >
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                  Loading your profile...
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.2 }}
                  >
                    <label
                      htmlFor="profile-name"
                      className="mb-2 block text-sm font-medium text-slate-300"
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
                      className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-800/80 p-4 outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="Enter your full name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.3 }}
                  >
                    <label
                      htmlFor="profile-email"
                      className="mb-2 block text-sm font-medium text-slate-300"
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
                      className="mb-6 w-full rounded-xl border border-slate-700 bg-slate-800/80 p-4 outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="Enter your email"
                    />
                  </motion.div>

                  {error && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400"
                    >
                      {error}
                    </motion.p>
                  )}

                  {message && (
                    <motion.p
                      role="status"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 rounded-xl border border-green-400/20 bg-green-400/10 p-3 text-sm text-green-400"
                    >
                      {message}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={
                      reduceMotion || saving ? {} : { scale: 1.02, y: -2 }
                    }
                    whileTap={
                      reduceMotion || saving ? {} : { scale: 0.97 }
                    }
                    className="rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/10 transition-colors duration-300 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </motion.button>
                </>
              )}
            </motion.form>

            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.3 }}
              className="mt-8 inline-flex"
            >
              <motion.div
                whileHover={reduceMotion ? {} : { x: -3, scale: 1.02 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex rounded-xl bg-cyan-400 px-8 py-3 font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
                >
                  ← Back to Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
    </AuthGuard>
  );
}
