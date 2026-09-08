"use client";

import { motion } from "framer-motion";

interface SkillItem {
  name: string;
  icon: React.ReactNode;
}

interface SkillCategory {
  title: string;
  bg: string;
  border: string;
  textColor: string;
  skills: SkillItem[];
}

// Crisp Vector SVG Logos for each technology
const Icons = {
  Java: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M11 24c4.5 1 8-1 10.5-2.5-3 .5-6 .5-8.5.5-2 0-2 2-2 2z" fill="#E76F00" />
      <path d="M9 21c6 1.5 11-1 14.5-3-4 .5-8 .5-11.5.5-3 0-3 2.5-3 2.5z" fill="#5382A1" />
      <path d="M16 4c-2 2.5.5 4.5 1.5 6 1 1.5.5 3-1.5 4.5 3-1.5 4-3.5 3-5s-3-3-3-5.5z" fill="#E76F00" />
      <path d="M20 7c-1.5 2 .5 3.5 1 5 .5 1.5 0 2.5-1.5 4 2.5-1.5 3-3 2.5-4.5s-2-2.5-2-4.5z" fill="#5382A1" />
      <path d="M7 27c6 1.5 13 1 18-1-2 1-7 2-12 2-4 0-6-1-6-1z" fill="#5382A1" />
    </svg>
  ),
  Cpp: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L4 10v12l12 7 12-7V10L16 3z" fill="#00599C" />
      <path d="M16 6l9 5.5v9L16 26l-9-5.5v-9L16 6z" fill="#004482" />
      <path d="M18.5 13.5a4.5 4.5 0 1 0 0 5m4-2.5h3m-1.5-1.5v3m4.5-1.5h3m-1.5-1.5v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Python: (
    <svg className="h-7 w-7" viewBox="0 0 32 32">
      <path d="M15.8 4c-5.2 0-4.9 2.3-4.9 2.3l.1 2.3h5v.7H8.8S5 8.9 5 14.1c0 5.3 3.3 5.1 3.3 5.1h2v-2.8c0-3.2 2.8-3 2.8-3h4.9s2.7.1 2.7-2.6V6.7S21.3 4 15.8 4zm-2.7 1.7a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#3776AB" />
      <path d="M16.2 28c5.2 0 4.9-2.3 4.9-2.3l-.1-2.3h-5v-.7h7.2s3.8.4 3.8-4.8c0-5.3-3.3-5.1-3.3-5.1h-2v2.8c0 3.2-2.8 3-2.8 3H14s-2.7-.1-2.7 2.6v4.1s-.6 2.7 4.9 2.7zm2.7-1.7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="#FFD43B" />
    </svg>
  ),
  TypeScript: (
    <svg className="h-7 w-7" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="6" fill="#3178C6" />
      <path d="M7 13h10v2.5h-3.6v9.5H10.6v-9.5H7V13zm11.5 7.7c.9.8 2 1.3 3.3 1.3 1.2 0 1.9-.5 1.9-1.2 0-.8-.7-1.1-2.1-1.6-2.1-.8-3.4-1.8-3.4-3.5 0-2.1 1.7-3.7 4.3-3.7 1.5 0 2.8.5 3.8 1.3l-1.1 2.2c-.8-.6-1.8-1-2.7-1-1.1 0-1.7.5-1.7 1.1 0 .7.7 1 2.2 1.6 2.2.8 3.3 1.9 3.3 3.6 0 2.2-1.7 3.8-4.6 3.8-1.7 0-3.3-.6-4.3-1.6l1.1-2.3z" fill="#fff" />
    </svg>
  ),
  JavaScript: (
    <svg className="h-7 w-7" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="6" fill="#F7DF1E" />
      <path d="M10 24.5c.8.5 1.8.8 2.8.8 2 0 3.2-1 3.2-3.1v-8.2h-2.5v8.1c0 .9-.5 1.3-1.3 1.3-.8 0-1.5-.3-1.9-.6l-.3 1.7zm8.8-1.5c1 .9 2.3 1.5 3.7 1.5 2.1 0 3.5-1.1 3.5-2.8 0-1.7-1.1-2.4-2.8-3.1-1.5-.6-2.2-1-2.2-1.8 0-.7.6-1.3 1.7-1.3 1.1 0 2.1.4 2.8.9l.6-1.8c-.8-.6-1.9-1-3.4-1-2.3 0-3.7 1.3-3.7 3 0 1.6 1.1 2.4 2.7 3.1 1.5.6 2.3 1 2.3 2 0 .9-.8 1.4-1.9 1.4-1.3 0-2.5-.5-3.3-1.2l-.6 1.8z" fill="#000" />
    </svg>
  ),
  SpringBoot: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#6DB33F" />
      <path d="M10 16.5C10 12.9 12.9 10 16.5 10c2.4 0 4.5 1.3 5.6 3.3l-2.6 1.5c-.7-1.2-2-2-3-2-2.1 0-3.7 1.6-3.7 3.7 0 2.1 1.6 3.7 3.7 3.7 1.4 0 2.6-.8 3.2-1.9l2.6 1.4C21.1 21.6 19 23 16.5 23 12.9 23 10 20.1 10 16.5z" fill="#fff" />
    </svg>
  ),
  Nodejs: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M16 3l11 6.3v13.4L16 29 5 22.7V9.3L16 3z" fill="#339933" />
      <path d="M16 5.3L7 10.5v11l9 5.2 9-5.2v-11L16 5.3z" fill="#539E43" />
      <path d="M16 11a4.5 4.5 0 0 0-4 2.5l2.2 1.3a2 2 0 1 1 0 2.4l-2.2 1.3A4.5 4.5 0 1 0 16 11z" fill="#fff" />
    </svg>
  ),
  Express: (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 font-mono text-xs font-black tracking-tighter text-white">
      ex
    </div>
  ),
  Nextjs: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" fill="#000" />
      <path d="M21.5 23.5L12 11.5v10h-2V9.5h2.2l9.8 12.4V9.5h2v14h-2.5z" fill="#fff" />
    </svg>
  ),
  SocketIO: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#010101" />
      <path d="M17.5 7L10 17h5l-1.5 8L22 14h-5.5L17.5 7z" fill="#fff" />
    </svg>
  ),
  React: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(0 16 16)" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 16 16)" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 16 16)" />
      <circle cx="16" cy="16" r="2.2" fill="#61DAFB" />
    </svg>
  ),
  Tailwind: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M9 13.5c1.2-2.5 3-3.8 5.5-3.8 3.7 0 4.8 2.7 6.6 3.7 1.2.7 2.6.9 4.2.5-1.2 2.5-3 3.8-5.5 3.8-3.7 0-4.8-2.7-6.6-3.7-1.2-.7-2.6-.9-4.2-.5zm-4.8 6.8c1.2-2.5 3-3.8 5.5-3.8 3.7 0 4.8 2.7 6.6 3.7 1.2.7 2.6.9 4.2.5-1.2 2.5-3 3.8-5.5 3.8-3.7 0-4.8-2.7-6.6-3.7-1.2-.7-2.6-.9-4.2-.5z" fill="#38BDF8" />
    </svg>
  ),
  FramerMotion: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M7 6h18v9H16l9 9H7v-9h9L7 6z" fill="#0055FF" />
      <path d="M16 15l-9 9h9V15z" fill="#FF0055" />
      <path d="M16 15l9-9H16v9z" fill="#7700FF" />
    </svg>
  ),
  MySQL: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M10 21c-2-3-2-7 1-10 2.5-2.5 7-3.5 11-2-2 1-3.5 2.5-4 4.5-1 4 2 6.5 4 7.5-3 1-8 1.5-12 0z" fill="#00758F" />
      <path d="M22 9c3 1.5 5 4.5 4.5 7.5-.5 3-3 5-5.5 5.5 1.5-2 2-4.5 1-6.5-1-1.5-2-2.5-3-3l3-3.5z" fill="#F29111" />
    </svg>
  ),
  PostgreSQL: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M16 5C10 5 7 8 7 13c0 6 3 11 9 14 6-3 9-8 9-14 0-5-3-8-9-8z" fill="#336791" />
      <path d="M12 11c1-2 3-3 4-3s3 1 4 3c1 2 1 4 0 6-1 2-3 3-4 3s-3-1-4-3c-1-2-1-4 0-6z" fill="#fff" />
      <circle cx="14" cy="13" r="1.5" fill="#336791" />
      <circle cx="18" cy="13" r="1.5" fill="#336791" />
    </svg>
  ),
  MongoDB: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M16 4C14 8 9 13 9 18c0 4 3.5 8 7 9.5 3.5-1.5 7-5.5 7-9.5 0-5-5-10-7-14z" fill="#47A248" />
      <path d="M16 4v23.5c.3-.1.6-.3.9-.5 3.1-1.6 6.1-5.3 6.1-9 0-5-5-10-7-14z" fill="#499D4A" />
      <path d="M16 22c-.6 0-1-.4-1-1v-6c0-.6.4-1 1-1s1 .4 1 1v6c0 .6-.4 1-1 1z" fill="#fff" />
    </svg>
  ),
  Redis: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M4 11l12-6 12 6-12 6-12-6z" fill="#D82C20" />
      <path d="M4 15l12 6 12-6v4l-12 6-12-6v-4z" fill="#A31F17" />
      <path d="M4 21l12 6 12-6v4l-12 6-12-6v-4z" fill="#75150F" />
    </svg>
  ),
  Docker: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <rect x="7" y="11" width="3" height="3" rx="0.5" fill="#2496ED" />
      <rect x="11" y="11" width="3" height="3" rx="0.5" fill="#2496ED" />
      <rect x="15" y="11" width="3" height="3" rx="0.5" fill="#2496ED" />
      <rect x="11" y="7" width="3" height="3" rx="0.5" fill="#2496ED" />
      <rect x="15" y="7" width="3" height="3" rx="0.5" fill="#2496ED" />
      <rect x="19" y="11" width="3" height="3" rx="0.5" fill="#2496ED" />
      <path d="M28 15.5c-.8-.5-1.7-.6-2.5-.4-.4-1.2-1.3-2.1-2.5-2.6l-.6.5c.9 1.5.3 3.5-1.2 4.5H4.5c.3 3.5 3.2 6.5 7.5 6.5 7 0 11.5-4 13.5-7.5 1-.1 1.8-.4 2.5-1z" fill="#2496ED" />
    </svg>
  ),
  Kubernetes: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M16 4l10.5 6v12L16 28 5.5 22V10L16 4z" fill="#326CE5" />
      <circle cx="16" cy="16" r="5" stroke="#fff" strokeWidth="1.5" />
      <path d="M16 11v10m-5-5h10m-7.5-3.5l5 7m-5 0l5-7" stroke="#fff" strokeWidth="1.2" />
    </svg>
  ),
  GitHubActions: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M16 4C9.37 4 4 9.37 4 16c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.26c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C24.57 25.79 28 21.3 28 16c0-6.63-5.37-12-12-12z" fill="#181717" />
    </svg>
  ),
  Jenkins: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill="#D33833" />
      <path d="M12 11h8v4h-8z" fill="#fff" />
      <circle cx="16" cy="18" r="4" fill="#F0D6B7" />
      <path d="M14 20h4v3h-4z" fill="#24292E" />
    </svg>
  ),
  Ansible: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#000" />
      <path d="M16 7l6.5 17h-3L17.5 19H12l-1.5 5H8L16 7zm0 5.5L13.2 16.5h4.6L16 12.5z" fill="#fff" />
    </svg>
  ),
  Prometheus: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#E6522C" />
      <path d="M16 7c-2 4-5 7-5 11a5 5 0 0 0 10 0c0-4-3-7-5-11z" fill="#fff" />
      <path d="M16 14c-1 2-2.5 3.5-2.5 5.5a2.5 2.5 0 0 0 5 0c0-2-1.5-3.5-2.5-5.5z" fill="#E6522C" />
    </svg>
  ),
  Grafana: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#F46800" />
      <path d="M16 8l6 5-3 8-6 2-3-7 6-8z" fill="#fff" />
      <circle cx="16" cy="16" r="3" fill="#F46800" />
    </svg>
  ),
  Vercel: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <path d="M16 5L28 26H4L16 5z" fill="#000" />
    </svg>
  ),
  Linux: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="17" rx="7" ry="9" fill="#000" />
      <ellipse cx="16" cy="18" rx="5" ry="7" fill="#fff" />
      <circle cx="16" cy="9" r="4.5" fill="#000" />
      <circle cx="14.5" cy="8.5" r="1" fill="#fff" />
      <circle cx="17.5" cy="8.5" r="1" fill="#fff" />
      <path d="M14 10.5c1 .5 3 .5 4 0l-2 2-2-2z" fill="#FFA500" />
      <ellipse cx="11" cy="26" rx="3.5" ry="1.5" fill="#FFA500" />
      <ellipse cx="21" cy="26" rx="3.5" ry="1.5" fill="#FFA500" />
    </svg>
  ),
  Kafka: (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#231F20" />
      <circle cx="12" cy="16" r="2" fill="#fff" />
      <circle cx="20" cy="11" r="2" fill="#fff" />
      <circle cx="20" cy="21" r="2" fill="#fff" />
      <path d="M12 16l8-5m-8 5l8 5" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
};

