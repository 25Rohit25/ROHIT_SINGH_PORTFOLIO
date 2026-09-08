"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectWhitepaper } from "./project-docs";

interface ProjectModalProps {
  project: ProjectWhitepaper | null;
  onClose: () => void;
}

type ModalTab = "architecture" | "problem" | "benchmarks" | "stack" | "roadmap";

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("architecture");
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // Reset tab & node selection when project changes
  useEffect(() => {
    setActiveTab("architecture");
    setActiveNodeIndex(0);
    setIsSimulating(false);
  }, [project?.id]);

  // Live simulation timer that moves data packet through nodes
  useEffect(() => {
    if (!isSimulating || !project) return;
    const interval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % project.architecture.pipeline.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isSimulating, project]);

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

  const activeNode = project.architecture.pipeline[activeNodeIndex] || project.architecture.pipeline[0];

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const tabs: { id: ModalTab; label: string; icon: string }[] = [
    { id: "architecture", label: "Architecture & Flow", icon: "⚡" },
    { id: "problem", label: "Problem & Solution", icon: "🎯" },
    { id: "benchmarks", label: "Benchmarks & Impact", icon: "📊" },
    { id: "stack", label: "Tech Stack & Trade-offs", icon: "🛠️" },
    { id: "roadmap", label: "Future Roadmap", icon: "🚀" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#fdfdfc] shadow-2xl md:rounded-3xl"
        >
          {/* Top Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5 sm:px-8 sm:py-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="rounded-md bg-blue-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white tracking-wider">
                {project.specId}
              </span>
              <span className="hidden h-3 w-px bg-slate-200 sm:inline-block" />
              <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                {project.categoryBadge}
              </span>
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-semibold text-emerald-700 md:inline-block">
                ✓ {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <span>GitHub</span>
                <span className="text-[10px]">↗</span>
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 sm:inline-flex"
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

          {/* Project Title Header */}
          <div className="border-b border-slate-200 bg-white px-5 pt-5 pb-4 sm:px-8">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
              {project.title}
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
              {project.subtitle}
            </p>

            {/* Interactive Section Switcher Tabs */}
            <div className="mt-5 flex gap-1.5 overflow-x-auto border-t border-slate-100 pt-3 scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    <span className="mr-1.5">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Main Content Area */}
          <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
            {/* TAB 1: ARCHITECTURE & INTERACTIVE FLOW SIMULATOR */}
            {activeTab === "architecture" && (
              <div className="space-y-8">
                {/* Interactive Simulator Header */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                      {project.architecture.diagramType}
                    </h2>
                    <p className="text-xs text-slate-600 sm:text-sm">
                      {project.architecture.summary}
                    </p>
                  </div>

                  {/* Play/Pause Simulation Control */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSimulating(!isSimulating)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        isSimulating
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      <span>{isSimulating ? "⏸ Pause Flow" : "▶ Simulate Request Flow"}</span>
                    </button>
                  </div>
                </div>

                {/* The Interactive Visual Diagram (Clickable Nodes) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-7 shadow-inner">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-semibold text-slate-300">
                      INTERACTIVE TOPOLOGY // CLICK ANY NODE TO INSPECT
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                      <span className={`h-2 w-2 rounded-full bg-emerald-400 ${isSimulating ? "animate-ping" : ""}`} />
                      {isSimulating ? `PACKET AT STEP ${activeNode.step}` : "IDLE (CLICK NODE)"}
                    </span>
                  </div>

                  {/* Node Grid with Connecting Arrows */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {project.architecture.pipeline.map((node, index) => {
                      const isSelected = activeNodeIndex === index;
                      return (
                        <button
                          key={node.step}
                          type="button"
                          onClick={() => {
                            setActiveNodeIndex(index);
                            setIsSimulating(false);
                          }}
                          className={`group relative flex flex-col justify-between rounded-xl p-3.5 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-2 border-blue-400 bg-slate-900 shadow-[0_0_20px_rgba(96,165,250,0.25)] ring-2 ring-blue-500/20"
                              : "border border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-mono text-[10px] font-bold ${
                                  isSelected ? "text-blue-400" : "text-slate-500"
                                }`}
                              >
                                STEP {node.step}
                              </span>
                              {isSelected && (
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                              )}
                            </div>
                            <div className="mt-2 text-xs font-bold text-slate-100 group-hover:text-white">
                              {node.label}
                            </div>
                            <div className="mt-0.5 text-[10px] text-slate-400">
                              {node.sublabel}
                            </div>
                          </div>

                          {node.protocol && (
                            <div
                              className={`mt-3 rounded px-2 py-0.5 text-[9px] font-mono ${
                                isSelected
                                  ? "bg-blue-950 text-blue-300 font-semibold"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {node.protocol}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Node Deep-Dive Inspector Panel */}
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-500/20 px-2 py-0.5 font-mono text-xs font-bold text-blue-400">
                          NODE INSPECTOR // STEP {activeNode.step}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {activeNode.label}
                        </span>
                      </div>

                      {activeNode.latencyOrSla && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
                          SLA: {activeNode.latencyOrSla}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {activeNode.description}
                    </p>

                    {/* Code / Payload Example if available */}
                    {activeNode.payloadExample && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between rounded-t-lg bg-slate-950 px-3.5 py-1.5 text-[10px] font-mono text-slate-400">
                          <span>TRANSMISSION PAYLOAD / CODE EXECUTION</span>
                          <button
                            type="button"
                            onClick={() => copyCode(activeNode.payloadExample || "")}
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedPayload ? "✓ Copied" : "Copy Payload"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto rounded-b-lg bg-black/80 p-3.5 font-mono text-[11px] leading-relaxed text-emerald-300">
                          <code>{activeNode.payloadExample}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Architectural Mechanisms & Invariants */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Key Architectural Invariants &amp; Algorithms
                  </h3>
                  <div className="mt-4 space-y-4">
                    {project.architecture.keyMechanisms.map((mech) => (
                      <div
                        key={mech.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <h4 className="text-sm font-bold text-slate-900">
                          {mech.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed sm:text-sm">
                          {mech.description}
                        </p>
                        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-3.5 py-2 font-mono text-[11px] text-blue-900">
                          <span className="font-bold text-blue-700">Guaranteed Invariant: </span>
                          {mech.invariant}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROBLEM STATEMENT & AIM */}
            {activeTab === "problem" && (
              <div className="space-y-8">
                {/* Aim & Purpose */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Why I Built This Project
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                    Core Mission &amp; Engineering Thesis
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                    {project.aim.statement}
                  </p>
                  <div className="mt-4 rounded-xl border border-blue-200/80 bg-white p-4 text-xs sm:text-sm text-slate-700">
                    <span className="font-bold text-blue-700">Core Technical Hypothesis: </span>
                    {project.aim.coreHypothesis}
                  </div>
                </div>

                {/* The Real-World Bottleneck */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    The Problem &amp; The Danger of Naive Approaches
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                    {project.problemStatement.overview}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

                  {/* Failure Mode Guard */}
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-900">
                    <span className="font-bold text-amber-800">Critical Failure Mode Prevented: </span>
                    {project.problemStatement.criticalFailureMode}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BENCHMARKS & METRICS */}
            {activeTab === "benchmarks" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Measured Production Benchmarks &amp; Performance
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {project.benefits.summary}
                  </p>

                  {/* Metrics Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {project.benefits.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
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
                </div>

                {/* Key Real-World Highlights */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Concrete System Advantages
                  </h4>
                  <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700">
                    {project.benefits.impactHighlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: TECH STACK MATRIX */}
            {activeTab === "stack" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tech Stack Selection &amp; Architectural Trade-offs
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Why each tool was selected over alternative options.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Technology</th>
                        <th className="px-5 py-3">Role in Architecture</th>
                        <th className="px-5 py-3">Why I Chose This Over Alternatives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {project.techStackMatrix.map((item) => (
                        <tr key={item.name} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 font-medium">
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
              </div>
            )}

            {/* TAB 5: ROADMAP */}
            {activeTab === "roadmap" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Future Scalability &amp; Engineering Roadmap
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Planned architectural evolutions and next-generation milestones.
                  </p>
                </div>

                <div className="space-y-4">
                  {project.roadmap.map((road) => (
                    <div
                      key={road.phase}
                      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start sm:gap-6 shadow-sm"
                    >
                      <span className="w-24 shrink-0 rounded-md bg-slate-900 px-2.5 py-1 text-center font-mono text-xs font-bold text-white">
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
              </div>
            )}
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-5 py-3.5 sm:px-8">
            <span className="text-[11px] font-medium text-slate-500">
              Authored by <span className="font-semibold text-slate-800">{project.authorship}</span>
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
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
              >
                Close Deep Dive
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
