"use client";

import { motion } from "framer-motion";

const certs = [
  {
    title: "Microsoft Certified: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    code: "AZ-305",
    domain: "Cloud Architecture & High Availability",
    description: "Demonstrated advanced skills in designing cloud and hybrid solutions on Microsoft Azure, covering compute, network, storage, security, and disaster recovery.",
    bg: "bg-[#f0f9ff]",
    border: "border-[#bae6fd]",
    badgeBg: "bg-sky-100 text-sky-800",
    accent: "text-sky-600",
    tag: "Solutions Architect Expert",
  },
  {
    title: "SAP Certified: Generative AI Developer",
    issuer: "SAP",
    code: "GEN-AI",
    domain: "Generative AI & Agent Engineering",
    description: "Certified expertise in utilizing foundation models, prompt optimization, RAG pipelines, and enterprise LLM integrations for intelligent workflows.",
    bg: "bg-[#fffbeb]",
    border: "border-[#fef3c7]",
    badgeBg: "bg-amber-100 text-amber-800",
    accent: "text-amber-600",
    tag: "Generative AI Developer",
  },
  {
    title: "Oracle Cloud Infrastructure Architect Associate",
    issuer: "Oracle",
    code: "1Z0-1072",
    domain: "Cloud Infrastructure & Networking",
    description: "Verified capabilities in architecting high-performance cloud infrastructure, virtual cloud networks (VCN), load balancers, and persistent database topologies.",
    bg: "bg-[#fef2f2]",
    border: "border-[#fecaca]",
    badgeBg: "bg-rose-100 text-rose-800",
    accent: "text-rose-600",
    tag: "OCI Cloud Architect",
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="relative z-20 border-t border-slate-200/80 bg-[#f8fafc] py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Professional Credentials
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Industry <span className="font-serif italic font-normal text-slate-900">certifications</span>.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Verified certifications from Microsoft, SAP, and Oracle validating cloud &amp; AI expertise.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-3xl sm:p-7 ${cert.bg} ${cert.border}`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                  <span className="font-mono text-xs font-bold text-slate-600">
                    {cert.issuer} · {cert.code}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${cert.badgeBg}`}>
                    ✓ Verified
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {cert.title}
                </h3>
                <div className={`mt-1 text-xs font-semibold ${cert.accent}`}>
                  {cert.domain}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {cert.description}
                </p>
              </div>

              <div className="mt-6 border-t border-black/[0.06] pt-4">
                <span className="font-mono text-[10px] font-medium text-slate-500">{cert.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
