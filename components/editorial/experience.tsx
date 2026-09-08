"use client";

import { motion } from "framer-motion";

const pipeline = [
  "Task Specification",
  "Sandbox",
  "AI Agent",
  "Automated Verifier",
  "Correctness Evaluation",
];

const contributions = [
  "Designed and refined challenging software-engineering tasks requiring multi-step reasoning, debugging, and domain problem solving for AI agents.",
  "Built reproducible task environments, reference solutions, and automated verifiers to evaluate AI-agent outputs against task-specific correctness requirements.",
  "Tested task specifications and verification logic through CI-based evaluation, identifying edge cases and debugging failures to improve evaluation reliability.",
];

export default function Experience() {
  return (
    <section id="experience" className="relative border-t border-black/[0.08] bg-white py-32 sm:py-44 lg:py-52">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            Professional Experience
          </div>

          <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-4xl md:text-5xl">
              Handshake AI
            </h2>
            <span className="text-sm font-medium text-[#6e6e73]">
              Software Engineering Contractor · Jul 2026 – Present (Remote)
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6e6e73] sm:text-lg">
            Building reproducible software-engineering evaluation environments and automated verifiers for autonomous coding agents.
          </p>
        </motion.div>

        {/* Simple Evaluation Pipeline (Zero Dashboard Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14"
        >
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Evaluation Pipeline Architecture
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-[#1d1d1f] sm:text-sm">
            {pipeline.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-md bg-[#f5f5f7] px-3.5 py-1.5 border border-black/[0.06]">
                  {step}
                </span>
                {idx !== pipeline.length - 1 && (
                  <span className="text-[#6e6e73]">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Engineering Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 border-t border-black/[0.08] pt-12"
        >
          <div className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Engineering Contributions
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {contributions.map((bullet, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-mono text-xs text-[#6e6e73]">0{idx + 1}</span>
                <p className="mt-3 text-sm leading-relaxed text-[#1d1d1f]">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
