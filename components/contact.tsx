"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
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
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const socials = [
    {
      name: "GitHub",
      handle: "@25Rohit25",
      desc: "Open-source code, PayFlow, Nexa Bank & system implementations",
      href: github,
      bg: "bg-[#f8fafc]",
      border: "border-slate-200",
      actionText: "Visit GitHub ↗",
      icon: (
        <svg className="h-6 w-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      handle: "rohit-singh-75428a311",
      desc: "Professional updates, engineering background & SWE network",
      href: linkedin,
      bg: "bg-[#f0f9ff]",
      border: "border-sky-200",
      actionText: "Connect on LinkedIn ↗",
      icon: (
        <svg className="h-6 w-6 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      name: "Curriculum Vitae",
      handle: "Rohit_Singh_Resume.pdf",
      desc: "Full resume with verified metrics, Handshake AI experience & ratings",
      href: resume,
      bg: "bg-[#fff7ed]",
      border: "border-amber-200",
      actionText: "Download Resume PDF ↗",
      icon: (
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: "Direct Phone",
      handle: "+91-8218488412",
      desc: "Available for technical discussions, interview loops & consultations",
      href: `tel:${phone.replace(/[^0-9+]/g, "")}`,
      bg: "bg-[#f0fdf4]",
      border: "border-emerald-200",
      actionText: "Call Directly ↗",
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative z-20 border-t border-slate-200/80 bg-[#f8fafc] py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-2.5"
        >
          <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Contact &amp; Social Profiles
          </span>
        </motion.div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] sm:rounded-3xl sm:p-8 md:p-14">
          <div className="mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Available for SWE Roles &amp; Contracts
            </span>

            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
              Let&apos;s build something <span className="font-serif italic font-normal text-blue-600">extraordinary</span>.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
              Specialized in high-concurrency transactional backends, distributed systems, and AI agent evaluation environments.
            </p>

            {/* Email Action Pill */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-black shadow-[0_4px_16px_rgba(15,23,42,0.15)] hover:shadow-lg"
              >
                <span>Send An Email</span>
                <span>→</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-medium text-slate-800 transition-all hover:bg-slate-100 shadow-sm"
              >
                {copied ? (
                  <>
                    <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 16 16">
                      <path d="M3 8.5l3.5 3.5 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-emerald-700 font-semibold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 16 16">
                      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M12 4V2.5A1.5 1.5 0 0010.5 1h-7A1.5 1.5 0 002 2.5v7A1.5 1.5 0 003.5 11H4" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    <span>{email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Media Grid */}
          <div className="mt-10 grid grid-cols-1 gap-4 text-left border-t border-slate-100 pt-8 sm:mt-14 sm:grid-cols-2 sm:gap-5 sm:pt-10 lg:grid-cols-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.name !== "Direct Phone" ? "_blank" : undefined}
                rel="noreferrer"
                className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-2xl sm:p-5 ${s.bg} ${s.border}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>{s.icon}</div>
                    <span className="text-xs text-slate-400 transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                  <div className="mt-4 font-bold text-sm text-slate-900">{s.name}</div>
                  <div className="font-mono text-xs text-slate-500">{s.handle}</div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{s.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/[0.06] text-[11px] font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {s.actionText}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
