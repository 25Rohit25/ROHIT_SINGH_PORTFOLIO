"use client";

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-slate-200/80 bg-[#f8fafc] py-12 text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <span className="text-sm font-bold tracking-wide text-slate-900">
            ROHIT SINGH
          </span>
          <span className="text-[11px] text-slate-500">
            Software Engineer · Distributed Systems · AI Engineering
          </span>
        </div>

        {/* Real Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
          <a
            href="https://github.com/25Rohit25"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/rohit-singh-75428a311/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="/Rohit_Singh_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            Resume PDF ↗
          </a>
          <a href="#hero" className="hover:text-slate-900 transition-colors">
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
