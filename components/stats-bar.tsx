"use client";

import { motion, type Variants } from "framer-motion";

const stats = [
  { value: "450 TPS", label: "PayFlow Benchmark", sub: "50+ concurrent threads", accent: "#ff6b51" },
  { value: "2008", label: "LeetCode Knight", sub: "Global Top 2.53%", accent: "#f4f1eb" },
  { value: "2038", label: "CodeChef 5-Star", sub: "Highest Contest Rating", accent: "#ff6b51" },
  { value: "1,300+", label: "DSA Problems", sub: "LeetCode, CodeChef, GFG", accent: "#f4f1eb" },
  { value: "9.40", label: "KL University", sub: "CGPA (B.Tech CSE)", accent: "#38bdf8" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function StatsBar() {
  return (
    <section className="relative z-20 border-y border-white/10 bg-black/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-white/25 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: stat.accent }}>
                  {stat.value}
                </span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stat.accent }} />
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-1 border-t border-white/5 pt-2">
                <span className="text-[11px] font-semibold tracking-wide text-white/90">{stat.label}</span>
                <span className="font-mono text-[10px] text-white/40">{stat.sub}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
