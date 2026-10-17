

"use client";



import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import { useRouter } from "next/navigation";

import AuthGuard from "../../components/AuthGuard";

import PageTransition from "../../components/PageTransition";

import {

  motion,

  useReducedMotion,

  type Variants,

} from "framer-motion";

import {

  BarChart,

  Bar,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

  ResponsiveContainer,

} from "recharts";



interface AnalysisResult {

  atsScore: number;

  scoreBreakdown: {

    keywords: number;

    skills: number;

    formatting: number;

    experience: number;

  };

  missingSkills: string[];

  suggestions: string[];

}



export default function AnalysisPage() {

  const router = useRouter();

  const reduceMotion = useReducedMotion();



  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);



  useEffect(() => {

    const fetchAnalysis = async () => {

      const token = localStorage.getItem("token");



      if (!token) {

        router.push("/login");

        return;

      }



      const selectedId = localStorage.getItem("selectedAnalysisId");



      try {

        // Load an older analysis selected from History.

        if (selectedId) {

          const response = await fetch(

            `http://localhost:5000/api/analysis/${selectedId}`,

            {

              method: "GET",

              headers: {

                Authorization: `Bearer ${token}`,

              },

            }

          );



          const data = await response.json();



          if (!response.ok) {

            throw new Error(data.message || "Failed to load analysis");

          }



          setResult({

            atsScore: data.atsScore,

            scoreBreakdown: data.scoreBreakdown,

            missingSkills: data.missingSkills,

            suggestions: data.suggestions,

          });



          return;

        }



        // Otherwise load the latest analysis from localStorage.

        const data = localStorage.getItem("analysis");



        if (data) {

          setResult(JSON.parse(data) as AnalysisResult);

        } else {

          router.push("/upload");

        }

      } catch (error: unknown) {

        const message =

          error instanceof Error ? error.message : "Failed to load analysis";



        alert(message);

      }

    };



    fetchAnalysis();

  }, [router]);



  const fadeUp: Variants = {

    hidden: {

      opacity: 0,

      y: reduceMotion ? 0 : 24,

    },

    visible: {

      opacity: 1,

      y: 0,

      transition: {

        duration: reduceMotion ? 0 : 0.5,

        ease: "easeOut",

      },

    },

  };



  const stagger: Variants = {

    hidden: {},

    visible: {

      transition: {

        staggerChildren: reduceMotion ? 0 : 0.12,

      },

    },

  };



  const handleCopy = async (skill: string) => {

    try {

      await navigator.clipboard.writeText(skill);

      setCopiedSkill(skill);

      window.setTimeout(() => setCopiedSkill(null), 1500);

    } catch {

      alert("Unable to copy. Please copy the skill manually.");

    }

  };



  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const footerReserve = 18;
    let y = 20;

    // jsPDF's built-in Helvetica font has limited Unicode support.
    // Normalize special punctuation so the PDF does not show corrupted glyphs.
    const safeText = (value: unknown): string =>
      String(value ?? "")
        .replace(/[\u00B1]/g, "+/-")
        .replace(/[\u00C6]/g, "AE")
        .replace(/[\u00E6]/g, "ae")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[\u2022\u25CF]/g, "-")
        .replace(/[\u2026]/g, "...")
        .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");

    const addPage = () => {
      doc.addPage();
      y = 20;
    };

    const ensureSpace = (height: number) => {
      if (y + height > pageHeight - footerReserve) addPage();
    };

    const addWrappedText = (
      text: string,
      options?: { fontSize?: number; color?: [number, number, number]; lineHeight?: number; indent?: number }
    ) => {
      const fontSize = options?.fontSize ?? 10;
      const lineHeight = options?.lineHeight ?? 5.2;
      const indent = options?.indent ?? 0;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(...(options?.color ?? [55, 65, 81]));
      const lines = doc.splitTextToSize(safeText(text), contentWidth - indent) as string[];

      lines.forEach((line) => {
        ensureSpace(lineHeight);
        doc.text(line, margin + indent, y);
        y += lineHeight;
      });
      y += 1.5;
    };

    const addHeading = (heading: string) => {
      ensureSpace(15);
      y += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(8, 145, 178);
      doc.text(safeText(heading), margin, y);
      y += 7;
    };

    const addBullet = (text: string) => {
      addWrappedText(`- ${text}`, { indent: 2 });
    };

    const scoreLabel = (score: number) =>
      score >= 80 ? "Strong" : score >= 60 ? "Fair" : "Needs attention";

    const scoreExplanation: Record<string, string> = {
      Keywords: "This checks whether relevant words and phrases appear in your resume. Recruiters and screening tools may look for terms related to the role. Use accurate keywords from the job description only when they match your real experience.",
      Skills: "This reflects how well your listed skills match the skills assessed by the analysis. Add skills you genuinely have, and support important ones with a project, internship, course, or work example.",
      Formatting: "This estimates how clearly your resume is organized. Use consistent headings, readable text, simple layouts, and clear dates. Avoid relying on graphics or complex columns to communicate important details.",
      Experience: "This looks at how clearly your resume presents relevant experience and evidence of what you did. Strong bullet points explain the action you took and the result or impact, where you can provide an honest result.",
    };

    // Cover/header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 45, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("ResumeIQ AI", margin, 19);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(165, 243, 252);
    doc.text("Resume Analysis Report", margin, 28);
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, margin, 37);
    y = 55;

    addHeading("1. Your overall ATS score");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(25);
    doc.setTextColor(8, 145, 178);
    doc.text(`${atsScore}/100`, margin, y);
    y += 9;
    addWrappedText(
      atsScore >= 80
        ? "In simple words: your resume scored well in this assessment. Keep tailoring it to each role and check that your experience clearly supports the skills listed."
        : atsScore >= 60
          ? "In simple words: your resume has a reasonable foundation, but some areas could be clearer or better matched to the role. Start with the weaker categories below."
          : "In simple words: this assessment found several areas to improve. Focus on clear structure, relevant skills, and specific examples of your work before applying."
    );
    addWrappedText(
      "Important: this score is an estimate from ResumeIQ AI, not a guarantee of passing an employer's ATS or getting an interview."
    );

    addHeading("2. Score breakdown - what each area means");
    scoreData.forEach((item) => {
      const score = Math.max(0, Math.min(100, Number(item.score) || 0));
      ensureSpace(23);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(31, 41, 55);
      doc.text(`${safeText(item.category)}: ${score}% (${scoreLabel(score)})`, margin, y);
      y += 5;
      addWrappedText(scoreExplanation[item.category] ?? "This is one part of the resume assessment. Review it alongside the actual job requirements.", {
        fontSize: 9.5,
        color: [75, 85, 99],
        lineHeight: 4.8,
        indent: 2,
      });
    });

    addHeading("3. Skills to review");
    if (missingSkills.length === 0) {
      addWrappedText("The analysis did not identify any missing skills. Still compare your resume with the specific job description before applying.");
    } else {
      addWrappedText("These skills were identified as potentially missing from your resume. A skill being listed here does not mean you must add it: include it only if you genuinely have that skill.");
      missingSkills.forEach((skill, index) => {
        addWrappedText(`${index + 1}. ${skill}`, {
          fontSize: 10.5,
          color: [31, 41, 55],
        });
        addWrappedText(
          `What to do: If you have this skill, add it to your Skills section and, where possible, show proof in a project, internship, coursework, or work experience. If you do not have it, consider learning it if it is relevant to your target role - do not claim experience you do not have.`,
          { fontSize: 9.5, color: [75, 85, 99], indent: 2, lineHeight: 4.8 }
        );
      });
    }

    addHeading("4. AI recommendations - explained simply");
    if (suggestions.length === 0) {
      addWrappedText("No additional recommendations were provided in this analysis. Review the score breakdown and compare your resume against the job description.");
    } else {
      suggestions.forEach((suggestion, index) => {
        addWrappedText(`${index + 1}. ${suggestion}`, {
          fontSize: 10,
          color: [31, 41, 55],
        });
        addWrappedText(
          "How to use this advice: make one specific, truthful edit to your resume, then check whether the change makes your skills or results easier for a recruiter to understand. Keep the wording accurate to your experience.",
          { fontSize: 9.5, color: [75, 85, 99], indent: 2, lineHeight: 4.8 }
        );
      });
    }

    addHeading("5. Simple action plan");
    addBullet("Read the job description and identify the most important requirements.");
    addBullet("Make sure relevant skills you actually have are easy to find in your resume.");
    addBullet("Use clear bullet points that describe what you did and the outcome, where known.");
    addBullet("Keep headings, dates, spacing, and formatting consistent and easy to scan.");
    addBullet("Save a tailored version for each role and review it before submitting.");

    addWrappedText(
      "This report is guidance, not a hiring decision. Employers use different screening systems and criteria. Never add skills, qualifications, or results that are not true.",
      { fontSize: 9, color: [100, 116, 139] }
    );

    // Add a consistent footer to every page after all pages have been created.
    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page++) {
      doc.setPage(page);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Generated by ResumeIQ AI", margin, pageHeight - 7);
      doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: "right" });
    }

    doc.save("ResumeIQ-Analysis-Report.pdf");
  };

  if (!result) {

    return (

      <AuthGuard>

        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">

          <motion.div

            initial={{ opacity: 0, y: 12 }}

            animate={{ opacity: 1, y: 0 }}

            className="text-center"

          >

            <motion.div

              animate={reduceMotion ? {} : { rotate: 360 }}

              transition={{

                duration: 1.5,

                repeat: Infinity,

                ease: "linear",

              }}

              className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-slate-800 border-t-cyan-400"

            />

            <h1 className="text-2xl font-bold">Loading analysis...</h1>

            <p className="mt-2 text-slate-400">

              Preparing your resume report.

            </p>

          </motion.div>

        </main>

      </AuthGuard>

    );

  }



  const atsScore = Math.max(

    0,

    Math.min(100, Number(result.atsScore) || 0)

  );



  const scoreBreakdown = result.scoreBreakdown ?? {

    keywords: 0,

    skills: 0,

    formatting: 0,

    experience: 0,

  };



  const missingSkills = Array.isArray(result.missingSkills)

    ? result.missingSkills

    : [];



  const suggestions = Array.isArray(result.suggestions)

    ? result.suggestions

    : [];



  const scoreData = [

    { category: "Keywords", score: scoreBreakdown.keywords },

    { category: "Skills", score: scoreBreakdown.skills },

    { category: "Formatting", score: scoreBreakdown.formatting },

    { category: "Experience", score: scoreBreakdown.experience },

  ];



  const circumference = 2 * Math.PI * 50;



  return (

    <AuthGuard>

      <PageTransition>

        <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-10 text-white sm:px-8 lg:px-10">

          {/* Animated background glow */}

          <motion.div

            aria-hidden="true"

            className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"

            animate={

              reduceMotion

                ? {}

                : {

                    x: [0, 30, 0],

                    y: [0, 25, 0],

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

            className="pointer-events-none absolute -right-40 top-[700px] h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"

            animate={

              reduceMotion

                ? {}

                : {

                    x: [0, -25, 0],

                    y: [0, -30, 0],

                  }

            }

            transition={{

              duration: 12,

              repeat: Infinity,

              ease: "easeInOut",

            }}

          />



          <div className="relative z-10 mx-auto max-w-5xl">

            {/* Header */}

            <motion.header

              variants={stagger}

              initial="hidden"

              animate="visible"

              className="mb-12 text-center"

            >

              <motion.div

                variants={fadeUp}

                className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2"

              >

                <span className="text-cyan-400">✦</span>

                <span className="font-semibold tracking-wide text-cyan-400">

                  AI RESUME ANALYSIS

                </span>

              </motion.div>



              <motion.h1

                variants={fadeUp}

                className="text-4xl font-extrabold sm:text-5xl"

              >

                Resume{" "}

                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">

                  Analysis

                </span>

              </motion.h1>



              <motion.p

                variants={fadeUp}

                className="mt-4 text-slate-400"

              >

                Understand your ATS score and discover opportunities to

                strengthen your resume.

              </motion.p>

              <motion.button
                type="button"
                onClick={handleDownloadPDF}
                whileHover={reduceMotion ? {} : { scale: 1.04, y: -2 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:shadow-cyan-400/25"
              >
                <span aria-hidden="true">↓</span>
                Download PDF Report
              </motion.button>

            </motion.header>



            <div className="space-y-8">

              {/* ATS score */}

              <motion.section

                variants={fadeUp}

                initial="hidden"

                animate="visible"

                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-8"

              >

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h2 className="text-2xl font-bold">ATS Score</h2>

                    <p className="mt-2 text-sm text-slate-400 sm:text-base">

                      Resume compatibility with Applicant Tracking Systems

                    </p>

                  </div>



                  <motion.div

                    whileHover={reduceMotion ? {} : { scale: 1.05 }}

                    className="shrink-0 rounded-xl border border-green-400/20 bg-green-400/10 px-3 py-2 sm:px-4"

                  >

                    <span className="text-sm font-semibold text-green-400">

                      ✓ AI Analyzed

                    </span>

                  </motion.div>

                </div>



                <div className="mt-10 flex flex-col items-center">

                  <motion.div

                    initial={{ opacity: 0, scale: 0.85 }}

                    animate={{ opacity: 1, scale: 1 }}

                    transition={{

                      duration: reduceMotion ? 0 : 0.6,

                    }}

                    className="relative h-48 w-48"

                  >

                    <svg

                      className="h-full w-full -rotate-90"

                      viewBox="0 0 120 120"

                      role="img"

                      aria-label={`ATS score: ${atsScore} out of 100`}

                    >

                      <circle

                        cx="60"

                        cy="60"

                        r="50"

                        stroke="#1e293b"

                        strokeWidth="10"

                        fill="none"

                      />



                      <motion.circle

                        cx="60"

                        cy="60"

                        r="50"

                        stroke="#22c55e"

                        strokeWidth="10"

                        fill="none"

                        strokeLinecap="round"

                        strokeDasharray={circumference}

                        initial={{ strokeDashoffset: circumference }}

                        animate={{

                          strokeDashoffset:

                            circumference -

                            (circumference * atsScore) / 100,

                        }}

                        transition={{

                          duration: reduceMotion ? 0 : 1.4,

                          ease: "easeOut",

                          delay: 0.2,

                        }}

                      />

                    </svg>



                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                      <motion.span

                        initial={{ opacity: 0, y: 10 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ delay: 0.3 }}

                        className="text-5xl font-extrabold text-green-400"

                      >

                        {atsScore}

                      </motion.span>

                      <span className="text-slate-400">out of 100</span>

                    </div>

                  </motion.div>



                  <motion.p

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: 0.5 }}

                    className="mt-6 text-xl font-bold"

                  >

                    {atsScore >= 80

                      ? "Excellent Resume 🚀"

                      : atsScore >= 60

                      ? "Good Resume 👍"

                      : "Needs Improvement ⚠️"}

                  </motion.p>



                  <p className="mt-2 max-w-lg text-center text-sm leading-6 text-slate-400">

                    Your resume has been analyzed for ATS compatibility,

                    skills, and formatting.

                  </p>

                </div>

              </motion.section>



              {/* Score breakdown */}

              <motion.section

                variants={fadeUp}

                initial="hidden"

                animate="visible"

                transition={{ delay: 0.1 }}

                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8"

              >

                <div className="mb-8 flex items-center justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">Score Breakdown</h2>

                    <p className="mt-2 text-slate-400">

                      How your resume performs across key areas

                    </p>

                  </div>

                  <span className="text-2xl text-cyan-400">✦</span>

                </div>



                <motion.div

                  variants={stagger}

                  initial="hidden"

                  whileInView="visible"

                  viewport={{ once: true, amount: 0.2 }}

                  className="grid grid-cols-1 gap-6 md:grid-cols-2"

                >

                  {scoreData.map((item) => (

                    <motion.div

                      key={item.category}

                      variants={fadeUp}

                      whileHover={reduceMotion ? {} : { y: -4 }}

                      className="rounded-xl border border-slate-700 bg-slate-800/60 p-5"

                    >

                      <div className="mb-3 flex justify-between gap-4">

                        <span className="font-semibold">{item.category}</span>

                        <span className="font-bold text-cyan-400">

                          {item.score}%

                        </span>

                      </div>



                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-700">

                        <motion.div

                          initial={{ width: 0 }}

                          whileInView={{

                            width: `${Math.max(

                              0,

                              Math.min(100, Number(item.score) || 0)

                            )}%`,

                          }}

                          viewport={{ once: true }}

                          transition={{

                            duration: reduceMotion ? 0 : 0.9,

                            ease: "easeOut",

                          }}

                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"

                        />

                      </div>

                    </motion.div>

                  ))}

                </motion.div>

              </motion.section>



              {/* Resume strength chart */}

              <motion.section

                variants={fadeUp}

                initial="hidden"

                whileInView="visible"

                viewport={{ once: true, amount: 0.15 }}

                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8"

              >

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">Resume Strength</h2>

                    <p className="mt-2 text-slate-400">

                      Performance across key resume categories

                    </p>

                  </div>



                  <span className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 font-semibold text-cyan-400">

                    ✦ AI Analysis

                  </span>

                </div>



                <div className="h-80 w-full">

                  <ResponsiveContainer width="100%" height="100%">

                    <BarChart

                      data={scoreData}

                      margin={{

                        top: 10,

                        right: 10,

                        left: -20,

                        bottom: 10,

                      }}

                    >

                      <CartesianGrid

                        strokeDasharray="3 3"

                        stroke="#1e293b"

                        vertical={false}

                      />



                      <XAxis

                        dataKey="category"

                        axisLine={false}

                        tickLine={false}

                        tick={{ fill: "#94a3b8", fontSize: 12 }}

                      />



                      <YAxis

                        domain={[0, 100]}

                        axisLine={false}

                        tickLine={false}

                        tick={{ fill: "#64748b", fontSize: 12 }}

                      />



                      <Tooltip

                        cursor={{ fill: "rgba(34,211,238,0.05)" }}

                        contentStyle={{

                          backgroundColor: "#0f172a",

                          border: "1px solid #334155",

                          borderRadius: "12px",

                          color: "#ffffff",

                        }}

                        formatter={(value) => [`${value}%`, "Score"]}

                      />



                      <Bar

                        dataKey="score"

                        fill="#22d3ee"

                        radius={[10, 10, 0, 0]}

                        barSize={55}

                        isAnimationActive={!reduceMotion}

                        animationDuration={1000}

                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </motion.section>



              {/* Missing skills */}

              <motion.section

                variants={fadeUp}

                initial="hidden"

                whileInView="visible"

                viewport={{ once: true, amount: 0.1 }}

                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8"

              >

                <div className="mb-8 flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-2xl font-bold">Missing Skills</h2>

                    <p className="mt-2 text-slate-400">

                      Skills that could strengthen your resume for ATS screening

                    </p>

                  </div>



                  <span className="shrink-0 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-400">

                    {missingSkills.length} Missing

                  </span>

                </div>



                {missingSkills.length === 0 ? (

                  <motion.div

                    initial={{ opacity: 0, scale: 0.95 }}

                    whileInView={{ opacity: 1, scale: 1 }}

                    viewport={{ once: true }}

                    className="rounded-xl border border-green-400/20 bg-green-400/10 p-6 text-center"

                  >

                    <div className="mb-2 text-3xl">✓</div>

                    <p className="text-lg font-bold text-green-400">

                      Excellent!

                    </p>

                    <p className="mt-1 text-slate-400">

                      No major missing skills were detected.

                    </p>

                  </motion.div>

                ) : (

                  <motion.div

                    variants={stagger}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{ once: true, amount: 0.1 }}

                    className="space-y-4"

                  >

                    {missingSkills.map((skill, index) => (

                      <motion.article

                        key={`${skill}-${index}`}

                        variants={fadeUp}

                        whileHover={reduceMotion ? {} : { y: -3 }}

                        className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 transition-colors hover:border-red-400/40"

                      >

                        <div className="flex items-start gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">

                            <span className="text-xl font-bold text-red-400">

                              !

                            </span>

                          </div>



                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                              <h3 className="text-lg font-bold">{skill}</h3>

                              <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-xs font-bold text-red-400">

                                HIGH PRIORITY

                              </span>

                            </div>



                            <p className="mt-2 text-sm leading-6 text-slate-400">

                              Adding this skill, if you genuinely possess it,

                              may improve your ATS compatibility and alignment

                              with relevant job requirements.

                            </p>

                          </div>

                        </div>



                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-700 pt-4">

                          <span className="text-sm text-slate-500">

                            AI Recommendation

                          </span>



                          <motion.button

                            type="button"

                            whileHover={reduceMotion ? {} : { scale: 1.04 }}

                            whileTap={reduceMotion ? {} : { scale: 0.96 }}

                            onClick={() => handleCopy(skill)}

                            className="text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"

                          >

                            {copiedSkill === skill ? "Copied ✓" : "Copy Skill"}

                          </motion.button>

                        </div>

                      </motion.article>

                    ))}

                  </motion.div>

                )}

              </motion.section>



              {/* AI suggestions */}

              <motion.section

                variants={fadeUp}

                initial="hidden"

                whileInView="visible"

                viewport={{ once: true, amount: 0.1 }}

                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl sm:p-8"

              >

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">AI Suggestions</h2>

                    <p className="mt-2 text-slate-400">

                      Personalized recommendations to improve your resume

                    </p>

                  </div>



                  <span className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 font-semibold text-cyan-400">

                    ✦ AI Powered

                  </span>

                </div>



                {suggestions.length === 0 ? (

                  <p className="text-slate-400">

                    No suggestions are available for this analysis.

                  </p>

                ) : (

                  <motion.div

                    variants={stagger}

                    initial="hidden"

                    whileInView="visible"

                    viewport={{ once: true, amount: 0.1 }}

                    className="space-y-4"

                  >

                    {suggestions.map((item, index) => (

                      <motion.article

                        key={`${index}-${item}`}

                        variants={fadeUp}

                        whileHover={reduceMotion ? {} : { x: 4 }}

                        className="flex gap-4 rounded-xl border border-slate-700 bg-slate-800/60 p-5 transition-colors hover:border-cyan-400/40"

                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">

                          <span className="font-bold text-cyan-400">

                            {index + 1}

                          </span>

                        </div>



                        <div>

                          <p className="mb-1 font-semibold">

                            Recommendation {index + 1}

                          </p>

                          <p className="leading-relaxed text-slate-300">

                            {item}

                          </p>

                        </div>

                      </motion.article>

                    ))}

                  </motion.div>

                )}

              </motion.section>



              {/* Navigation */}

              <motion.div

                variants={stagger}

                initial="hidden"

                whileInView="visible"

                viewport={{ once: true }}

                className="flex flex-col justify-center gap-4 pb-4 sm:flex-row"

              >

                <motion.button

                  variants={fadeUp}

                  type="button"

                  onClick={() => router.push("/dashboard")}

                  whileHover={reduceMotion ? {} : { scale: 1.03, y: -2 }}

                  whileTap={reduceMotion ? {} : { scale: 0.97 }}

                  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400"

                >

                  ← Back to Dashboard

                </motion.button>



                <motion.button

                  variants={fadeUp}

                  type="button"

                  onClick={() => router.push("/upload")}

                  whileHover={reduceMotion ? {} : { scale: 1.03, y: -2 }}

                  whileTap={reduceMotion ? {} : { scale: 0.97 }}

                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:shadow-cyan-400/25"

                >

                  Analyze Another Resume →

                </motion.button>

              </motion.div>

            </div>

          </div>

        </main>

      </PageTransition>

    </AuthGuard>

  );

}
