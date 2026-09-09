"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "./projects/project-modal";
import { projectDocs } from "./projects/project-docs";

type ProjectCategory = "all" | "backend" | "ai" | "fullstack" | "creative3d" | "systems";

interface ProjectItem {
  id: string;
  category: ProjectCategory;
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  stack: string[];
  github: string;
  live?: string;
  thumbnail?: string;
  gradient: string;
  accentColor: string;
  flow?: string[];
  caseStudy?: {
    problem: string;
    solution: string;
    reliability: string;
    performance: string;
    observability: string;
    tradeoffs: string;
  };
  workflowExample?: {
    prompt: string;
    trace: string;
  };
}

const projects: ProjectItem[] = [
  // 1. DISTRIBUTED SYSTEMS & BACKEND
  {
    id: "payflow",
    category: "backend",
    number: "01",
    badge: "Backend & Distributed",
    title: "PayFlow",
    subtitle: "Distributed payment ledger · 450 TPS · <85ms Kafka latency",
    description:
      "A high-throughput financial backend designed for atomic wallet transfers, idempotent API calls, and double-entry ledger bookkeeping. Engineered to eliminate race conditions under heavy multi-threaded contention.",
    metrics: "450 TPS · <85ms Kafka Outbox · 0 Loss",
    stack: ["Java 21", "Spring Boot", "PostgreSQL", "Redis", "Kafka", "Docker", "K6"],
    github: "https://github.com/25Rohit25/Payflow",
    thumbnail: "/projects/payflow-dashboard.png",
    gradient: "from-[#ea580c] via-[#f97316] to-[#fb923c]",
    accentColor: "#ea580c",
    caseStudy: {
      problem:
        "When multiple concurrent transfers hit a single wallet balance, standard read-modify-write queries trigger race conditions and negative ledger balances.",
      solution:
        "Applied PostgreSQL SELECT FOR UPDATE row-level locking within serializable transaction boundaries, paired with Redis client idempotency keys to drop duplicate retries.",
      reliability:
        "Transactional Outbox pattern publishes events to Apache Kafka without dual-write inconsistencies, ensuring at-least-once delivery to fraud services.",
      performance:
        "Simulated 800+ concurrent virtual users across 50+ threads in K6, maintaining 450 TPS with p99 response times below 120 ms.",
      observability:
        "Micrometer metrics exported to Prometheus and Grafana for tracking connection pool saturation and Kafka publisher queue lag.",
      tradeoffs:
        "Pessimistic locking avoids optimistic locking retry storms under heavy contention, keeping latency predictable and compute utilization optimal.",
    },
  },
  {
    id: "valiant",
    category: "backend",
    number: "02",
    badge: "SRE & Observability",
    title: "Valiant",
    subtitle: "Deterministic change-impact radar · Kubernetes & Prometheus SRE",
    description:
      "An open-core observability platform that calculates deterministic impact scores correlating Kubernetes rollout events and CI/CD releases directly with service degradation metrics in Prometheus.",
    metrics: "Deterministic Scoring · K8s Rollouts · Prometheus HTTP",
    stack: ["Go (Golang)", "PostgreSQL", "Prometheus", "Kubernetes", "Next.js", "Docker"],
    github: "https://github.com/25Rohit25/valiant",
    thumbnail: "/projects/valiant-dashboard.png",
    gradient: "from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]",
    accentColor: "#7c3aed",
  },
  {
    id: "realtime-chat",
    category: "backend",
    number: "03",
    badge: "Real-Time Systems",
    title: "Real Time Chat",
    subtitle: "Conversations that don't wait for refresh · Authenticated rooms & live presence",
    description:
      "A real-time messaging architecture built with Node.js, Socket.IO, and MongoDB, supporting authenticated users, isolated chat rooms, persistent message history, and live typing presence signals.",
    metrics: "Sub-15ms Push · Room Isolation · 50-Msg History",
    stack: ["Node.js", "Socket.IO", "Express", "MongoDB", "JWT", "JavaScript"],
    github: "https://github.com/25Rohit25/Real-Time-Chat",
    thumbnail: "/projects/realtime-chat-dashboard.png",
    gradient: "from-[#c026d3] via-[#db2777] to-[#f43f5e]",
    accentColor: "#db2777",
  },
  {
    id: "bhopal-food",
    category: "fullstack",
    number: "04",
    badge: "Full-Stack MERN",
    title: "Bhopal Food Choice",
    subtitle: "Train seat catering delivery · Real-time collaborative group ordering",
    description:
      "Full-stack MERN train catering application allowing passengers to order authentic regional cuisine directly to their berth via PNR and Seat Number, with real-time multi-user group cart collaboration.",
    metrics: "PNR Seat Routing · Socket Group Cart · Live Tracking",
    stack: ["React", "Vite", "Node.js", "Express", "Socket.io", "MongoDB Atlas", "Tailwind"],
    github: "https://github.com/25Rohit25/Bhopal-Food",
    live: "https://bhopal-food.vercel.app/",
    thumbnail: "/projects/bhopal-food-hero.png",
    gradient: "from-[#db2777] via-[#ec4899] to-[#f472b6]",
    accentColor: "#db2777",
  },
  {
    id: "waste-no-more",
    category: "fullstack",
    number: "05",
    badge: "Full-Stack & Logistics",
    title: "Waste No More",
    subtitle: "Real-time logistics platform · 32% efficiency boost · WebSocket sub-200ms",
    description:
      "Hyper-local on-demand logistics platform connecting perishable food donors with nearby volunteers using MongoDB 2dsphere spatial indexing ($near queries) and Socket.io real-time concurrency locking.",
    metrics: "2dsphere $near · Socket.io Sync · Next.js 16",
    stack: ["Next.js 16", "React 19", "Node.js", "Express 5", "MongoDB", "Socket.io", "Tailwind"],
    github: "https://github.com/25Rohit25/Waste-No-More",
    live: "https://waste-no-more.vercel.app/",
    thumbnail: "/projects/waste-no-more-hero.png",
    gradient: "from-[#059669] via-[#10b981] to-[#34d399]",
    accentColor: "#059669",
  },

  // 2. AI & COMPUTER VISION
  {
    id: "nexabank",
    category: "ai",
    number: "06",
    badge: "AI & Agent Systems",
    title: "Nexa Bank",
    subtitle: "AI-Native Banking with MCP · Policy-grounded RAG compliance",
    description:
      "Cloud-native banking platform enabling autonomous AI agents to execute verified financial workflows directly from natural-language requests, governed by real-time RAG policy compliance checks and typed MCP tool schemas.",
    metrics: "MCP Protocol · RAG Guardrails · Kafka Audit",
    stack: ["Java 21", "Spring Boot", "MCP", "RAG", "PostgreSQL", "Kafka", "Docker"],
    github: "https://github.com/25Rohit25/NexaBank",
    thumbnail: "/projects/nexabank-dashboard.png",
    gradient: "from-[#0284c7] via-[#0ea5e9] to-[#38bdf8]",
    accentColor: "#0284c7",
    workflowExample: {
      prompt: "Transfer ₹2,500 to Rahul tomorrow.",
      trace:
        "Agent parses intent → queries RAG Policy Context for daily transfer limits & KYC status → invokes MCP tool executeTransfer → validates parameters against Spring Boot core → commits transaction → emits Kafka audit event.",
    },
  },
  {
    id: "retail-lens",
    category: "ai",
    number: "07",
    badge: "AI & Computer Vision",
    title: "Retail_Lens",
    subtitle: "AI-Powered CCTV intelligence · YOLOv8 Nano · Edge shopper tracking",
    description:
      "End-to-end edge computer vision and store analytics platform transforming raw CCTV streams into structured behavioral intelligence: shopper journey tracking, dwell analysis, and queue congestion detection.",
    metrics: "YOLOv8 Nano · ByteTrack · 100/100 Score",
    stack: ["Python", "YOLOv8", "OpenCV", "ByteTrack", "FastAPI", "PostgreSQL", "Docker"],
    github: "https://github.com/25Rohit25/Retail_Lens",
    thumbnail: "/projects/retail-lens-hero.png",
    gradient: "from-[#d97706] via-[#f59e0b] to-[#fbbf24]",
    accentColor: "#d97706",
  },
  {
    id: "fitlife",
    category: "fullstack",
    number: "08",
    badge: "Full-Stack & AI",
    title: "FitLife AI",
    subtitle: "AI-Powered fitness & nutrition platform · Adaptive routine synthesis",
    description:
      "Full-stack wellness application combining React and Spring Boot with Google Gemini AI to synthesize adaptive workout routines and personalized nutrition schedules based on user biometrics.",
    metrics: "Gemini AI Synthesis · Spring Boot · K8s HPA",
    stack: ["React", "Spring Boot", "MySQL", "Gemini AI", "JWT", "Docker", "Kubernetes"],
    github: "https://github.com/25Rohit25/FitLife",
    thumbnail: "/projects/fitlife-hero.png",
    gradient: "from-[#0d9488] via-[#14b8a6] to-[#2dd4bf]",
    accentColor: "#0d9488",
  },
  {
    id: "linklite",
    category: "fullstack",
    number: "09",
    badge: "Full-Stack Web App",
    title: "LinkLite",
    subtitle: "Production URL shortener · Real-time click analytics & JWT security",
    description:
      "Decoupled full-stack link shortening platform engineered with JWT authentication, custom collision-resistant short-code hashing, and real-time visitor click telemetry dashboards.",
    metrics: "Custom Slugs · Click Telemetry · Decoupled CI/CD",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT Auth", "Tailwind"],
    github: "https://github.com/25Rohit25/LinkLite",
    live: "https://link-lite-two.vercel.app/",
    gradient: "from-[#4f46e5] via-[#6366f1] to-[#818cf8]",
    accentColor: "#4f46e5",
  },

  // 4. CREATIVE FRONTEND & 3D WEB
  {
    id: "luma-web3",
    category: "creative3d",
    number: "10",
    badge: "Creative 3D Web",
    title: "Luma web3",
    subtitle: "Clean dApp interface · 3D product configurator · Modern TypeScript stack",
    description:
      "Ultra-luxury 3D product showcase and real-time configurator powered by React Three Fiber and Zustand. Features procedural material generation, Draco GLTF compression, and 60 FPS studio lighting.",
    metrics: "React Three Fiber · Draco GLTF · Zustand State",
    stack: ["React", "TypeScript", "Three.js", "R3F", "Zustand", "GSAP", "Tailwind"],
    github: "https://github.com/25Rohit25/Luma_web3",
    live: "https://luma-web3-us4a.vercel.app/",
    thumbnail: "/projects/luma-hero.png",
    gradient: "from-[#ea580c] via-[#f97316] to-[#fb923c]",
    accentColor: "#ea580c",
  },
  {
    id: "aurelia",
    category: "creative3d",
    number: "11",
    badge: "Creative 3D & WebGL",
    title: "AURELIA",
    subtitle: "Interactive 3D luxury hotel showcase · 360° Spherical walkthrough",
    description:
      "High-end interactive 3D web experience built with React 19, React Three Fiber (R3F 9), and Three.js 0.185. Features continuous 360° equirectangular panoramas, scroll-driven camera rigs, and procedural room shaders.",
    metrics: "360° Equirectangular · R3F 9 · PostFX Tiering",
    stack: ["React 19", "TypeScript", "Vite 8", "Three.js 0.185", "R3F 9", "Motion 13", "Tailwind"],
    github: "https://github.com/25Rohit25/AURELIA",
    live: "https://aurelia-houses.vercel.app/",
    thumbnail: "/projects/aurelia-hero.png",
    gradient: "from-[#b45309] via-[#d97706] to-[#f59e0b]",
    accentColor: "#b45309",
  },

  // 5. SYSTEMS PROGRAMMING & C++
  {
    id: "traffic-navigation",
    category: "systems",
    number: "12",
    badge: "Systems & Algorithms (C++)",
    title: "RouteNavigator Engine",
    subtitle: "Smart City Graph Routing · Dijkstra & A* pathfinding in C++17",
    description:
      "High-performance urban pathfinding system modeling road networks as weighted graphs. Implements Dijkstra's algorithm and A* heuristic search to compute shortest and fastest dynamic routes under traffic congestion.",
    metrics: "Dijkstra & A* · Weighted Graph · C++17",
    stack: ["C++17", "CMake", "Dijkstra", "A* Search", "Graph Theory", "OOP"],
    github: "https://github.com/25Rohit25/Traffic-Navigation-System",
    gradient: "from-[#6366f1] via-[#7c3aed] to-[#8b5cf6]",
    accentColor: "#6366f1",
  },
  {
    id: "stocksentinel",
    category: "systems",
    number: "13",
    badge: "Systems & Algorithms (C++)",
    title: "StockSentinel",
    subtitle: "Smart warehouse inventory · FIFO/LIFO batch processing in C++17",
    description:
      "Production-grade C++ inventory management engine utilizing std::map for logarithmic item indexing and std::deque for strict FIFO (perishables) and LIFO (non-perishables) batch routing with CSV persistence.",
    metrics: "O(log N) std::map · FIFO/LIFO Deque · CSV Journal",
    stack: ["C++17", "Makefile", "STL (map, deque)", "OOP", "CSV Persistence"],
    github: "https://github.com/25Rohit25/StockSentinel",
    gradient: "from-[#059669] via-[#0d9488] to-[#14b8a6]",
    accentColor: "#059669",
  },
];

