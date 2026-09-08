"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectWhitepaper } from "./project-docs";
import {
  ConcurrencyRaceSimulator,
  DoubleEntryLedgerDemo,
  IdempotencySimulator,
  DatabaseSchemaVisualizer,
} from "./payflow-interactive";

interface ProjectModalProps {
  project: ProjectWhitepaper | null;
  onClose: () => void;
}

type AudienceLayer = "recruiter" | "engineer" | "technical";
type ModalTab = "architecture" | "simulators" | "problem" | "benchmarks" | "stack" | "roadmap";

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [audienceLayer, setAudienceLayer] = useState<AudienceLayer>("engineer");
  const [activeTab, setActiveTab] = useState<ModalTab>("architecture");
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // Reset tab & node selection when project changes
  useEffect(() => {
    setAudienceLayer("engineer");
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
  const isPayflow = project.id === "payflow";

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const tabs: { id: ModalTab; label: string; icon: string }[] = [
    { id: "architecture", label: "Architecture & Journey", icon: "⚡" },
    ...(isPayflow ? [{ id: "simulators" as ModalTab, label: "Interactive Simulators", icon: "🎮" }] : []),
    { id: "problem", label: "Problem & Solution", icon: "🎯" },
    { id: "benchmarks", label: "Benchmarks & Impact", icon: "📊" },
    { id: "stack", label: "Tech Stack & Trade-offs", icon: "🛠️" },
    { id: "roadmap", label: "Future Roadmap", icon: "🚀" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] overflow-y-auto bg-[#f8fafc] text-slate-900"
      >
        {/* Sticky Top Navigation Bar */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8 sm:py-3.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              <span className="text-sm">←</span>
              <span>Back to Projects</span>
            </button>
            <span className="hidden h-4 w-px bg-slate-200 sm:inline-block" />
            <span className="rounded-md bg-blue-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white tracking-wider">
              {project.specId}
            </span>
            <span className="hidden rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 sm:inline-block">
              {project.categoryBadge}
            </span>
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-semibold text-emerald-700 md:inline-block">
              ✓ {project.status}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <span>GitHub</span>
              <span className="text-[10px]">↗</span>
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 sm:inline-flex"
              >
                <span>Live Demo</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              aria-label="Close"
              title="Close (Esc)"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Full Page Content Container */}
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10 md:py-12">
          {/* Project Title & Category Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-blue-600">{project.specId}</span>
              <span>•</span>
              <span>Authored by <strong className="text-slate-800">{project.authorship}</strong></span>
              <span>•</span>
              <span>{project.aim.targetDomain}</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base leading-relaxed">
              {project.subtitle}
            </p>

            {/* THREE-LAYER PERSONA SELECTOR */}
            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Select Perspective Layer
                </span>
                <span className="text-[11px] text-slate-500">
                  {audienceLayer === "recruiter" && "⏱ 30-Second Summary for Hiring Teams"}
                  {audienceLayer === "engineer" && "⚡ 3-5 Min Architecture, Dataflow & Simulators"}
                  {audienceLayer === "technical" && "🔬 Deep Dive: Concurrency, Schema, Internals"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setAudienceLayer("recruiter")}
                  className={`flex flex-col items-start rounded-xl p-3 text-left transition-all cursor-pointer ${
                    audienceLayer === "recruiter"
                      ? "border-2 border-blue-600 bg-white shadow-xs ring-2 ring-blue-500/20"
                      : "border border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span>👔 Layer 1: Recruiter</span>
                    {audienceLayer === "recruiter" && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.2 font-mono text-[9px] text-blue-700">ACTIVE</span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-slate-500">
                    What is it, why it matters, business impact &amp; metrics (30s)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAudienceLayer("engineer")}
                  className={`flex flex-col items-start rounded-xl p-3 text-left transition-all cursor-pointer ${
                    audienceLayer === "engineer"
                      ? "border-2 border-blue-600 bg-white shadow-xs ring-2 ring-blue-500/20"
                      : "border border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span>⚡ Layer 2: Engineer</span>
                    {audienceLayer === "engineer" && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.2 font-mono text-[9px] text-blue-700">ACTIVE</span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-slate-500">
                    Data flow, concurrency locks, idempotency &amp; Kafka outbox (3-5m)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAudienceLayer("technical")}
                  className={`flex flex-col items-start rounded-xl p-3 text-left transition-all cursor-pointer ${
                    audienceLayer === "technical"
                      ? "border-2 border-blue-600 bg-white shadow-xs ring-2 ring-blue-500/20"
                      : "border border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <span>🔬 Layer 3: Technical Reader</span>
                    {audienceLayer === "technical" && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.2 font-mono text-[9px] text-blue-700">ACTIVE</span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-slate-500">
                    Database ER schema, lock contention math, k6 stress &amp; metrics
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Section Switcher Tabs */}
            <div className="mt-5 flex gap-2 overflow-x-auto border-t border-slate-100 pt-4 scrollbar-none">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
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

          {/* Project Dashboard UI Preview Frame (If available) */}
          {project.thumbnail && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
              {/* Browser Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline-block">
                    payflow.app // dashboard
                  </span>
                </div>
                <div className="rounded-md bg-slate-200/60 px-3 py-1 font-mono text-[10px] text-slate-600 truncate max-w-xs sm:max-w-md">
                  https://payflow.rohit.engineering/dashboard
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-800">
                  ● LIVE UI
                </span>
              </div>

              {/* Full Resolution Screenshot Image */}
              <div className="relative overflow-hidden bg-slate-900">
                <img
                  src={project.thumbnail}
                  alt={`${project.title} Interface`}
                  className="w-full h-auto object-cover object-top"
                />
              </div>
            </div>
          )}

          {/* LAYER 1: RECRUITER 30-SECOND VIEW */}
          {audienceLayer === "recruiter" && (
            <div className="mt-8 space-y-6">
              {/* Executive Summary Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 font-mono text-xs font-bold text-blue-700">
                    LAYER 1 // 30-SECOND RECRUITER BRIEF
                  </span>
                  <span className="text-xs text-slate-500">High-Level Impact &amp; Engineering Thesis</span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase">01 // What is it?</span>
                    <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {project.layers?.recruiter.whatIsIt || project.aim.statement}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
                    <span className="font-mono text-xs font-bold text-amber-700 uppercase">02 // Why does it matter?</span>
                    <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {project.layers?.recruiter.whyItMatters || project.problemStatement.overview}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                    <span className="font-mono text-xs font-bold text-emerald-700 uppercase">03 // What Rohit Built</span>
                    <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {project.layers?.recruiter.whatBuilt ||
                        "Architected an atomic ledger pipeline utilizing pessimistic locking, idempotency keys, and the transactional outbox pattern."}
                    </p>
                  </div>
                </div>

                {/* Big Metric Proof Numbers */}
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Production Benchmark Proof
                  </span>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {project.benefits.metrics.map((m) => (
                      <div key={m.label} className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 text-center">
                        <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">{m.value}</div>
                        <div className="mt-1 font-mono text-[10px] font-bold text-blue-600 uppercase">{m.label}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{m.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Real-World Highlights */}
                <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Key Architectural Wins
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
            </div>
          )}

          {/* LAYER 2: ENGINEER VIEW (3-5 MINUTE STORY & ARCHITECTURE) */}
          {audienceLayer === "engineer" && (
            <div className="mt-8 space-y-8">
              {/* THE STORY & CENTRAL QUESTION */}
              {isPayflow && (
                <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-6 sm:p-8 md:p-10 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white">
                      ENGINEERING THESIS &amp; CENTRAL QUESTION
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">
                    How do you guarantee that ₹1,000 leaves one wallet exactly once and reaches another wallet exactly once?
                  </h2>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700">
                    A payment API looks simple from the outside: <code className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs font-bold text-slate-800">POST /transfer (₹1,000 Rohit → Rahul)</code>.
                    But internally, four fatal failures can occur simultaneously:
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs sm:text-sm text-slate-700">
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                      <strong className="text-red-600">1. Concurrent Race Conditions:</strong> Two transfer requests execute at the exact same millisecond against the same balance.
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                      <strong className="text-purple-600">2. Flaky Network Retries:</strong> Client drops connection before HTTP 200 arrives and clicks &quot;Pay&quot; again.
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                      <strong className="text-amber-600">3. Dual-Write Split-Brain:</strong> Database updates successfully while an event fails to reach the broker.
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                      <strong className="text-blue-600">4. Synchronous Blocking:</strong> Users send transactions faster than heavy downstream fraud checks can process.
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm font-medium text-slate-600">
                    For ordinary applications, these are annoying bugs. For a financial system, they mean duplicated payments or lost funds.
                    Every engineering decision in Payflow is a direct answer to this central question.
                  </p>
                </div>
              )}

              {/* 01 — PROTECTING MONEY FROM CONCURRENCY (INTERACTIVE) */}
              {isPayflow && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="font-mono text-xs font-bold text-amber-600">DECISION 01</span>
                    <h3 className="text-lg font-bold text-slate-900">Protecting Money From Concurrency</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-1">
                    Imagine the wallet contains ₹1,000. Two requests arrive simultaneously: Request A (withdraw ₹800) and Request B (withdraw ₹800).
                    Without concurrency control, both read ₹1,000, both approve, and the system spends ₹1,600 from a ₹1,000 account!
                    Payflow prevents this via pessimistic database row-locking (<code className="font-mono text-slate-800">SELECT ... FOR UPDATE</code>).
                  </p>
                  <ConcurrencyRaceSimulator />
                </div>
              )}

              {/* 02 — WHY A DOUBLE-ENTRY LEDGER? (INTERACTIVE) */}
              {isPayflow && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="font-mono text-xs font-bold text-blue-600">DECISION 02</span>
                    <h3 className="text-lg font-bold text-slate-900">Why a Double-Entry Ledger?</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-1">
                    A naive wallet stores <code className="font-mono text-slate-800">wallet.balance = 5000</code> and simply increments or decrements it.
                    That number shows the current state, but not the full financial story. Payflow records corresponding debit and credit entries.
                    When Rohit sends Rahul ₹500: Rohit is debited -₹500, Rahul is credited +₹500, and the sum is strictly ₹0.00.
                    Money was transferred. It was not created, and it was not destroyed.
                  </p>
                  <DoubleEntryLedgerDemo />
                </div>
              )}

              {/* 03 — WHAT HAPPENS IF CLIENT SENDS SAME REQUEST TWICE? (INTERACTIVE) */}
              {isPayflow && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span className="font-mono text-xs font-bold text-purple-600">DECISION 03</span>
                    <h3 className="text-lg font-bold text-slate-900">Distributed Idempotency (Preventing Duplicate Retries)</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-1">
                    A user clicks Transfer. The payment succeeds in the database, but before the HTTP response reaches the phone, the cellular connection drops.
                    The user clicks Transfer again. With an <code className="font-mono text-slate-800">idempotency-key: tx_8af31</code>, Redis checks if it was already processed.
                    If yes, it returns the original receipt instantly in 0.8ms without executing a second debit.
                  </p>
                  <IdempotencySimulator />
                </div>
              )}

              {/* 04 — WHY KAFKA & TRANSACTIONAL OUTBOX? */}
              {isPayflow && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600">DECISION 04</span>
                    <h3 className="text-lg font-bold text-slate-900">Why Kafka &amp; The Transactional Outbox?</h3>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Fraud detection, user notifications, and analytics are essential, but they must not block the core transfer latency path.
                    Directly calling Kafka inside a database transaction causes a fatal dual-write split-brain if either system fails midway.
                    Instead, Payflow writes the audit event to an <code className="font-mono text-slate-800">outbox_events</code> table in the exact same DB transaction,
                    then an asynchronous relay worker dispatches it to Kafka.
                  </p>

                  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6 text-slate-200 font-mono text-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase pb-3 border-b border-slate-800">
                      Asynchronous Decoupling Topology
                    </div>
                    <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center">
                      <div className="rounded-xl border border-blue-500/50 bg-blue-950/40 p-3 w-full md:w-auto">
                        <div className="font-bold text-blue-400">TRANSFER API</div>
                        <div className="text-[10px] text-slate-400 mt-1">HTTP Request</div>
                      </div>
                      <span className="text-slate-500">→</span>
                      <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/40 p-3 w-full md:w-auto">
                        <div className="font-bold text-emerald-400">DATABASE TRANSACTION</div>
                        <div className="text-[10px] text-slate-400 mt-1">Pessimistic Lock &amp; Ledger</div>
                      </div>
                      <span className="text-slate-500">→</span>
                      <div className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-3 w-full md:w-auto">
                        <div className="font-bold text-amber-400">TRANSACTIONAL OUTBOX</div>
                        <div className="text-[10px] text-slate-400 mt-1">Atomic Event Staging</div>
                      </div>
                      <span className="text-slate-500">→</span>
                      <div className="rounded-xl border border-purple-500/50 bg-purple-950/40 p-3 w-full md:w-auto">
                        <div className="font-bold text-purple-400">APACHE KAFKA</div>
                        <div className="text-[10px] text-slate-400 mt-1">Fraud · Audit · Analytics</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 05 — THE COMPLETE JOURNEY OF ONE TRANSFER (VISUAL CENTERPIECE) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {isPayflow ? "DECISION 05 // VISUAL CENTERPIECE" : "ARCHITECTURE PIPELINE"}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                      The Complete Journey of One Transfer
                    </h3>
                  </div>

                  {/* Simulator Control */}
                  <button
                    type="button"
                    onClick={() => setIsSimulating(!isSimulating)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      isSimulating
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    <span>{isSimulating ? "⏸ Pause Flow" : "▶ Animate Packet Flow"}</span>
                  </button>
                </div>

                {/* The Interactive Visual Diagram (Clickable Nodes) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-7 shadow-inner">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-mono text-xs font-semibold text-slate-300">
                      INTERACTIVE TOPOLOGY // CLICK ANY NODE TO INSPECT PAYLOAD &amp; SLA
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                      <span className={`h-2 w-2 rounded-full bg-emerald-400 ${isSimulating ? "animate-ping" : ""}`} />
                      {isSimulating ? `PACKET AT STEP ${activeNode.step}` : "IDLE (CLICK NODE)"}
                    </span>
                  </div>

                  {/* Node Grid */}
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
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
                          className={`group relative flex flex-col justify-between rounded-xl p-3 text-left transition-all cursor-pointer ${
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
                            <div className="mt-1.5 text-xs font-bold text-slate-100 group-hover:text-white">
                              {node.label}
                            </div>
                            <div className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">
                              {node.sublabel}
                            </div>
                          </div>

                          {node.protocol && (
                            <div
                              className={`mt-2.5 rounded px-1.5 py-0.5 text-[9px] font-mono ${
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

                    {/* Code / Payload Example */}
                    {activeNode.payloadExample && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between rounded-t-lg bg-slate-950 px-3.5 py-1.5 text-[10px] font-mono text-slate-400">
                          <span>TRANSMISSION PAYLOAD / EXECUTION LOG</span>
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
              </div>
            </div>
          )}

          {/* LAYER 3: TECHNICAL READER (DEEP DIVE INTERNALS) */}
          {audienceLayer === "technical" && (
            <div className="mt-8 space-y-8">
              {/* TRANSACTION BOUNDARIES & CONCURRENCY STRATEGY */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-white">
                    LAYER 3 // PRODUCTION INTERNALS &amp; FAILURE SCENARIOS
                  </span>
                </div>

                {/* 1. Transaction Boundaries */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    1. Atomic Transaction Boundaries &amp; Rollback Guarantees
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {project.layers?.technicalReader.transactionBoundaries ||
                      "Enforced using Spring Boot declarative @Transactional(isolation = Isolation.READ_COMMITTED) boundaries. Either all balance mutations, journal lines, and outbox events commit together, or all are cleanly rolled back."}
                  </p>
                </div>

                {/* 2. Database Model Schema */}
                {isPayflow && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      2. Relational Database Model
                    </h3>
                    <DatabaseSchemaVisualizer />
                  </div>
                )}

                {/* 3. Concurrency Strategy: Pessimistic vs Optimistic */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                  <h3 className="text-base font-bold text-slate-900">
                    3. Concurrency Strategy: Why Pessimistic Locking Was Chosen
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {project.layers?.technicalReader.concurrencyDeepDive}
                  </p>

                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="border-b border-slate-200 bg-slate-100/70 text-[10px] text-slate-500 font-bold uppercase">
                        <tr>
                          <th className="px-4 py-2.5">Attribute</th>
                          <th className="px-4 py-2.5">Optimistic Locking (@Version)</th>
                          <th className="px-4 py-2.5 text-blue-700">Payflow Pessimistic Locking (SELECT FOR UPDATE)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="px-4 py-2 font-bold text-slate-900">Behavior under 50+ threads</td>
                          <td className="px-4 py-2 text-red-600">Catastrophic retry storm (85%+ rollbacks)</td>
                          <td className="px-4 py-2 text-emerald-600 font-semibold">Deterministic queueing (0% retry storm)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-bold text-slate-900">p99 Latency SLA</td>
                          <td className="px-4 py-2 text-red-600">&gt; 2,200 ms under contention</td>
                          <td className="px-4 py-2 text-emerald-600 font-semibold">&lt; 114 ms sustained</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-bold text-slate-900">Deadlock Prevention</td>
                          <td className="px-4 py-2">Optimistic checks on commit</td>
                          <td className="px-4 py-2 text-emerald-600 font-semibold">Strict ascending ID ordering: min(A,B) → max(A,B)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Event Consistency & Dual-Write Hazard */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    4. Event Consistency &amp; Dual-Write Hazard Resolution
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {project.layers?.technicalReader.eventConsistency}
                  </p>
                </div>

                {/* 5. Rate Limiting */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    5. Endpoint Rate Limiting &amp; Edge Protection
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {project.layers?.technicalReader.rateLimiting}
                  </p>
                </div>

                {/* 6. Observability & Telemetry */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    6. Production Observability Stack
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {project.layers?.technicalReader.observability}
                  </p>
                </div>

                {/* 7. Load Testing Methodology & Metrics */}
                {project.layers?.technicalReader.loadTesting && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 sm:p-6">
                    <h3 className="text-base font-bold text-slate-900">
                      7. k6 Concurrency Load Testing Methodology
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {project.layers.technicalReader.loadTesting.methodology}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-6 font-mono text-center">
                      <div className="rounded-xl border border-blue-200 bg-white p-3">
                        <div className="text-[10px] text-slate-400">VUs</div>
                        <div className="text-sm font-bold text-slate-900">{project.layers.technicalReader.loadTesting.vus}</div>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-white p-3">
                        <div className="text-[10px] text-slate-400">Throughput</div>
                        <div className="text-sm font-bold text-emerald-600">{project.layers.technicalReader.loadTesting.tps}</div>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-white p-3">
                        <div className="text-[10px] text-slate-400">p50 Latency</div>
                        <div className="text-sm font-bold text-slate-900">{project.layers.technicalReader.loadTesting.p50}</div>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-white p-3">
                        <div className="text-[10px] text-slate-400">p95 Latency</div>
                        <div className="text-sm font-bold text-slate-900">{project.layers.technicalReader.loadTesting.p95}</div>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-white p-3">
                        <div className="text-[10px] text-slate-400">p99 Latency</div>
                        <div className="text-sm font-bold text-blue-700">{project.layers.technicalReader.loadTesting.p99}</div>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-white p-3">
                        <div className="text-[10px] text-slate-400">Error Rate</div>
                        <div className="text-sm font-bold text-emerald-600">{project.layers.technicalReader.loadTesting.errorRate}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECONDARY TAB CONTENT (For direct navigation) */}
          <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xs">
            {/* TAB: INTERACTIVE SIMULATORS (If clicked directly from tabs) */}
            {activeTab === "simulators" && isPayflow && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Payflow Interactive Testing Suite
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Interact with real concurrency locks, double-entry ledgers, idempotency keys, and relational schemas.
                  </p>
                </div>

                <ConcurrencyRaceSimulator />
                <DoubleEntryLedgerDemo />
                <IdempotencySimulator />
                <DatabaseSchemaVisualizer />
              </div>
            )}

            {/* TAB: PROBLEM & SOLUTION */}
            {activeTab === "problem" && (
              <div className="space-y-8">
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

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
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

                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs sm:text-sm text-amber-900">
                    <span className="font-bold text-amber-800">Critical Failure Mode Prevented: </span>
                    {project.problemStatement.criticalFailureMode}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BENCHMARKS & IMPACT */}
            {activeTab === "benchmarks" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Measured Production Benchmarks &amp; Performance
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {project.benefits.summary}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {project.benefits.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs"
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

            {/* TAB: TECH STACK & TRADE-OFFS */}
            {activeTab === "stack" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Tech Stack Selection &amp; Architectural Trade-offs
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Why each tool was selected over alternative options.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
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
                          <td className="px-5 py-3.5 text-xs text-slate-600 leading-relaxed">
                            {item.rationale}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: FUTURE ROADMAP */}
            {activeTab === "roadmap" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
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
                      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start sm:gap-6 shadow-xs"
                    >
                      <span className="w-28 shrink-0 rounded-md bg-slate-900 px-2.5 py-1 text-center font-mono text-xs font-bold text-white">
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

          {/* Bottom Action Footer */}
          <div className="mt-8 mb-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row shadow-xs">
            <span className="text-xs text-slate-500">
              System Specification: <strong className="text-slate-800">{project.specId}</strong> · All tests passing
            </span>

            <div className="flex items-center gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-black cursor-pointer"
              >
                <span>Inspect Source on GitHub</span>
                <span className="text-xs">↗</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
              >
                ← Return to Portfolio
              </button>
            </div>
          </div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
