"use client";

import { motion } from "framer-motion";

const pipelineSteps = [
  { step: "01", name: "Task Specification", desc: "Rigorous problem definition & edge cases" },
  { step: "02", name: "Docker Sandbox", desc: "Reproducible clean build & test env" },
  { step: "03", name: "AI Agent Execution", desc: "Autonomous multi-step code generation" },
  { step: "04", name: "Automated Verifier", desc: "Deterministic test suites & lint checks" },
  { step: "05", name: "Correctness Eval", desc: "CI-evaluated pass/fail benchmarks" },
];

const contributions = [
  "Designed and refined challenging software-engineering tasks requiring multi-step reasoning, debugging, and domain problem solving for AI agents.",
  "Built reproducible task environments, reference solutions, and automated verifiers to evaluate AI-agent outputs against task-specific correctness requirements.",
  "Tested task specifications and verification logic through CI-based evaluation, identifying edge cases and debugging failures to improve evaluation reliability.",
];

const tags = [
  "AI Agent Evaluation",
  "Automated Verifiers",
  "CI-Based Evaluation",
  "Multi-Step Reasoning",
  "Docker Sandboxes",
  "Edge-Case Triage",
];

export default function Experience() {
  return (
    <section id="experience" className="relative z-20 border-t border-slate-200/80 bg-[#f8fafc] py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-2.5"
        >
          <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Professional Experience
          </span>
        </motion.div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:rounded-3xl">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                  Handshake AI
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Active Role · Remote
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-blue-600">
                Software Engineering Contractor · Jul 2026 – Present
              </p>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                Building reproducible software-engineering evaluation environments, reference implementations, and automated verifiers for autonomous coding agents.
              </p>
            </div>

            {/* Quick Skills Pill Row */}
            <div className="flex flex-wrap gap-1.5 sm:max-w-xs sm:justify-end">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visual Evaluation Pipeline */}
          <div className="mt-8 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Agent Evaluation Pipeline Architecture
              </span>
              <span className="font-mono text-[9px] font-bold text-blue-600">CI VERIFICATION WORKFLOW</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {pipelineSteps.map((p, idx) => (
                <div key={p.step} className="relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                      <span>STEP {p.step}</span>
                      {idx !== pipelineSteps.length - 1 && (
                        <span className="hidden text-slate-300 lg:inline">→</span>
                      )}
                    </div>
                    <div className="mt-1.5 text-xs font-bold text-slate-900">{p.name}</div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 leading-snug">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Responsibilities & Outcomes */}
          <div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Engineering Responsibilities
            </div>
            {contributions.map((b, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
