"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ConcurrencyRaceSimulator() {
  const [stage, setStage] = useState<"idle" | "running" | "locked_a" | "debited_a" | "locked_b" | "rejected_b" | "finished">("idle");
  const [balance, setBalance] = useState<number>(1000);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const runSimulation = () => {
    setBalance(1000);
    setIsLocked(false);
    setStage("running");
    setLogMessages(["[0.00ms] Incoming concurrent requests: Transfer A (₹800) & Transfer B (₹800) hit wallet simultaneously."]);

    setTimeout(() => {
      setStage("locked_a");
      setIsLocked(true);
      setLogMessages((prev) => [
        ...prev,
        "[4.12ms] Transfer A acquires exclusive lock: `SELECT balance FROM wallets WHERE id = 'usr_rohit' FOR UPDATE;`",
        "[4.50ms] Padlock engaged. Transfer B is queued waiting on DB row lock.",
      ]);
    }, 1100);

    setTimeout(() => {
      setStage("debited_a");
      setBalance(200);
      setLogMessages((prev) => [
        ...prev,
        "[8.20ms] Transfer A balance check: ₹1,000 >= ₹800 (VALID).",
        "[11.45ms] Transfer A debits ₹800. New balance = ₹200. Double-entry journal written. Transaction COMMITTED.",
      ]);
    }, 2400);

    setTimeout(() => {
      setIsLocked(false);
      setStage("locked_b");
      setLogMessages((prev) => [
        ...prev,
        "[14.10ms] Transfer A releases lock. Transfer B acquires row lock.",
        "[14.80ms] Transfer B reads latest committed balance: ₹200.",
      ]);
    }, 3600);

    setTimeout(() => {
      setStage("rejected_b");
      setLogMessages((prev) => [
        ...prev,
        "[16.20ms] Transfer B check: ₹200 < ₹800. Insufficient funds! Transaction rolled back and REJECTED safely.",
      ]);
    }, 4800);

    setTimeout(() => {
      setStage("finished");
      setLogMessages((prev) => [
        ...prev,
        "[18.00ms] RESULT: ₹1,000 wallet spent exactly ₹800. 0 overdrafts, 0 duplicate debits.",
      ]);
    }, 5800);
  };

  const reset = () => {
    setStage("idle");
    setBalance(1000);
    setIsLocked(false);
    setLogMessages([]);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-7 text-slate-100 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
            Interactive Concurrency Engine // 01
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Pessimistic Row-Locking Under Race Condition
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {stage === "idle" || stage === "finished" ? (
            <button
              type="button"
              onClick={runSimulation}
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
            >
              <span>▶ Run Race Simulation</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold text-slate-400"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>Lock Contention Active...</span>
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

      {/* Visual Animation Stage */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        {/* Left: Incoming Transfer Requests */}
        <div className="lg:col-span-4 space-y-3">
          {/* Transfer A Card */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              stage === "locked_a" || stage === "debited_a"
                ? "border-emerald-500/80 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : stage === "finished"
                ? "border-emerald-500/50 bg-emerald-950/20"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-300">REQUEST A</span>
              <span className="font-mono text-xs font-semibold text-emerald-400">Withdraw ₹800</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Thread 1 · Arrived at T=0ms
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
              {stage === "locked_a" && (
                <span className="text-amber-300 font-semibold animate-pulse">● ACQUIRED EXCLUSIVE LOCK</span>
              )}
              {stage === "debited_a" && (
                <span className="text-emerald-400 font-semibold">✓ COMMITTED (-₹800)</span>
              )}
              {stage === "finished" && (
                <span className="text-emerald-400 font-semibold">✓ SUCCESSFUL (Funds Dispatched)</span>
              )}
              {(stage === "idle" || stage === "running") && (
                <span className="text-slate-500">Waiting for DB worker...</span>
              )}
            </div>
          </div>

          {/* Transfer B Card */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              stage === "locked_a" || stage === "debited_a"
                ? "border-amber-500/50 bg-amber-950/20"
                : stage === "locked_b"
                ? "border-blue-500/80 bg-blue-950/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : stage === "rejected_b" || stage === "finished"
                ? "border-red-500/80 bg-red-950/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                : "border-slate-800 bg-slate-900/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-300">REQUEST B</span>
              <span className="font-mono text-xs font-semibold text-amber-400">Withdraw ₹800</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Thread 2 · Arrived at T=0ms (Simultaneous)
            </div>
            <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
              {(stage === "locked_a" || stage === "debited_a") && (
                <span className="text-amber-400 font-semibold animate-pulse">⏸ BLOCKED: WAITING ON LOCK</span>
              )}
              {stage === "locked_b" && (
                <span className="text-blue-300 font-semibold">● LOCK ACQUIRED → EVALUATING</span>
              )}
              {(stage === "rejected_b" || stage === "finished") && (
                <span className="text-red-400 font-semibold">✕ REJECTED: ₹200 &lt; ₹800 (NO OVERDRAFT)</span>
              )}
              {(stage === "idle" || stage === "running") && (
                <span className="text-slate-500">Waiting for DB worker...</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: The Wallet with Animated Padlock */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-[260px] rounded-2xl border-2 border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center shadow-2xl">
            {/* Animated Lock Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <motion.div
                animate={
                  isLocked
                    ? { scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-bold shadow-lg ${
                  isLocked
                    ? "bg-red-500 text-white shadow-red-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                <span>{isLocked ? "🔒 LOCKED (EXCLUSIVE)" : "🔓 UNLOCKED"}</span>
              </motion.div>
            </div>

            <div className="mt-3 text-xs font-mono font-medium text-slate-400">
              WALLET ID: usr_rohit
            </div>

            {/* Current Balance Display */}
            <div className="mt-3">
              <span className="text-xs text-slate-400">Committed Balance</span>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                ₹{balance}
              </div>
            </div>

            {/* Database Row Indicator */}
            <div className="mt-4 rounded-lg bg-black/60 p-2.5 font-mono text-[10px] text-slate-400 border border-slate-800">
              <div>SELECT ... FOR UPDATE</div>
              <div className="text-slate-500 text-[9px] mt-0.5">PostgreSQL Row-Level Mutex</div>
            </div>

            {/* Protection Summary */}
            <div className="mt-3 text-[11px] font-medium text-amber-300/90">
              {stage === "finished" ? "✓ 0 Double-Spend Loss" : "Guaranteed Atomic Isolation"}
            </div>
          </div>
        </div>

        {/* Right: Real-time Concurrency Execution Log */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800/80 bg-black/60 p-4 font-mono text-[11px] leading-relaxed">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[10px] text-slate-400 font-bold uppercase">
            <span>Kernel / DB Mutex Log</span>
            <span className="text-emerald-400">{stage !== "idle" && stage !== "finished" ? "STREAMING" : "READY"}</span>
          </div>

          <div className="h-44 overflow-y-auto space-y-1.5 text-slate-300 scrollbar-none">
            {logMessages.length === 0 ? (
              <div className="text-slate-600 italic pt-6 text-center">
                Click &quot;Run Race Simulation&quot; to trace serializable lock execution.
              </div>
            ) : (
              logMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`${
                    msg.includes("REJECTED")
                      ? "text-red-400 font-semibold"
                      : msg.includes("RESULT")
                      ? "text-emerald-300 font-bold"
                      : msg.includes("LOCKED") || msg.includes("acquires")
                      ? "text-amber-300"
                      : "text-slate-300"
                  }`}
                >
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoubleEntryLedgerDemo() {
  const [transferAmount, setTransferAmount] = useState<number>(500);
  const rohitInitial = 2500;
  const rahulInitial = 1200;

  const rohitFinal = rohitInitial - transferAmount;
  const rahulFinal = rahulInitial + transferAmount;
  const deltaSum = -transferAmount + transferAmount;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-blue-600 uppercase tracking-wider">
            Financial Correctness // 02
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Immutable Double-Entry Ledger (Sum-Zero Invariant)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Transfer Amount:</span>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1">
            <span className="font-mono text-xs font-bold text-slate-500 mr-1">₹</span>
            <input
              type="number"
              min="50"
              max="2000"
              step="50"
              value={transferAmount}
              onChange={(e) => setTransferAmount(Math.max(0, Math.min(2500, Number(e.target.value) || 0)))}
              className="w-20 bg-transparent font-mono text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Rohit's Account (DEBIT) */}
        <div className="rounded-xl border border-red-100 bg-red-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-red-700">
            <span>ROHIT WALLET</span>
            <span className="rounded bg-red-100 px-2 py-0.5 font-mono text-[10px]">DEBIT</span>
          </div>
          <div className="mt-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Opening Balance:</span>
              <span>₹{rohitInitial}</span>
            </div>
            <div className="flex justify-between font-bold text-red-600">
              <span>Journal Entry:</span>
              <span>-₹{transferAmount}</span>
            </div>
            <div className="border-t border-red-200 pt-1 flex justify-between font-bold text-slate-900">
              <span>Closing Balance:</span>
              <span>₹{rohitFinal}</span>
            </div>
          </div>
        </div>

        {/* Rahul's Account (CREDIT) */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>RAHUL WALLET</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px]">CREDIT</span>
          </div>
          <div className="mt-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Opening Balance:</span>
              <span>₹{rahulInitial}</span>
            </div>
            <div className="flex justify-between font-bold text-emerald-600">
              <span>Journal Entry:</span>
              <span>+₹{transferAmount}</span>
            </div>
            <div className="border-t border-emerald-200 pt-1 flex justify-between font-bold text-slate-900">
              <span>Closing Balance:</span>
              <span>₹{rahulFinal}</span>
            </div>
          </div>
        </div>

        {/* The Conservation Invariant Card */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-800">
              <span>CONSERVATION SUM</span>
              <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px]">INVARIANT</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
              Every financial transaction records both sides. Money is transferred, never created or destroyed.
            </p>
          </div>

          <div className="mt-3 rounded-lg border border-blue-200 bg-white p-2.5 font-mono text-center">
            <div className="text-[10px] text-slate-400">∑ DEBIT + ∑ CREDIT = NET DELTA</div>
            <div className="text-base font-extrabold text-blue-700 mt-0.5">
              -₹{transferAmount} + ₹{transferAmount} = ₹{deltaSum}.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IdempotencySimulator() {
  const [requestCount, setRequestCount] = useState<number>(0);
  const [idempotencyKey] = useState<string>("tx_8af31");
  const [response, setResponse] = useState<{ status: string; latency: string; detail: string; isCached: boolean } | null>(null);

  const triggerTransfer = () => {
    const nextCount = requestCount + 1;
    setRequestCount(nextCount);

    if (nextCount === 1) {
      // First attempt: executed against DB
      setResponse({
        status: "200 OK (COMMITTED)",
        latency: "14.2 ms",
        detail: "Key tx_8af31 stored in Redis with 24h TTL. Database transaction committed ₹2,500 transfer.",
        isCached: false,
      });
    } else {
      // Subsequent retries: intercepted by Redis
      setResponse({
        status: "200 OK (CACHED IDEMPOTENT RECEIPT)",
        latency: "0.8 ms",
        detail: "Duplicate request intercepted by Redis SETNX check. Original receipt returned instantly. 0 duplicate database mutations.",
        isCached: true,
      });
    }
  };

  const resetKey = () => {
    setRequestCount(0);
    setResponse(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
            Network Reliability // 03
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Idempotency Guard: Preventing Double-Charges on Retry
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerTransfer}
            className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all cursor-pointer"
          >
            <span>{requestCount === 0 ? "1. Click 'Transfer ₹2,500'" : `2. Retry Same Click (Attempt #${requestCount + 1})`}</span>
          </button>

          {requestCount > 0 && (
            <button
              type="button"
              onClick={resetKey}
              className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Reset Key
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 items-start">
        {/* Left: What Happened */}
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-semibold text-slate-700">HTTP REQUEST HEADERS</span>
              <span className="text-purple-600 font-bold">idempotency-key: {idempotencyKey}</span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              When a user clicks &quot;Pay&quot; and the cellular connection drops before the HTTP response arrives, the client automatically retries.
              Without an idempotency key, ₹2,500 would be debited a second time.
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold text-slate-900">Total Client Clicks on UI:</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-slate-900">{requestCount}</span>
              <span className="text-xs text-slate-500">
                {requestCount === 0
                  ? "(Ready for first transfer)"
                  : requestCount === 1
                  ? "(First transfer processed)"
                  : `(${requestCount - 1} duplicate retries intercepted & prevented)`}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Server / Redis Interception Result */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
            <span>GATEWAY IDEMPOTENCY FILTER</span>
            <span>{response ? response.latency : "IDLE"}</span>
          </div>

          {response ? (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${response.isCached ? "bg-purple-400" : "bg-emerald-400"}`} />
                <span className={`font-bold ${response.isCached ? "text-purple-300" : "text-emerald-400"}`}>
                  {response.status}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {response.detail}
              </p>
              <div className="mt-2 rounded bg-black/60 p-2 text-[10px] text-slate-400 border border-slate-800">
                {response.isCached ? (
                  <span className="text-emerald-300">✓ DB MUTATIONS EXECUTED: EXACTLY 1 (ZERO DUPLICATE CHARGES)</span>
                ) : (
                  <span className="text-slate-300">DB TRANSACTION: 1 RECORD CREATED · REDIS KEY SET</span>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-slate-600 italic">
              Click the button above to simulate the first payment, then click again to see how Redis idempotency stops double deductions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DatabaseSchemaVisualizer() {
  const [selectedTable, setSelectedTable] = useState<string>("wallets");

  const tables = [
    {
      name: "users",
      badge: "IDENTITY",
      description: "User profiles and KYC compliance state",
      columns: [
        { name: "id", type: "UUID", role: "PK" },
        { name: "email", type: "VARCHAR(255)", role: "UNIQUE" },
        { name: "full_name", type: "VARCHAR(120)", role: "" },
        { name: "status", type: "ENUM('ACTIVE', 'SUSPENDED')", role: "" },
        { name: "created_at", type: "TIMESTAMPTZ", role: "" },
      ],
    },
    {
      name: "wallets",
      badge: "CORE BALANCE",
      description: "Holds account balances with pessimistic row-locking guards",
      columns: [
        { name: "id", type: "UUID", role: "PK" },
        { name: "user_id", type: "UUID", role: "FK -> users.id" },
        { name: "currency", type: "CHAR(3)", role: "DEFAULT 'INR'" },
        { name: "balance", type: "NUMERIC(18, 4)", role: "CHECK >= 0" },
        { name: "status", type: "ENUM('ACTIVE', 'FROZEN')", role: "" },
        { name: "version", type: "BIGINT", role: "AUDIT NONCE" },
        { name: "updated_at", type: "TIMESTAMPTZ", role: "" },
      ],
    },
    {
      name: "transactions",
      badge: "SETTLEMENT",
      description: "Records end-to-end payment intent and idempotency keys",
      columns: [
        { name: "id", type: "UUID", role: "PK" },
        { name: "idempotency_key", type: "VARCHAR(64)", role: "UNIQUE INDEX" },
        { name: "from_wallet_id", type: "UUID", role: "FK -> wallets.id" },
        { name: "to_wallet_id", type: "UUID", role: "FK -> wallets.id" },
        { name: "amount", type: "NUMERIC(18, 4)", role: "CHECK > 0" },
        { name: "status", type: "ENUM('PENDING', 'COMMITTED', 'FAILED')", role: "" },
        { name: "created_at", type: "TIMESTAMPTZ", role: "" },
      ],
    },
    {
      name: "ledger_entries",
      badge: "AUDIT LOG",
      description: "Immutable double-entry debit/credit journal rows",
      columns: [
        { name: "id", type: "BIGSERIAL", role: "PK" },
        { name: "transaction_id", type: "UUID", role: "FK -> transactions.id" },
        { name: "wallet_id", type: "UUID", role: "FK -> wallets.id" },
        { name: "entry_type", type: "ENUM('DEBIT', 'CREDIT')", role: "" },
        { name: "amount", type: "NUMERIC(18, 4)", role: "" },
        { name: "balance_after", type: "NUMERIC(18, 4)", role: "POINT-IN-TIME SNAPSHOT" },
        { name: "created_at", type: "TIMESTAMPTZ", role: "" },
      ],
    },
    {
      name: "outbox_events",
      badge: "EVENT RELAY",
      description: "Transactional outbox for atomic Kafka event publishing",
      columns: [
        { name: "id", type: "UUID", role: "PK" },
        { name: "aggregate_type", type: "VARCHAR(64)", role: "'WALLET_TRANSFER'" },
        { name: "aggregate_id", type: "VARCHAR(64)", role: "ID" },
        { name: "event_type", type: "VARCHAR(64)", role: "'FUNDS_TRANSFERRED'" },
        { name: "payload", type: "JSONB", role: "FULL AUDIT BLOB" },
        { name: "status", type: "ENUM('PENDING', 'PUBLISHED')", role: "INDEX" },
        { name: "created_at", type: "TIMESTAMPTZ", role: "" },
      ],
    },
  ];

  const currentTable = tables.find((t) => t.name === selectedTable) || tables[1];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-blue-600 uppercase tracking-wider">
            Data Architecture // Schema
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Relational Ledger Entity-Relationship Schema
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
            <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-800">
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
                          : col.role.includes("CHECK") || col.role.includes("UNIQUE")
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
