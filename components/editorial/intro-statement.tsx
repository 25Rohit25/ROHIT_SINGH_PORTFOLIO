"use client";

import { motion } from "framer-motion";

export default function IntroStatement() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-44 lg:py-52">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            Philosophy &amp; Focus
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#1d1d1f] sm:text-6xl md:text-7xl lg:leading-[1.08]">
            Engineering systems where{" "}
            <span className="font-serif italic font-normal text-[#1d1d1f]">correctness</span> matters.
          </h2>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-[#1d1d1f] sm:text-base">
            <span>Backend Engineering</span>
            <span className="text-[#6e6e73]">·</span>
            <span>Distributed Systems</span>
            <span className="text-[#6e6e73]">·</span>
            <span>AI Agent Infrastructure</span>
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6e6e73] sm:text-lg">
            I specialize in designing high-concurrency transactional architectures, reproducible evaluation harnesses for autonomous coding agents, and resilient microservices built to stay correct under heavy thread contention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