const tabs = [
  { id: "all", label: "All Projects" },
  { id: "backend", label: "Distributed & Backend" },
  { id: "ai", label: "AI & Computer Vision" },
  { id: "fullstack", label: "Full-Stack Logistics" },
  { id: "creative3d", label: "3D & Creative Web" },
  { id: "systems", label: "Systems & C++" },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState<ProjectCategory>("all");
  const [expandedCaseStudy, setExpandedCaseStudy] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const filtered =
    activeTab === "all" ? projects : projects.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="relative z-20 border-t border-slate-200/80 bg-[#f8fafc] py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header with Interactive Filter Tabs */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Featured Projects by Domain ({projects.length} Total)
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Engineered for <span className="font-serif italic font-normal text-slate-900">correctness</span> &amp;{" "}
              <span className="font-serif italic font-normal text-blue-600">scale</span>.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore live productions, open-source systems, and AI agent architectures.
            </p>
          </div>

          {/* Categorized Filter Tabs — horizontally scrollable on mobile */}
          <div className="-mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white p-1.5 shadow-sm w-max sm:w-auto sm:flex-wrap">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const count =
                tab.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === tab.id).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ProjectCategory)}
                  className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-colors ${
                    isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeProjFilterTab"
                      className="absolute inset-0 rounded-full bg-slate-900"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tab.label}
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
            </div>
          </div>
        </div>

        {/* Project Cards 3-Column Responsive Grid (Matching Image 2 Reference) */}
        <motion.div layout className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
              >
                <div>
                  {/* Top Colorful Header Banner or Real UI Screenshot Thumbnail */}
                  <div
                    className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${proj.gradient} flex flex-col justify-between sm:h-56`}
                  >
                    {proj.thumbnail ? (
                      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
                        {/* Thumbnail Image with smooth zoom on hover */}
                        <img
                          src={proj.thumbnail}
                          alt={`${proj.title} Preview`}
                          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Subtle top & bottom vignette that preserves light UI clarity */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
                      </div>
                    ) : (
                      <>
                        {/* Dot Pattern Overlay */}
                        <div
                          className="absolute inset-0 opacity-15"
                          style={{
                            backgroundImage: `radial-gradient(#fff 1.5px, transparent 1.5px)`,
                            backgroundSize: "14px 14px",
                          }}
                        />
                      </>
                    )}

                    {/* Top Pill & Badges */}
                    <div className="relative z-10 flex items-center justify-between p-5 sm:p-6">
                      <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-xs">
                        {proj.badge}
                      </span>

                      <div className="flex items-center gap-2">
                        {proj.live && (
                          <a
                            href={proj.live}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 hover:bg-white hover:text-slate-900 shadow-xs"
                            title="Live Demo"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 hover:bg-white hover:text-slate-900 shadow-xs"
                          title="GitHub Repository"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* Footer within banner: Indicator & Watermark Number */}
                    <div className="relative z-10 flex items-end justify-between px-5 pb-4 sm:px-6 sm:pb-5">
                      {proj.thumbnail && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[9px] font-semibold text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE UI</span>
                        </span>
                      )}
                      <span className={`font-mono text-4xl sm:text-5xl font-black tracking-tighter select-none ml-auto ${proj.thumbnail ? "text-white/40 drop-shadow-md" : "text-white/30"}`}>
                        {proj.number}
                      </span>
                    </div>
                  </div>

                  {/* Bottom White Content Section */}
                  <div className="p-6 sm:p-7">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="text-left text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {proj.title}
                    </button>
                    
                    {/* Blue / Accent Highlight Subtitle (Matching Reference Image) */}
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-blue-600">
                      {proj.subtitle}
                    </p>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    <div className="mt-4 text-[11px] font-medium text-slate-400">
                      A project by <span className="font-semibold text-slate-700">25Rohit25</span>
                    </div>

                    {/* Tech Chip Tags (Light Grey Pills matching Reference) */}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {proj.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors group-hover:bg-slate-200/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Deep Dive / Summary / Repo */}
                <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(proj.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Deep Dive</span>
                    <span className="text-[10px]">↗</span>
                  </button>

                  <div className="flex items-center gap-3">
                    {proj.caseStudy && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCaseStudy(
                            expandedCaseStudy === proj.id ? null : proj.id
                          )
                        }
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                      >
                        {expandedCaseStudy === proj.id ? "Hide Summary ↑" : "Summary ↓"}
                      </button>
                    )}
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      Repo ↗
                    </a>
                  </div>
                </div>

                {/* Expandable Case Study Quick Summary (if toggled) */}
                {proj.caseStudy && expandedCaseStudy === proj.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-200 bg-slate-50 p-6 text-xs text-slate-700 space-y-3"
                  >
                    <div>
                      <span className="font-bold text-orange-600 uppercase text-[10px]">Problem:</span>
                      <p className="mt-0.5 text-slate-600">{proj.caseStudy.problem}</p>
                    </div>
                    <div>
                      <span className="font-bold text-sky-600 uppercase text-[10px]">Solution:</span>
                      <p className="mt-0.5 text-slate-600">{proj.caseStudy.solution}</p>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-600 uppercase text-[10px]">Performance:</span>
                      <p className="mt-0.5 text-slate-600">{proj.caseStudy.performance}</p>
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectId(proj.id)}
                        className="font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Explore Interactive System Architecture &amp; Flow</span>
                        <span>→</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* MIT/Harvard Academic Project Deep-Dive Modal */}
      <ProjectModal
        project={selectedProjectId ? projectDocs[selectedProjectId] || null : null}
        onClose={() => setSelectedProjectId(null)}
      />
    </section>
  );
}
