"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "rohitsinghwork11@gmail.com";
  const phone = "+91-8218488412";
  const github = "https://github.com/25Rohit25";
  const linkedin = "https://linkedin.com/in/rohit-singh-75428a311/";
  const resume = "/Rohit_Singh_Resume.pdf";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="contact" className="relative border-t border-black/[0.08] bg-[#f5f5f7] py-32 sm:py-44 lg:py-52">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            Get In Touch
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#1d1d1f] sm:text-5xl md:text-6xl">
            Have an interesting problem to{" "}
            <span className="font-serif italic font-normal">solve</span>?
          </h2>

          <p className="mt-6 text-base leading-relaxed text-[#6e6e73] sm:text-lg">
            Backend systems, distributed infrastructure and AI-agent engineering. Open for full-time Software Engineering roles and technical contracts.
          </p>

          {/* Prominent Email Presentation */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="text-xl font-semibold tracking-tight text-[#1d1d1f] transition-colors hover:text-[#0071e3] sm:text-2xl md:text-3xl"
            >
              {email}
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-black/[0.1] bg-white px-3.5 py-1 text-xs font-medium text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:bg-black hover:text-white"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Direct Telemetry Links */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-[#1d1d1f]">
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#1d1d1f] transition-colors hover:text-[#0071e3]"
            >
              LinkedIn ↗
            </a>
            <span className="text-[#6e6e73]">·</span>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#1d1d1f] transition-colors hover:text-[#0071e3]"
            >
              GitHub ↗
            </a>
            <span className="text-[#6e6e73]">·</span>
            <a
              href={resume}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#1d1d1f] transition-colors hover:text-[#0071e3]"
            >
              Resume PDF ↗
            </a>
            <span className="text-[#6e6e73]">·</span>
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="font-medium text-[#6e6e73] transition-colors hover:text-[#1d1d1f]"
            >
              {phone}
            </a>
          </div>
        </motion.div>

        {/* Apple-grade Minimal Footer */}
        <div className="mt-32 flex flex-col justify-between gap-4 border-t border-black/[0.08] pt-8 text-xs text-[#6e6e73] sm:flex-row sm:items-center">
          <div>
            <span>Rohit Singh · Software Engineer</span>
            <span className="mx-2">·</span>
            <span>2026</span>
          </div>

          <a
            href="#hero"
            className="transition-colors hover:text-[#1d1d1f]"
          >
            Back to Top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
