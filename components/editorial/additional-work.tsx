"use client";

import { motion } from "framer-motion";

export default function AdditionalWork() {
  return (
    <section className="relative border-t border-black/[0.08] bg-[#f5f5f7] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-8 border-b border-black/[0.08] pb-12 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
              03 — Supporting Project
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
              FitLife AI
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6e6e73] sm:text-base">
              Personalized wellness platform combining Google Gemini AI with microservices to generate adaptive workout plans and nutrition schedules from user telemetry and activity logs.
            </p>
            <div className="mt-4 text-xs text-[#6e6e73]">
              <span className="font-semibold text-[#1d1d1f]">Technologies:</span> React · Spring Boot · MySQL · Google Gemini AI · Docker · Kubernetes (HPA)
            </div>
          </div>

          <a
            href="https://github.com/25Rohit25/FitLife"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#0071e3] transition-colors hover:underline"
          >
            <span>github.com/25Rohit25/FitLife</span>
            <span>↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
