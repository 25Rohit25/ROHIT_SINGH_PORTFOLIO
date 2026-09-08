"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectWhitepaper } from "./project-docs";

interface ProjectModalProps {
  project: ProjectWhitepaper | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        />

        {/* Academic Paper Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#fdfdfc] shadow-2xl md:rounded-3xl"
        >
          {/* Top Academic Document Header Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3.5 backdrop-blur-md sm:px-8 sm:py-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-[10px] font-semibold text-white tracking-wider">
                {project.paperRef}
              </span>
              <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                {project.categoryBadge}
              </span>
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 md:inline-block">
                ✓ {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <span>GitHub</span>
                <span className="text-[10px]">↗</span>
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 sm:inline-flex"
                >
                  <span>Live Demo</span>
                  <span className="text-[10px]">↗</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close modal"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable Whitepaper Content */}
          <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10">
            {/* Paper Title & Authorship */}
            <div className="border-b border-slate-200/80 pb-8">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
                Engineering Specification &amp; Architecture Whitepaper
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                {project.title}
              </h1>
              <p className="mt-2.5 text-sm font-medium text-slate-600 sm:text-base">
                {project.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div>
                  Author: <span className="font-semibold text-slate-800">{project.authorship}</span>
                </div>
                <span>•</span>
                <div>
                  Domain: <span className="font-semibold text-slate-800">{project.aim.targetDomain}</span>
                </div>
              </div>
            </div>

            {/* I. Abstract & Aim */}
            <section className="mt-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Section I</span>
                <span>—</span>
                <span>Abstract &amp; Core Aim</span>
              </div>
              <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 sm:p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900">
                  Primary Objective
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  {project.aim.statement}
                </p>
                <div className="mt-4 rounded-xl border border-blue-200/80 bg-white p-4 text-xs sm:text-sm text-slate-700">
                  <span className="font-semibold text-blue-700">Core Hypothesis: </span>
                  {project.aim.coreHypothesis}
                </div>
              </div>
            </section>

            {/* II. Problem Statement & Theoretical Challenges */}
            <section className="mt-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Section II</span>
                <span>—</span>
                <span>Problem Statement &amp; Theoretical Challenges</span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                The Engineering Dilemma &amp; Naive Pitfalls
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                {project.problemStatement.overview}
              </p>

              {/* Challenge Grid */}
              <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {project.problemStatement.challenges.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-red-100 bg-red-50/30 p-4"
                  >
                    <div className="text-[11px] font-mono font-bold text-red-600">
                      CHALLENGE 0{idx + 1}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700">
                      {challenge}
                    </p>
                  </div>
                ))}
              </div>

              {/* Critical Failure Mode Callout */}
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900 sm:text-sm">
                <span className="font-bold text-amber-800">Critical Failure Mode Prevented: </span>
                {project.problemStatement.criticalFailureMode}
              </div>
            </section>

            {/* III. Architectural Methodology & Interactive Diagram */}
            <section className="mt-12">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Section III</span>
                <span>—</span>
                <span>System Architecture &amp; Data Pipeline</span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {project.architecture.diagramType}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {project.architecture.summary}
              </p>

              {/* Visual Interactive Pipeline Diagram */}
              <div className="mt-6 rounded-2xl border border-slate-200/90 bg-slate-950 p-5 sm:p-7 shadow-inner">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-semibold text-slate-300">
                    DIAGRAM // END-TO-END DATA FLOW TOPOLOGY
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    LIVE PIPELINE ACTIVE
                  </span>
                </div>

                {/* Pipeline Node Flow */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {project.architecture.pipeline.map((node, index) => (
                    <div
                      key={node.step}
                      className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-900"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            STEP {node.step}
                          </span>
                          {index < project.architecture.pipeline.length - 1 && (
                            <span className="text-[11px] text-slate-600 group-hover:text-blue-400 transition-colors">
                              →
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-xs font-bold text-slate-100">
                          {node.label}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          {node.sublabel}
                        </div>
                      </div>

                      {node.protocol && (
                        <div className="mt-3 rounded-md bg-slate-800/90 px-2 py-0.5 text-[9px] font-mono text-blue-400">
                          {node.protocol}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Algorithmic Mechanisms & Formal Invariants */}
              <div className="mt-6 space-y-4">
                {project.architecture.keyMechanisms.map((mech) => (
                  <div
                    key={mech.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-sm font-bold text-slate-900">
                      {mech.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed sm:text-sm">
                      {mech.description}
                    </p>
                    <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2 font-mono text-[11px] text-slate-800">
                      <span className="font-bold text-blue-600">Formal Invariant: </span>
                      {mech.invariant}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* IV. Empirical Benefits & Benchmarks */}
            <section className="mt-12">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Section IV</span>
                <span>—</span>
                <span>Quantitative Benchmarks &amp; Benefits</span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Empirical Evaluation Results
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {project.benefits.summary}
              </p>

              {/* Metrics Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {project.benefits.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm"
                  >
                    <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {m.value}
                    </div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {m.label}
                    </div>
                    <div className="mt-1.5 text-[10px] text-slate-500">
                      {m.detail}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bulleted Highlights */}
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Key Production Takeaways
                </h4>
                <ul className="mt-2.5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {project.benefits.impactHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* V. Tech Stack Requirements & Technical Justifications */}
            <section className="mt-12">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Section V</span>
                <span>—</span>
                <span>Tech Stack Matrix &amp; Architectural Justifications</span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Technology Selection Trade-offs
              </h2>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Technology</th>
                      <th className="px-5 py-3">Architectural Role</th>
                      <th className="px-5 py-3">Engineering Rationale &amp; Trade-off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {project.techStackMatrix.map((item) => (
                      <tr key={item.name} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {item.role}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600">
                          {item.rationale}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* VI. Future Scalability & Research Roadmap */}
            <section className="mt-12 pb-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                <span>Section VI</span>
                <span>—</span>
                <span>Future Scalability &amp; Research Roadmap</span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Planned Evolutions &amp; Distributed Milestones
              </h2>

              <div className="mt-6 space-y-4">
                {project.roadmap.map((road) => (
                  <div
                    key={road.phase}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start sm:gap-6"
                  >
                    <span className="w-24 shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-center font-mono text-xs font-bold text-slate-700">
                      {road.phase}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {road.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed sm:text-sm">
                        {road.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-5 py-4 sm:px-8">
            <span className="text-[11px] font-mono text-slate-400">
              DOCUMENT REFERENCE: {project.paperRef}
            </span>

            <div className="flex items-center gap-2.5">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-black"
              >
                <span>Inspect Source on GitHub</span>
                <span className="text-xs">↗</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Close Document
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
