"use client";

import { motion } from "framer-motion";

const workflow = [
  "Natural Language",
  "Agent Reasoning",
  "Policy Retrieval",
  "MCP Tool Selection",
  "Banking Service",
  "Kafka Audit Trail",
];

const systemChecks = [
  "Identity verified via session context",
  "Daily transfer limit checked against account tier",
  "Compliance policy retrieved via RAG",
  "executeTransfer parameters validated against schema",
  "Transfer scheduled and Kafka audit event emitted",
];

export default function NexaBankStudy() {
  return (
    <section className="relative border-t border-black/[0.08] bg-white py-32 sm:py-44 lg:py-52">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            <span>02 — Case Study</span>
            <span className="h-1 w-1 rounded-full bg-[#6e6e73]" />
            <span>AI Systems Architecture</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl md:text-6xl">
            Banking infrastructure for{" "}
            <span className="font-serif italic font-normal">AI agents</span>.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6e6e73] sm:text-lg">
            Nexa Bank combines Spring Boot microservices with the Model Context Protocol (MCP). It allows autonomous LLM agents to safely execute verified banking operations governed by real-time policy retrieval and strict parameter validation.
          </p>
        </motion.div>

        {/* Workflow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Agent Execution Pipeline
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-[#1d1d1f] sm:text-sm">
            {workflow.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-md bg-[#f5f5f7] px-3 py-1.5 border border-black/[0.06]">
                  {step}
                </span>
                {idx !== workflow.length - 1 && (
                  <span className="text-[#6e6e73]">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product-Style Interaction Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 rounded-2xl border border-black/[0.08] bg-[#f5f5f7] p-8 sm:p-12"
        >
          <div className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Interaction Example · Controlled Financial Execution
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            {/* User Prompt */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
                Natural Language Input
              </span>
              <div className="mt-3 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04]">
                <p className="text-base font-medium text-[#1d1d1f]">
                  &ldquo;Transfer ₹2,500 to Rahul tomorrow.&rdquo;
                </p>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#6e6e73]">
                The agent parses temporal intent, recipient identity, and transaction denomination without hardcoded keyword matching.
              </p>
            </div>

            {/* System Verification Steps */}
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73]">
                System Validation &amp; MCP Tool Execution
              </span>
              <div className="mt-3 space-y-2.5">
                {systemChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-3 text-xs sm:text-sm text-[#1d1d1f]">
                    <svg className="h-4 w-4 shrink-0 text-[#0071e3]" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8.5l3.5 3.5 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Understated Tech Stack & GitHub Link */}
        <div className="mt-14 flex flex-col justify-between gap-6 border-t border-black/[0.08] pt-8 sm:flex-row sm:items-center">
          <div className="text-xs text-[#6e6e73]">
            <span className="font-semibold text-[#1d1d1f]">Technologies:</span>{" "}
            Java 21 · Spring Boot Microservices · Model Context Protocol (MCP) · RAG · PostgreSQL · Apache Kafka · Docker
          </div>

          <a
            href="https://github.com/25Rohit25/NexaBank"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071e3] transition-colors hover:underline"
          >
            <span>View on GitHub</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
