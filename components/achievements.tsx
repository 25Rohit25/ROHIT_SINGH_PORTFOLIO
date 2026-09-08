"use client";

import { motion } from "framer-motion";

const achievements = [
  {
    category: "LeetCode",
    badge: "Knight Tier",
    metric: "2008",
    subMetric: "Peak Contest Rating",
    title: "LeetCode Knight",
    description: "Ranked in the Global Top 2.53% among hundreds of thousands of competitive developers worldwide.",
    highlight: "Global Top 2.53%",
    bg: "bg-[#fff7ed]",
    border: "border-[#fed7aa]",
    accent: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-800",
  },
  {
    category: "CodeChef",
    badge: "5-Star Master",
    metric: "2038",
    subMetric: "Peak Contest Rating",
    title: "CodeChef 5-Star Programmer",
    description: "Master division competitor solving complex combinatorial and algorithmic challenges under tight contest constraints.",
    highlight: "Division 1 Master",
    bg: "bg-[#f0f9ff]",
    border: "border-[#bae6fd]",
    accent: "text-sky-600",
    badgeBg: "bg-sky-100 text-sky-800",
  },
  {
    category: "Problem Solving",
    badge: "Algorithmic Rigor",
    metric: "1,300+",
    subMetric: "Problems Solved",
    title: "DSA Solved Across Platforms",
    description: "Extensive problem-solving track record across LeetCode, CodeChef, and GeeksforGeeks covering trees, graphs, DP, and concurrency.",
    highlight: "LeetCode · CodeChef · GFG",
    bg: "bg-[#f0fdf4]",
    border: "border-[#bbf7d0]",
    accent: "text-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-800",
  },
  {
    category: "Hackathon",
    badge: "National Finalist",
    metric: "Top 1,500",
    subMetric: "National Rank",
    title: "Google Big Code Challenge",
    description: "Placed in the top 1% nationwide among 150,000+ registered competitive programmers and software engineers.",
    highlight: "Top 1% of 150K+",
    bg: "bg-[#faf5ff]",
    border: "border-[#e9d5ff]",
    accent: "text-purple-600",
    badgeBg: "bg-purple-100 text-purple-800",
  },
  {
    category: "Academics",
    badge: "KL University",
    metric: "9.40",
    subMetric: "CGPA / 10.0",
    title: "B.Tech Computer Science",
    description: "KL University, Vijayawada (2023 – 2027). Consistently maintained top academic honors across core computer science curricula.",
    highlight: "Class Honors · 2023–2027",
    bg: "bg-[#eef2ff]",
    border: "border-[#c7d2fe]",
    accent: "text-indigo-600",
    badgeBg: "bg-indigo-100 text-indigo-800",
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="relative z-20 border-t border-slate-200/80 bg-[#f8fafc] py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Competitive Rigor &amp; Academics
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Competitive ratings &amp; <span className="font-serif italic font-normal text-slate-900">achievements</span>.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Measurable proof of algorithmic precision, speed, and core computer science foundations.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {achievements.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-7 ${item.bg} ${item.border}`}
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {item.category}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.badgeBg}`}>
                  {item.badge}
                </span>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <span className={`font-mono text-3xl font-extrabold tracking-tight sm:text-4xl ${item.accent}`}>
                  {item.metric}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-500">{item.subMetric}</span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.description}</p>

              <div className="mt-6 border-t border-black/[0.06] pt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">{item.highlight}</span>
                <span className="text-xs">🏆</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
