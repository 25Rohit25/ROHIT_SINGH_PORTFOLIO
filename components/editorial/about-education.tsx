"use client";

import { motion } from "framer-motion";

const achievements = [
  {
    title: "LeetCode Knight",
    stat: "Rating 2008",
    detail: "Global Top 2.53% percentile among competitive programmers",
  },
  {
    title: "CodeChef 5-Star",
    stat: "Rating 2038",
    detail: "Master tier contest rating",
  },
  {
    title: "Algorithm Problem Solving",
    stat: "1,300+ Solved",
    detail: "Across LeetCode, CodeChef, and GeeksforGeeks",
  },
  {
    title: "Google Big Code Challenge",
    stat: "National Top 1,500",
    detail: "Top 1% nationwide among 150,000+ qualifiers",
  },
];

const certifications = [
  "Microsoft Certified: Azure Solutions Architect Expert",
  "SAP Certified: Generative AI Developer",
  "Oracle Cloud Infrastructure Architect Associate",
];

export default function AboutEducation() {
  return (
    <section id="about" className="relative border-t border-black/[0.08] bg-white py-32 sm:py-44 lg:py-52">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            About &amp; Background
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl md:text-6xl">
            I like building systems where{" "}
            <span className="font-serif italic font-normal">correctness</span> matters.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6e6e73] sm:text-lg">
            Most of my work sits around backend engineering, distributed systems, and AI-agent infrastructure—from concurrent financial ledgers with ACID guarantees to automated software-engineering evaluation sandboxes at Handshake AI.
          </p>
        </motion.div>

        {/* Education Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 border-t border-black/[0.08] pt-12"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Education
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                KL University
              </h3>
              <p className="mt-1 text-sm text-[#6e6e73]">
                Bachelor of Technology in Computer Science &amp; Engineering · Vijayawada, India
              </p>
              <p className="mt-0.5 text-xs text-[#6e6e73]">
                2023 – 2027
              </p>
            </div>

            <div className="sm:text-right">
              <span className="font-mono text-3xl font-semibold text-[#1d1d1f]">
                9.40
              </span>
              <span className="text-xs text-[#6e6e73]"> / 10.0 CGPA</span>
            </div>
          </div>
        </motion.div>

        {/* Competitive Programming Achievements (Clean Typography, No Dashboard) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 border-t border-black/[0.08] pt-12"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Competitive Programming
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item) => (
              <div key={item.title} className="flex flex-col">
                <span className="font-mono text-xl font-semibold text-[#1d1d1f]">
                  {item.stat}
                </span>
                <span className="mt-1 text-sm font-medium text-[#1d1d1f]">
                  {item.title}
                </span>
                <p className="mt-1 text-xs text-[#6e6e73]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quiet Certifications List at the Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 border-t border-black/[0.08] pt-12"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6e6e73]">
            Industry Certifications
          </div>

          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-xs text-[#6e6e73]">
            {certifications.map((cert) => (
              <span key={cert}>
                {cert}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