const skillCategories: SkillCategory[] = [
  {
    title: "LANGUAGES",
    bg: "bg-[#eef2ff]",
    border: "border-[#dbeafe]",
    textColor: "text-[#3730a3]",
    skills: [
      { name: "Java", icon: Icons.Java },
      { name: "C++", icon: Icons.Cpp },
      { name: "Python", icon: Icons.Python },
      { name: "TypeScript", icon: Icons.TypeScript },
      { name: "JavaScript", icon: Icons.JavaScript },
    ],
  },
  {
    title: "BACKEND",
    bg: "bg-[#f5f3ff]",
    border: "border-[#ede9fe]",
    textColor: "text-[#5b21b6]",
    skills: [
      { name: "Spring Boot", icon: Icons.SpringBoot },
      { name: "Node.js", icon: Icons.Nodejs },
      { name: "Express", icon: Icons.Express },
      { name: "Next.js", icon: Icons.Nextjs },
      { name: "Socket.IO", icon: Icons.SocketIO },
    ],
  },
  {
    title: "FRONTEND",
    bg: "bg-[#ecfeff]",
    border: "border-[#cffafe]",
    textColor: "text-[#0e7490]",
    skills: [
      { name: "React", icon: Icons.React },
      { name: "Tailwind", icon: Icons.Tailwind },
      { name: "Next.js", icon: Icons.Nextjs },
      { name: "Framer Motion", icon: Icons.FramerMotion },
    ],
  },
  {
    title: "DATABASES",
    bg: "bg-[#ecfdf5]",
    border: "border-[#d1fae5]",
    textColor: "text-[#065f46]",
    skills: [
      { name: "MySQL", icon: Icons.MySQL },
      { name: "PostgreSQL", icon: Icons.PostgreSQL },
      { name: "MongoDB", icon: Icons.MongoDB },
      { name: "Redis", icon: Icons.Redis },
    ],
  },
  {
    title: "DEVOPS & CLOUD",
    bg: "bg-[#fffbeb]",
    border: "border-[#fef3c7]",
    textColor: "text-[#92400e]",
    skills: [
      { name: "Docker", icon: Icons.Docker },
      { name: "Kubernetes", icon: Icons.Kubernetes },
      { name: "GitHub Actions", icon: Icons.GitHubActions },
      { name: "Jenkins", icon: Icons.Jenkins },
      { name: "Ansible", icon: Icons.Ansible },
    ],
  },
  {
    title: "OBSERVABILITY",
    bg: "bg-[#fdf2f8]",
    border: "border-[#fce7f3]",
    textColor: "text-[#9d174d]",
    skills: [
      { name: "Prometheus", icon: Icons.Prometheus },
      { name: "Grafana", icon: Icons.Grafana },
      { name: "Vercel", icon: Icons.Vercel },
      { name: "Linux", icon: Icons.Linux },
      { name: "Kafka", icon: Icons.Kafka },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative z-20 border-t border-slate-200/80 bg-[#f8fafc] py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Technical Stack &amp; Tools
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Technologies &amp; <span className="font-serif italic font-normal text-slate-900">competencies</span>.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Battle-tested frameworks and infrastructure powering high-concurrency microservices, AI agents, and 3D web systems.
          </p>
        </div>

        {/* 6 Pastel Rounded Cards Grid (Matching Reference Design) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg sm:rounded-3xl sm:p-7 ${cat.bg} ${cat.border}`}
            >
              {/* Category Header */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className={`text-xs font-black tracking-[0.2em] uppercase ${cat.textColor}`}>
                  {cat.title}
                </h3>
              </div>

              {/* Grid of White Icon Boxes */}
              <div className="flex flex-wrap items-center gap-4">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                      {skill.icon}
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 transition-colors group-hover:text-slate-900">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
