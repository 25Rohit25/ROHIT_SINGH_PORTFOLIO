"use client";

import { motion } from "framer-motion";

const pipeline = [
  "Client",
  "API Gateway",
  "Redis Idempotency",
  "Transaction Service",
  "PostgreSQL Ledger",
  "Transactional Outbox",
  "Apache Kafka",
  "Downstream Services",
];

export default function PayFlowStudy() {
  return (
    <section id="projects" className="relative py-32 sm:py-44 lg:py-52">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            <span>01 — Case Study</span>
            <span className="h-1 w-1 rounded-full bg-[#6e6e73]" />
            <span>Distributed Systems</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl md:text-6xl">
            Financial infrastructure built for{" "}
            <span className="font-serif italic font-normal">concurrency</span>.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6e6e73] sm:text-lg">
            PayFlow is a high-throughput backend designed for atomic wallet transfers, idempotent APIs, and double-entry ledger bookkeeping. Engineered to guarantee ACID correctness when multiple threads mutate the same balance concurrently.
          </p>
        </motion.div>

        {/* Prominent Metrics Row (Apple Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-1 gap-8 border-y border-black/[0.08] py-10 sm:grid-cols-3 sm:py-12"
        >
          <div>
            <div className="font-mono text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              450 TPS
            </div>
            <div className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6e6e73]">
              Sustained Throughput
            </div>
            <div className="mt-1 text-xs text-[#6e6e73]">
              Benchmarked across 50+ concurrent threads
            </div>
          </div>

          <div>
            <div className="font-mono text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              &lt;85 ms
            </div>
            <div className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6e6e73]">
              Event Pipeline Latency
            </div>
            <div className="mt-1 text-xs text-[#6e6e73]">
              Transactional Outbox + Apache Kafka delivery
            </div>
          </div>

          <div>
            <div className="font-mono text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
              0
            </div>
            <div className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6e6e73]">
              Ledger Inconsistencies
            </div>
            <div className="mt-1 text-xs text-[#6e6e73]">
              Pessimistic row locking eliminates race conditions
            </div>
          </div>
        </motion.div>

        {/* Minimal Architecture Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Architecture &amp; Data Pipeline
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-[#1d1d1f] sm:text-sm">
            {pipeline.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-md bg-white px-3 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-black/[0.06]">
                  {step}
                </span>
                {idx !== pipeline.length - 1 && (
                  <span className="text-[#6e6e73]">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technical Deep Dive Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12"
        >
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
              The Concurrency Challenge
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#6e6e73] sm:text-sm">
              Simultaneous transfers modifying the same wallet balance produce lost updates and double-spend vulnerabilities. Standard optimistic locking triggers massive retry storms under heavy multi-threaded contention.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
              Pessimistic Locking &amp; Idempotency
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#6e6e73] sm:text-sm">
              Applied PostgreSQL row-level locks via <code className="font-mono text-xs text-[#1d1d1f]">SELECT ... FOR UPDATE</code> within strict transaction boundaries, synchronized with Redis idempotency keys to drop duplicate client retries.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">
              Transactional Outbox &amp; Verification
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#6e6e73] sm:text-sm">
              Eliminated dual-write failures by publishing events to Kafka via the outbox pattern. Verified under K6 load tests with 800+ concurrent virtual users, maintaining p99 response times below 120 ms.
            </p>
          </div>
        </motion.div>

        {/* Understated Tech Stack & GitHub Link */}
        <div className="mt-14 flex flex-col justify-between gap-6 border-t border-black/[0.08] pt-8 sm:flex-row sm:items-center">
          <div className="text-xs text-[#6e6e73]">
            <span className="font-semibold text-[#1d1d1f]">Technologies:</span>{" "}
            Java 21 · Spring Boot · PostgreSQL · Redis · Apache Kafka · Docker · K6 · Prometheus · Grafana
          </div>

          <a
            href="https://github.com/25Rohit25/Payflow"
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
