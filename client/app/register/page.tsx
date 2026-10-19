"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      alert("Please fill all fields");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful");
        router.push("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch {
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-white">
      {/* Animated background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
        animate={
          reduceMotion
            ? {}
            : { x: [0, 35, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
        animate={
          reduceMotion
            ? {}
            : { x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.6,
          ease: "easeOut",
        }}
        className="relative w-full max-w-md"
      >
        <motion.div
          whileHover={reduceMotion ? {} : { y: -3 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl sm:p-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.15, duration: 0.4 }}
            className="text-center text-4xl font-bold tracking-tight"
          >
            Create <span className="text-cyan-400">Account</span>
          </motion.h1>

          <p className="mt-3 text-center text-slate-400">
            Start building a stronger resume today
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.2 }}
            >
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3.5 outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.3 }}
            >
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3.5 outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.4 }}
            >
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3.5 outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={
                reduceMotion || loading ? {} : { scale: 1.02, y: -2 }
              }
              whileTap={reduceMotion || loading ? {} : { scale: 0.97 }}
              className="w-full rounded-xl bg-emerald-400 py-3.5 font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-colors duration-300 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.5 }}
            className="mt-6 text-center text-sm text-slate-400"
          >
            Already have an account?
            <Link
              href="/login"
              className="ml-2 font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <motion.span
                whileHover={reduceMotion ? {} : { scale: 1.05 }}
                className="inline-block"
              >
                Login
              </motion.span>
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
}