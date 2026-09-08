"use client";

import { motion } from "framer-motion";
import SpotlightCard from "./ui/spotlight-card";

const achievements = [
  {
    title: "Google Big Code Challenge",
    metric: "National Top 1,500",
    detail: "Top 1% nationwide among 150,000+ competitors",
    accent: "#ff6b51",
  },
  {
    title: "LeetCode Knight",
    metric: "Rating 2008",
    detail: "Global Top 2.53% percentile",
    accent: "#f4f1eb",
  },
  {
    title: "CodeChef 5-Star",
    metric: "Rating 2038",
    detail: "Master tier competitive programmer",
    accent: "#ff6b51",
  },
  {
    title: "Algorithmic Problem Solving",
    metric: "1,300+ Solved",
    detail: "Across LeetCode, CodeChef, and GeeksforGeeks",
    accent: "#38bdf8",
  },
];

const certifications = [
  {
    name: "Microsoft Certified: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    color: "#008ad7",
  },
  {
    name: "SAP Certified: Generative AI Developer",
    issuer: "SAP",
    color: "#f0ab00",
  },
  {
    name: "Oracle Cloud Infrastructure Architect Associate",
    issuer: "Oracle",
    color: "#f80000",
  },
];

export default function About() {
  return (
    <section id="about" className="relative z-20 border-t border-white/10 bg-black py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-2.5"
        >
          <span className="h-2 w-2 rounded-full bg-[#ff6b51] shadow-[0_0_10px_#ff6b51]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
            About &amp; Background
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Statement */}
          <div className="lg:col-span-8">
            <SpotlightCard className="p-7 sm:p-10 h-full flex flex-col justify-between border-white/15 bg-white/[0.02]" spotlightColor="rgba(255, 107, 81, 0.08)">
              <div>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-[#f4f1eb] sm:text-3xl md:text-4xl">
                  I like building systems where{" "}
                  <span className="font-serif italic font-normal text-[#ff6b51]">correctness</span> matters.
                </h2>

                <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base max-w-2xl">
                  Most of my work sits around backend engineering, distributed systems, and AI-agent infrastructure—from concurrent financial ledgers with ACID guarantees to automated software-engineering evaluation sandboxes at Handshake AI.
                </p>
              </div>

              {/* Dedicated Achievements Block */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-3">
                  Competitive Programming &amp; Hackathons
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {achievements.map((ach) => (
                    <div key={ach.title} className="rounded-xl border border-white/10 bg-black/50 p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-base font-bold" style={{ color: ach.accent }}>
                          {ach.metric}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ach.accent }} />
                      </div>
                      <div className="mt-1 text-xs font-semibold text-white/90">{ach.title}</div>
                      <div className="text-[10px] text-white/50">{ach.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Education & Secondary Certifications */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Education */}
            <SpotlightCard className="p-6 border-white/15 bg-white/[0.02]" spotlightColor="rgba(56, 189, 248, 0.08)">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-sky-400">
                    Education
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-[#f4f1eb]">KL University</h3>
                  <p className="text-xs text-white/60">Vijayawada, India</p>
                  <p className="mt-1 text-xs text-white/80 font-medium">B.Tech in Computer Science &amp; Engineering</p>
                  <p className="text-[11px] text-white/40">2023 – 2027</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-center">
                  <div className="font-mono text-xl font-bold text-[#38bdf8]">9.40</div>
                  <div className="text-[9px] text-white/40">CGPA / 10.0</div>
                </div>
              </div>
            </SpotlightCard>

            {/* Certifications (Secondary) */}
            <SpotlightCard className="p-6 flex-1 flex flex-col justify-between border-white/15 bg-white/[0.02]" spotlightColor="rgba(244, 241, 235, 0.06)">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
                  Industry Certifications
                </div>
                <div className="mt-3 divide-y divide-white/5">
                  {certifications.map((cert) => (
                    <div key={cert.name} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-white/85">{cert.name}</span>
                      <span className="shrink-0 font-mono text-[9px] text-white/40">{cert.issuer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
