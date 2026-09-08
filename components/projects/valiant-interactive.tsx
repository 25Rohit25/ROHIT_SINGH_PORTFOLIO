"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IncidentTimelineSimulator() {
  const [stage, setStage] = useState<"idle" | "correlating" | "querying_prom" | "scored" | "snapshot_saved">("idle");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const candidateChanges = [
    {
      id: "c1",
      time: "14:31",
      title: "Deployment v2.8.1",
      service: "payment-gateway",
      type: "K8s Deployment",
      impact: "LOW",
      score: 0.08,
      latencyDelta: "+3%",
      errorDelta: "+0.1%",
    },
    {
      id: "c2",
      time: "14:44",
      title: "ConfigMap Updated",
      service: "checkout-api",
      type: "K8s ConfigMap",
      impact: "LOW",
      score: 0.12,
      latencyDelta: "+8%",
      errorDelta: "0.0%",
    },
    {
      id: "c3",
      time: "14:53",
      title: "Secret Rotated",
      service: "auth-service",
      type: "K8s Secret",
      impact: "NEGLIGIBLE",
      score: 0.01,
      latencyDelta: "0%",
      errorDelta: "0.0%",
    },
    {
      id: "c4",
      time: "15:02",
      title: "Deployment v2.8.2",
      service: "checkout-api",
      type: "K8s Rollout (v2.8.2)",
      impact: "CRITICAL HIGH",
      score: 0.94,
      latencyDelta: "+167% (182ms → 487ms)",
      errorDelta: "+628% (0.7% → 5.1%)",
      culprit: true,
    },
    {
      id: "c5",
      time: "15:15",
      title: "Feature Flag Toggled",
      service: "checkout-api",
      type: "LaunchDarkly Flag",
      impact: "MODERATE",
      score: 0.28,
      latencyDelta: "+14%",
      errorDelta: "+0.4%",
    },
  ];

  const runAnalysis = () => {
    setStage("correlating");
    setSelectedCandidate(null);

    setTimeout(() => {
      setStage("querying_prom");
    }, 1200);

    setTimeout(() => {
      setStage("scored");
      setSelectedCandidate("c4");
    }, 2600);

    setTimeout(() => {
      setStage("snapshot_saved");
    }, 3800);
  };

  const reset = () => {
    setStage("idle");
    setSelectedCandidate(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-7 text-slate-100 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
            Deterministic Correlator // 01
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Production Incident Investigation Simulator
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {stage === "idle" || stage === "snapshot_saved" ? (
            <button
              type="button"
              onClick={runAnalysis}
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition-all cursor-pointer"
            >
              <span>▶ Run Deterministic Impact Analysis</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold text-purple-300"
            >
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
              <span>
                {stage === "correlating"
                  ? "Loading Candidate Changes..."
                  : stage === "querying_prom"
                  ? "Prometheus PromQL Fetching..."
                  : "Calculating Metric Deviations..."}
              </span>
            </button>
          )}

          {stage !== "idle" && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Incident Alert Header */}
      <div className="mt-5 rounded-xl border border-red-500/40 bg-red-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
          <span className="font-mono text-xs font-bold text-red-400">
            INCIDENT AT 15:20:00 · SERVICE: checkout-api
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-red-300">
          <span>p95 Latency &gt; 600ms</span>
          <span>•</span>
          <span>Error Rate = 8.4%</span>
        </div>
      </div>

      {/* Candidate Changes Timeline */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span>CHANGES EXECUTED IN PRECEDING 60 MINUTES (14:30 - 15:20)</span>
          <span>{stage === "snapshot_saved" ? "RANKED BY IMPACT" : "CHRONOLOGICAL ORDER"}</span>
        </div>

        <div className="space-y-2.5">
          {candidateChanges.map((change) => {
            const isRankedCulprit = stage === "scored" || stage === "snapshot_saved";
            const isSelected = selectedCandidate === change.id;

            return (
              <div
                key={change.id}
                onClick={() => isRankedCulprit && setSelectedCandidate(change.id)}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${
                  change.culprit && isRankedCulprit
                    ? "border-red-500 bg-red-950/40 shadow-[0_0_20px_rgba(239,68,68,0.25)] ring-2 ring-red-500/30"
                    : isSelected
                    ? "border-purple-500 bg-slate-900"
                    : "border-slate-800 bg-slate-900/60 hover:bg-slate-900"
                } ${isRankedCulprit ? "cursor-pointer" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400 w-12 shrink-0">
                    {change.time}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{change.title}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-300">
                        {change.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Service: <code className="text-slate-300">{change.service}</code>
                    </div>
                  </div>
                </div>

                {/* Score & Metric Deviations */}
                <div className="flex items-center gap-4 text-right">
                  {stage === "correlating" && (
                    <span className="font-mono text-[10px] text-slate-500 animate-pulse">
                      Analyzing window...
                    </span>
                  )}
                  {stage === "querying_prom" && (
                    <span className="font-mono text-[10px] text-purple-400 animate-pulse">
                      PromQL: histogram_quantile()...
                    </span>
                  )}
                  {(stage === "scored" || stage === "snapshot_saved") && (
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[11px] text-slate-300 hidden md:block">
                        <span>Latency: {change.latencyDelta}</span>
                        <span className="mx-2 text-slate-600">|</span>
                        <span>Errors: {change.errorDelta}</span>
                      </div>

                      <div
                        className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${
                          change.culprit
                            ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                            : change.impact === "MODERATE"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {change.culprit ? "HIGHEST IMPACT (0.94)" : `Score: ${change.score.toFixed(2)}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Snapshot Confirmation Banner */}
      {stage === "snapshot_saved" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs text-emerald-300"
        >
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>IMMUTABLE SNAPSHOT CREATED: #snap_valiant_042f9</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Stored in PostgreSQL · Re-running analysis will not silently mutate historical conclusion
          </span>
        </motion.div>
      )}
    </div>
  );
}

export function BaselineImpactVisualizer() {
  const [testTime, setTestTime] = useState<number>(30); // minutes after rollout

  const rolloutTime = "14:32:18";
  const requiredWindow = 30; // minutes
  const isWindowClosed = testTime >= requiredWindow;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
            Analysis Boundary // Windowing
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Baseline vs. Impact Window Boundary (ErrImpactWindowNotClosed)
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-600">Simulated Elapsed Time:</span>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
            <button
              type="button"
              onClick={() => setTestTime(6)}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                testTime === 6
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              T+6m (14:38)
            </button>
            <button
              type="button"
              onClick={() => setTestTime(30)}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                testTime === 30
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              T+30m (15:02)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {/* Visual Timeline Diagram */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-200 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Baseline Window */}
            <div className="rounded-lg border border-blue-500/40 bg-blue-950/20 p-4">
              <div className="flex items-center justify-between text-blue-400 font-bold">
                <span>BASELINE WINDOW (30 MIN)</span>
                <span>14:02 → 14:32</span>
              </div>
              <div className="mt-3 space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span>p95 Latency:</span>
                  <strong className="text-white">182 ms</strong>
                </div>
                <div className="flex justify-between">
                  <span>HTTP 5xx Error Rate:</span>
                  <strong className="text-white">0.7%</strong>
                </div>
                <div className="flex justify-between">
                  <span>CPU Throttles:</span>
                  <strong className="text-white">2.1%</strong>
                </div>
              </div>
            </div>

            {/* Impact Window */}
            <div
              className={`rounded-lg border p-4 transition-all ${
                isWindowClosed
                  ? "border-red-500/50 bg-red-950/30"
                  : "border-amber-500/50 bg-amber-950/20"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className={isWindowClosed ? "text-red-400" : "text-amber-400"}>
                  IMPACT WINDOW ({testTime} MIN ELAPSED)
                </span>
                <span className="text-slate-400">
                  {testTime === 6 ? "14:32 → 14:38" : "14:32 → 15:02"}
                </span>
              </div>
              <div className="mt-3 space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span>p95 Latency:</span>
                  <strong className={isWindowClosed ? "text-red-300 font-bold" : "text-slate-400"}>
                    {isWindowClosed ? "487 ms (+167%)" : "Incomplete (Insufficient samples)"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>HTTP 5xx Error Rate:</span>
                  <strong className={isWindowClosed ? "text-red-300 font-bold" : "text-slate-400"}>
                    {isWindowClosed ? "5.1% (+628%)" : "Incomplete"}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Analysis Status:</span>
                  <strong className={isWindowClosed ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {isWindowClosed ? "READY FOR CORRELATION" : "WINDOW NOT CLOSED"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Rollout Boundary Divider */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500">EXECUTION BOUNDARY: </span>
              <strong className="text-emerald-400">{rolloutTime} (Rollout Complete)</strong>
              <span className="text-slate-500 text-[10px] ml-2">
                (NOT Git commit time 10:04 AM)
              </span>
            </div>
            <span className="text-slate-400">Sampling Step: 15s</span>
          </div>
        </div>

        {/* Evaluation Guard Status */}
        <div className="mt-4">
          {!isWindowClosed ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <span className="text-base font-bold text-amber-600">⚠</span>
              <div>
                <strong>ErrImpactWindowNotClosed Triggered:</strong> Only 6 minutes of post-rollout evidence exist.
                Valiant deliberately rejects premature analysis rather than guessing on incomplete data.
                This prioritizes <strong>correctness over premature false conclusions</strong>.
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-start gap-2.5">
              <span className="text-base font-bold text-emerald-600">✓</span>
              <div>
                <strong>30-Minute Impact Window Closed:</strong> Full 120 Prometheus range vector samples collected.
                Calculated Latency Shift: <code className="font-bold">+167%</code> · Error Rate Shift: <code className="font-bold">+628%</code>.
                Deterministic candidate ranking computed.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ValiantSchemaVisualizer() {
  const [selectedTable, setSelectedTable] = useState<string>("change_events");

  const tables = [
    {
      name: "change_events",
      badge: "CANONICAL EVENT",
      description: "Normalized system mutations from Kubernetes rollouts and CI/CD webhooks",
      columns: [
        { name: "id", type: "UUID", role: "PK" },
        { name: "service_id", type: "VARCHAR(64)", role: "INDEX" },
        { name: "version", type: "VARCHAR(64)", role: "'v2.8.2'" },
        { name: "source_type", type: "ENUM('KUBERNETES', 'CICD')", role: "" },
        { name: "rollout_start", type: "TIMESTAMPTZ", role: "" },
        { name: "rollout_end", type: "TIMESTAMPTZ", role: "CRITICAL BOUNDARY" },
        { name: "metadata", type: "JSONB", role: "PIPELINE / COMMIT REF" },
        { name: "created_at", type: "TIMESTAMPTZ", role: "" },
      ],
    },
    {
      name: "impact_analysis_snapshots",
      badge: "IMMUTABLE AUDIT",
      description: "Durable analysis conclusions; re-running historical queries never mutates past findings",
      columns: [
        { name: "id", type: "UUID", role: "PK" },
        { name: "service_id", type: "VARCHAR(64)", role: "INDEX" },
        { name: "change_event_id", type: "UUID", role: "FK -> change_events.id" },
        { name: "baseline_start", type: "TIMESTAMPTZ", role: "T - 30m" },
        { name: "baseline_end", type: "TIMESTAMPTZ", role: "T (Rollout End)" },
        { name: "impact_start", type: "TIMESTAMPTZ", role: "T (Rollout End)" },
        { name: "impact_end", type: "TIMESTAMPTZ", role: "T + 30m" },
        { name: "impact_score", type: "NUMERIC(4, 3)", role: "0.000 - 1.000" },
        { name: "metric_deviations", type: "JSONB", role: "RAW TIME-SERIES DELTAS" },
        { name: "created_at", type: "TIMESTAMPTZ", role: "IMMUTABLE" },
      ],
    },
    {
      name: "metric_queries",
      badge: "PROMETHEUS CONFIG",
      description: "Registered PromQL metric signatures queried per service",
      columns: [
        { name: "id", type: "UUID", role: "PK" },
        { name: "service_id", type: "VARCHAR(64)", role: "INDEX" },
        { name: "metric_name", type: "VARCHAR(128)", role: "'http_p95_latency'" },
        { name: "promql_template", type: "TEXT", role: "HISTOGRAM_QUANTILE" },
        { name: "weight", type: "NUMERIC(3, 2)", role: "WEIGHT IN HEURISTIC" },
      ],
    },
  ];

  const currentTable = tables.find((t) => t.name === selectedTable) || tables[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
            Data Architecture // Schema
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Valiant Relational Model &amp; Immutable Snapshots
          </h4>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {tables.map((tbl) => (
            <button
              key={tbl.name}
              type="button"
              onClick={() => setSelectedTable(tbl.name)}
              className={`rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all cursor-pointer ${
                selectedTable === tbl.name
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tbl.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-900">
              TABLE: {currentTable.name}
            </span>
            <span className="rounded bg-purple-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-purple-800">
              {currentTable.badge}
            </span>
          </div>
          <span className="text-xs text-slate-500">{currentTable.description}</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-2.5">Column Name</th>
                <th className="px-4 py-2.5">Data Type</th>
                <th className="px-4 py-2.5">Constraint / Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {currentTable.columns.map((col) => (
                <tr key={col.name} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2 font-bold text-slate-900">{col.name}</td>
                  <td className="px-4 py-2 text-slate-600">{col.type}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        col.role.includes("PK")
                          ? "bg-amber-100 text-amber-800"
                          : col.role.includes("FK")
                          ? "bg-purple-100 text-purple-800"
                          : col.role.includes("CRITICAL") || col.role.includes("IMMUTABLE")
                          ? "bg-emerald-100 text-emerald-800"
                          : "text-slate-500"
                      }`}
                    >
                      {col.role || "COLUMN"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ValiantAttributionCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50/60 via-white to-slate-50 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-purple-600 px-3 py-0.5 font-mono text-xs font-bold text-white">
          OPEN-SOURCE ATTRIBUTION &amp; MY CONTRIBUTIONS
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-900">
        Upstream Provenance &amp; Personal Implementations
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        Valiant on Rohit&apos;s portfolio is a fork of the open-source platform <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 font-bold">BytePeaks/valiant</code>.
        To maintain complete engineering integrity, the upstream foundation is clearly distinguished from Rohit&apos;s personal modifications and feature additions.
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="font-mono text-xs font-bold text-purple-700 uppercase">
            Upstream Foundation (BytePeaks/valiant)
          </div>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <li>• Core Go collector architecture and Kubernetes Informer watch loops.</li>
            <li>• Fundamental ChangeEvent normalization schema design.</li>
            <li>• Initial Prometheus HTTP client range vector querying primitives.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
          <div className="font-mono text-xs font-bold text-purple-800 uppercase">
            Rohit&apos;s Implementations &amp; Enhancements
          </div>
          <ul className="mt-2 space-y-1.5 text-purple-950 font-medium">
            <li>• <strong>Multi-Metric Heuristic Scoring:</strong> Weighted variance engine combining p95 latency, 5xx error spikes, and CPU throttles into normalized 0.00–1.00 index.</li>
            <li>• <strong>Immutable Snapshot Persistence:</strong> PostgreSQL schema and handler ensuring historical incident audits never mutate upon future re-evaluation.</li>
            <li>• <strong>Prometheus Batch Query Optimization:</strong> Mitigated O(N×M) network bottlenecks via concurrent Go goroutine rollups.</li>
            <li>• <strong>Next.js Investigation Console:</strong> Built interactive service degradation timeline and visual metric deviation graphs.</li>
            <li>• <strong>Dockerized Chaos Test Harness:</strong> Automated local reproduction sandbox simulating canary rollouts with synthetic traffic regressions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
