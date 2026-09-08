"use client";

import { motion } from "framer-motion";

const columns = [
  {
    title: "Backend",
    description: "Core service runtimes, API frameworks and persistence layers.",
    items: [
      "Java 21",
      "Spring Boot",
      "Spring WebFlux",
      "RESTful APIs",
      "Hibernate / JPA",
    ],
  },
  {
    title: "Distributed Systems",
    description: "Concurrency control, event messaging and transaction patterns.",
    items: [
      "Apache Kafka",
      "Redis Caching",
      "Transactional Outbox",
      "Pessimistic Row Locking",
      "Idempotent API Design",
    ],
  },
  {
    title: "AI Engineering",
    description: "Agent execution, standardized tool protocols and contextual retrieval.",
    items: [
      "Model Context Protocol (MCP)",
      "Autonomous AI Agents",
      "Policy-Grounded RAG",
      "Structured Tool Calling",
      "LLM APIs & Prompt Logic",
    ],
  },
  {
    title: "Infrastructure",
    description: "Containers, orchestration, load verification and observability.",
    items: [
      "PostgreSQL",
      "Docker",
      "Kubernetes (HPA)",
      "Prometheus & Grafana",
      "K6 Performance Testing",
      "GitHub Actions & CI",
    ],
  },
];

export default function TechStack() {
  return (
    <section id="skills" className="relative border-t border-black/[0.08] bg-[#f5f5f7] py-28 sm:py-36 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6e6e73]">
            Technical Stack
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
            Technologies I work with.
          </h3>
          <p className="mt-3 text-sm text-[#6e6e73]">
            Selected tools and frameworks applied across production microservices, distributed ledgers, and AI evaluation environments.
          </p>
        </motion.div>

        {/* 4 Simple Typographic Columns (No Cards / No Pills) */}
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {columns.map((col, index) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <h4 className="text-base font-semibold tracking-tight text-[#1d1d1f]">
                {col.title}
              </h4>
              <p className="mt-1 text-xs text-[#6e6e73] min-h-[32px]">
                {col.description}
              </p>

              <div className="mt-6 divide-y divide-black/[0.06] border-t border-black/[0.06]">
                {col.items.map((tech) => (
                  <div key={tech} className="py-3 text-sm font-medium text-[#1d1d1f]">
                    {tech}
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
