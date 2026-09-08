"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    value: "450 TPS",
    label: "Sustained Throughput",
    detail: "PayFlow benchmark under 50+ concurrent threads with zero inconsistencies",
  },
  {
    value: "<85 ms",
    label: "Pipeline Latency",
    detail: "Kafka Transactional Outbox asynchronous event publishing",
  },
  {
    value: "2008",
    label: "LeetCode Knight",
    detail: "Global Top 2.53% contest rating among competitive programmers",
  },
  {
    value: "1,300+",
    label: "Algorithm Problems",
    detail: "Solved across LeetCode, CodeChef (2038 5-Star), and GeeksforGeeks",
  },
  {
    value: "9.40",
    label: "Academic CGPA",
    detail: "B.Tech Computer Science & Engineering at KL University (2023–2027)",
  },
];

export default function SelectedNumbers() {
  return (
    <section className="relative border-y border-black/[0.06] bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-xl"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            Measured Impact
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
            Selected engineering numbers.
          </h3>
        </motion.div>

        {/* Spacious Metric Flow (Zero Cards) */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-16">
          {metrics.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <span className="font-mono text-5xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-6xl lg:text-7xl">
                {item.value}
              </span>
              <span className="mt-3 text-sm font-semibold tracking-tight text-[#1d1d1f]">
                {item.label}
              </span>
              <p className="mt-1 text-xs leading-relaxed text-[#6e6e73]">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
