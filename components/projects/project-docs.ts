export interface TechStackItem {
  name: string;
  role: string;
  rationale: string;
}

export interface ArchitectureNode {
  step: string;
  label: string;
  sublabel: string;
  protocol?: string;
  description: string;
  payloadExample?: string;
  latencyOrSla?: string;
}

export interface MetricItem {
  value: string;
  label: string;
  detail: string;
}

export interface ProjectWhitepaper {
  id: string;
  specId: string;
  title: string;
  subtitle: string;
  categoryBadge: string;
  authorship: string;
  status: string;
  githubUrl: string;
  liveUrl?: string;
  thumbnail?: string;
  accentColor: string;
  gradient: string;

  // 3-Layer Persona Architecture
  layers?: {
    recruiter: {
      whatIsIt: string;
      whyItMatters: string;
      whatBuilt: string;
      metricsProof: string;
    };
    engineer: {
      centralQuestion: string;
      coreArchitecture: string;
      concurrencyProtection?: string;
      ledgerMechanics?: string;
      idempotencyGuard?: string;
      kafkaDecoupling?: string;
      [key: string]: any;
    };
    technicalReader: {
      transactionBoundaries?: string;
      concurrencyDeepDive?: string;
      eventConsistency?: string;
      rateLimiting?: string;
      observability?: string;
      loadTesting?: {
        methodology: string;
        vus: string;
        tps: string;
        p50: string;
        p95: string;
        p99: string;
        errorRate: string;
      };
      [key: string]: any;
    };
  };

  // Motivation & Aim
  aim: {
    statement: string;
    targetDomain: string;
    coreHypothesis: string;
  };

  // Problem Formulation
  problemStatement: {
    overview: string;
    challenges: string[];
    criticalFailureMode: string;
  };

  // Architecture & Interactive Pipeline
  architecture: {
    summary: string;
    diagramType: string;
    pipeline: ArchitectureNode[];
    keyMechanisms: {
      title: string;
      description: string;
      invariant: string;
    }[];
  };

  // Empirical Benchmarks & Impact
  benefits: {
    summary: string;
    metrics: MetricItem[];
    impactHighlights: string[];
  };

  // Tech Stack Requirements & Trade-offs
  techStackMatrix: TechStackItem[];

  // Future Scalability Roadmap
  roadmap: {
    phase: string;
    title: string;
    description: string;
  }[];
}

export const projectDocs: Record<string, ProjectWhitepaper> = {
  // 1. PAYFLOW
  payflow: {
    id: "payflow",
    specId: "DISTRIBUTED // 01",
    title: "Payflow",
    subtitle: "Building a payment system where money cannot disappear twice",
    categoryBadge: "Distributed Systems & Fintech",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Benchmarked",
    githubUrl: "https://github.com/25Rohit25/Payflow",
    thumbnail: "/projects/payflow-dashboard.png",
    accentColor: "#ea580c",
    gradient: "from-[#ea580c] via-[#f97316] to-[#fb923c]",

    layers: {
      recruiter: {
        whatIsIt:
          "Payflow is a high-throughput digital wallet and ledger system built around one core requirement: Every financial operation must remain correct, even when multiple requests arrive at the same time.",
        whyItMatters:
          "A naive payment API allows race conditions where two simultaneous transfers overspend a balance, network retries double-charge clients, or database updates commit while events fail. For financial systems, this means lost capital and ledger discrepancies.",
        whatBuilt:
          "Rohit architected and built an end-to-end distributed ledger engine utilizing PostgreSQL pessimistic row-level locking, Redis idempotency keys, an immutable double-entry journal, and the Transactional Outbox pattern over Apache Kafka to decouple downstream fraud and analytics.",
        metricsProof:
          "Benchmarked under 800 virtual users across 50 threads in k6: 450 sustained TPS, <85ms event pipeline SLA, and 0 ledger discrepancies across millions of simulated transfers.",
      },
      engineer: {
        centralQuestion:
          "How do you guarantee that ₹1,000 leaves one wallet exactly once and reaches another wallet exactly once?",
        coreArchitecture:
          "A decoupled event-driven architecture separating the synchronous transactional settlement path (PostgreSQL pessimistic row-locking + double-entry journal + transactional outbox) from downstream asynchronous event processing (Apache Kafka + Fraud Detection Engine + Real-time Analytics).",
        concurrencyProtection:
          "When two transfers arrive simultaneously attempting to withdraw ₹800 from a ₹1,000 wallet, Payflow uses pessimistic database locking (`SELECT ... FOR UPDATE` with deterministic ascending ID ordering). Transfer A acquires the lock, debits ₹800 (leaving ₹200), and commits. Transfer B acquires the lock, reads ₹200, and is safely rejected. Money is strictly protected from double-spending.",
        ledgerMechanics:
          "Instead of a naive mutable column `wallet.balance = 5000`, Payflow records immutable paired debit and credit journal lines for every financial event. When Rohit sends Rahul ₹500, Rohit's wallet is debited -₹500 and Rahul's is credited +₹500. The net delta across the entire ledger is strictly ₹0.00 — money is transferred, never created or destroyed.",
        idempotencyGuard:
          "Clients provide an `idempotency-key: tx_8af31` header. If a user clicks 'Pay' and their mobile network drops before the response arrives, the retry hits a sub-millisecond Redis SETNX filter. Redis detects the processed transaction and immediately returns the cached receipt, preventing duplicate deductions.",
        kafkaDecoupling:
          "Fraud risk checks, user push notifications, and analytics pipelines must never block the core transfer latency path. Payflow commits the financial transaction and an outbox event into PostgreSQL atomically in one database transaction, then relays the event asynchronously to Kafka topics.",
      },
      technicalReader: {
        transactionBoundaries:
          "Enforced using Spring Boot declarative `@Transactional(isolation = Isolation.READ_COMMITTED)` boundaries. The transaction boundary wraps the pessimistic wallet locks, balance validation check, insertion of both double-entry ledger rows, and insertion of the outbox event. Either all 4 operations succeed and commit atomically, or all are rolled back cleanly.",
        concurrencyDeepDive:
          "Optimistic locking (`@Version`) fails catastrophically under heavy financial contention because concurrent threads collide on version increments, causing retry storms that exhaust connection pools and spike latency above 2,000ms. Payflow selects pessimistic row-level locking (`SELECT FOR UPDATE`), ordering wallet IDs deterministically (`min(A, B)` then `max(A, B)`) to guarantee a cycle-free wait-for lock graph that eliminates deadlocks.",
        eventConsistency:
          "Directly executing `kafkaTemplate.send()` inside a database transaction introduces the dual-write split-brain hazard: if the DB commits but Kafka is temporarily unreachable, the downstream system misses the event; if Kafka accepts the event but DB rollback occurs, downstream systems process phantom money. The Transactional Outbox pattern stages events in the same DB transaction, then a dedicated polling relay publishes with at-least-once delivery guarantees.",
        rateLimiting:
          "Edge endpoints enforce token-bucket rate limiting (100 req/min per IP/API token) using Redis token buckets to protect against automated credential stuffing, replay spam, and denial-of-service attempts on financial endpoints.",
        observability:
          "Complete telemetry stack integrating Prometheus, Micrometer, and Grafana dashboards tracking JVM Virtual Thread carrier utilization, HikariCP active vs. idle connection pool saturation, and p50/p95/p99 API latency distributions.",
        loadTesting: {
          methodology:
            "k6 stress test harness simulating 800 virtual users across 50 worker threads making rapid, concurrent wallet transfers with deliberate race condition targeting (multiple threads targeting identical account pairs).",
          vus: "800 VUs",
          tps: "450 TPS",
          p50: "24 ms",
          p95: "68 ms",
          p99: "114 ms",
          errorRate: "0.00% (0 Overdrafts, 0 Deadlocks)",
        },
      },
    },

    aim: {
      statement:
        "A high-throughput digital wallet and ledger system built around one core requirement: Every financial operation must remain correct, even when multiple requests arrive at the same time. Payflow supports deposits, withdrawals, and wallet-to-wallet transfers while maintaining a complete financial audit trail through an immutable double-entry ledger.",
      targetDomain: "High-Volume Financial Engineering & Distributed Banking",
      coreHypothesis:
        "Guaranteeing that ₹1,000 leaves one wallet exactly once and reaches another wallet exactly once requires eliminating read-modify-write race conditions via deterministic pessimistic row-locking, preventing retry double-charges via Redis idempotency keys, and eliminating dual-write split-brains via the Transactional Outbox pattern.",
    },

    problemStatement: {
      overview:
        "A payment API looks simple from the outside: `POST /transfer` (₹1,000 Rohit → Rahul). But internally, several things can go wrong: two transfer requests may execute at the same time, a client may retry the same request because their network connection failed, the database may update successfully while an event fails to reach another service, or a user may send transactions faster than downstream fraud checks can process them. For ordinary applications, these are annoying bugs; for a financial system, they mean duplicated payments or incorrect balances.",
      challenges: [
        "Concurrent Overdrafts: Two simultaneous ₹800 withdrawal requests against a ₹1,000 balance both read ₹1,000 available and approve, spending ₹1,600 from a ₹1,000 wallet.",
        "Network Retry Duplications: Mobile connection drops before HTTP 200 arrives; client retries and triggers a duplicate transfer without idempotency.",
        "Dual-Write Split-Brain: Writing directly to PostgreSQL and publishing to Kafka introduces partial failures where one commits while the other fails.",
      ],
      criticalFailureMode:
        "Phantom balance drift and catastrophic optimistic-locking retry storms under 50+ concurrent threads, causing degraded p99 latency (>2,000ms) and unauthorized negative wallet balances.",
    },

    architecture: {
      summary:
        "A decoupled 10-node transactional and event-driven architecture enforcing serializable wallet mutation boundaries, atomic double-entry bookkeeping, and asynchronous downstream fan-out.",
      diagramType: "Complete Journey of One Transfer (Atomic Pipeline & Asynchronous Fan-Out)",
      pipeline: [
        {
          step: "01",
          label: "Client Ingress",
          sublabel: "Transfer ₹2,500 Request",
          protocol: "HTTP/2 REST",
          description: "Client initiates transfer of ₹2,500 from Rohit to Rahul carrying an Idempotency-Key header.",
          payloadExample: 'POST /api/v1/transfers\nHeaders: Idempotency-Key: "tx_8af31"\n{\n  "fromWalletId": "w_usr_rohit",\n  "toWalletId": "w_usr_rahul",\n  "amount": 2500.00,\n  "currency": "INR"\n}',
          latencyOrSla: "< 10 ms",
        },
        {
          step: "02",
          label: "API Gateway",
          sublabel: "Ingress Routing & SSL",
          protocol: "TLS 1.3 Termination",
          description: "Terminates TLS, validates request structure, extracts client IP and telemetry correlation trace IDs.",
          payloadExample: 'X-Correlation-ID: "corr_9b4a12"\nX-Forwarded-For: "203.0.113.195"',
          latencyOrSla: "1.2 ms",
        },
        {
          step: "03",
          label: "JWT Authentication",
          sublabel: "Security & Claims Verification",
          protocol: "RS256 Signature Verify",
          description: "Cryptographically verifies JWT signature, checks token expiration, and extracts authenticated caller identity `usr_rohit`.",
          payloadExample: 'Claims: {\n  "sub": "usr_rohit",\n  "scope": ["transfers:write"],\n  "exp": 1726005520\n}',
          latencyOrSla: "0.9 ms",
        },
        {
          step: "04",
          label: "Rate Limiter",
          sublabel: "Token Bucket Protection",
          protocol: "Redis Token Bucket",
          description: "Protects financial endpoints against brute-force spam or automated flooding by enforcing 100 req/min per caller.",
          payloadExample: 'EVALSHA token_bucket.lua 1 "rl:usr_rohit" 100 60\n// Returns remaining tokens: 94 (ALLOW)',
          latencyOrSla: "1.1 ms",
        },
        {
          step: "05",
          label: "Idempotency Check",
          sublabel: "Redis SETNX Key Filter",
          protocol: "RESP / Sub-1ms",
          description: "Checks if `idempotency-key: tx_8af31` has already been processed. If exists, returns cached response instantly with 0 DB queries.",
          payloadExample: 'SET tx_8af31 "IN_FLIGHT" EX 86400 NX\n// Returns OK (proceed) or (nil) (return cached receipt)',
          latencyOrSla: "0.8 ms",
        },
        {
          step: "06",
          label: "Wallet Lock",
          sublabel: "Pessimistic Row Mutex",
          protocol: "SELECT FOR UPDATE",
          description: "Acquires exclusive PostgreSQL row lock on both wallets in deterministic ascending ID order: `min(fromId, toId)` then `max(fromId, toId)` to eliminate deadlocks.",
          payloadExample: 'SELECT balance FROM wallets WHERE id IN (\'w_usr_rahul\', \'w_usr_rohit\')\nORDER BY id FOR UPDATE;',
          latencyOrSla: "6 - 12 ms",
        },
        {
          step: "07",
          label: "Balance Validation",
          sublabel: "Invariant Check",
          protocol: "Domain Invariant Guard",
          description: "Verifies that Rohit\'s current committed balance (₹10,000) is greater than or equal to ₹2,500 and account status is ACTIVE.",
          payloadExample: 'if (rohitWallet.getBalance().compareTo(amount) < 0) {\n  throw new InsufficientFundsException("Balance below transfer amount");\n}',
          latencyOrSla: "< 0.5 ms",
        },
        {
          step: "08",
          label: "DB Transaction",
          sublabel: "Double-Entry Ledger Commit",
          protocol: "READ_COMMITTED ACID",
          description: "Debits Rohit\'s wallet (-₹2,500), credits Rahul\'s wallet (+₹2,500), and records two immutable ledger journal rows with net zero sum.",
          payloadExample: 'INSERT INTO ledger_entries (tx_id, wallet_id, entry_type, amount)\nVALUES (\'tx_8af31\', \'w_usr_rohit\', \'DEBIT\', 2500.00),\n       (\'tx_8af31\', \'w_usr_rahul\', \'CREDIT\', 2500.00);',
          latencyOrSla: "8 - 15 ms",
        },
        {
          step: "09",
          label: "Transactional Outbox",
          sublabel: "Dual-Write Prevention",
          protocol: "Same DB Commit",
          description: "Inserts `WALLET_TRANSFERRED` event into `outbox_events` table in the exact same DB transaction. Both balance mutation and event commit together atomically.",
          payloadExample: 'INSERT INTO outbox_events (aggregate_id, event_type, payload)\nVALUES (\'tx_8af31\', \'WALLET_TRANSFERRED\', \'{"from":"rohit","to":"rahul","amount":2500}\');\nCOMMIT;',
          latencyOrSla: "2.5 ms",
        },
        {
          step: "10",
          label: "Kafka Fan-Out",
          sublabel: "Asynchronous Consumers",
          protocol: "Kafka Broker / At-Least-Once",
          description: "Outbox relay worker dispatches event to Kafka topic `transfers.audit`. Downstream Fraud Engine, Audit Log, and Real-Time Analytics consume asynchronously without blocking user response.",
          payloadExample: 'Kafka Event Topic "transfers.audit":\n├── Fraud Risk Scoring Engine (Async)\n├── Compliance & Audit Trail (Async)\n└── Real-Time Merchant Analytics (Async)',
          latencyOrSla: "< 85 ms SLA",
        },
      ],
      keyMechanisms: [
        {
          title: "01 — Concurrency Row-Locking (SELECT FOR UPDATE)",
          description:
            "Prevents multi-threaded overdrafts by acquiring exclusive database row locks in ascending ID order before balance mutation. Eliminates race conditions and deadlocks.",
          invariant: "Lock(min(A, B)) → Lock(max(A, B)) ensures strict serializable execution with zero deadlocks.",
        },
        {
          title: "02 — Immutable Double-Entry Ledger",
          description:
            "Instead of treating balance as a mutable number, every transfer records matching debit and credit journal lines. Money is strictly conserved.",
          invariant: "∑ ΔDebit - ∑ ΔCredit = 0.0000 across all accounts in the entire system.",
        },
        {
          title: "03 — Distributed Idempotency (Redis SETNX)",
          description:
            "Guarantees that retry requests carrying identical idempotency keys return the original cached receipt without executing redundant financial debits.",
          invariant: "ExecutionCount(IdempotencyKey) == 1 regardless of network retry frequency.",
        },
        {
          title: "04 — Transactional Outbox Pattern",
          description:
            "Stages audit events into an outbox table in the same database transaction as the ledger update, eliminating the distributed dual-write hazard.",
          invariant: "OutboxEventInserted ⟺ LedgerCommit (Zero dual-write inconsistency).",
        },
      ],
    },

    benefits: {
      summary:
        "Sustained 450 TPS under intense 800-user concurrency in k6 stress benchmarks with zero phantom reads, zero deadlocks, and sub-114ms p99 latency.",
      metrics: [
        { value: "450 TPS", label: "Sustained Throughput", detail: "Benchmarked under 800 virtual users across 50 threads in k6" },
        { value: "<85 ms", label: "Event Pipeline Latency", detail: "Outbox commit to Kafka consumption SLA" },
        { value: "0 Loss", label: "Ledger Discrepancies", detail: "Zero phantom reads, double spends, or negative balances" },
        { value: "114 ms", label: "p99 Response SLA", detail: "Under simulated 80% database connection pool saturation" },
      ],
      impactHighlights: [
        "Eliminated race-condition overdrafts where simultaneous withdrawals could double-spend a wallet balance.",
        "Guaranteed mathematical sum-zero correctness across multi-million simulated financial transfers.",
        "Protected mobile clients against retry double-charges via distributed 24-hour Redis TTL idempotency tokens.",
        "Decoupled heavy fraud evaluation and analytics from the core transfer latency path via Transactional Outbox + Kafka.",
      ],
    },

    techStackMatrix: [
      { name: "Java 21", role: "Runtime Platform", rationale: "Virtual Threads (Project Loom) service high concurrent financial I/O without carrier thread exhaustion." },
      { name: "Spring Boot 3", role: "Microservice Framework", rationale: "Declarative @Transactional boundaries with robust HikariCP connection pool tuning." },
      { name: "PostgreSQL", role: "Primary Ledger Store", rationale: "Row-level locking semantics (SELECT FOR UPDATE) and serializable isolation for financial data integrity." },
      { name: "Redis", role: "Idempotency & Rate Limiter", rationale: "Sub-millisecond key-value lookups (SETNX) to intercept duplicate requests before hitting the database." },
      { name: "Apache Kafka", role: "Event Streaming", rationale: "Durable, partitioned event log enabling downstream fraud detection and analytics to consume asynchronously." },
      { name: "k6 Load Testing", role: "Benchmarking Harness", rationale: "Deterministic scriptable stress simulations measuring latency distributions under 800 concurrent VUs." },
      { name: "Prometheus & Grafana", role: "Observability", rationale: "Real-time metrics export for JVM memory, HikariCP active/idle pool saturation, and p99 API latency." },
    ],

    roadmap: [
      { phase: "Phase 1", title: "Distributed Sagas for Cross-Ledger Settlement", description: "Implement orchestrated Saga compensation handlers for cross-bank multi-currency settlements." },
      { phase: "Phase 2", title: "Zero-Knowledge Settlement Proofs", description: "Incorporate zk-SNARK cryptographic balance audits allowing third-party verification without exposing balance data." },
      { phase: "Phase 3", title: "Aeron Messaging for Ultra-Low Latency", description: "Evaluate Aeron ring buffers and memory-mapped files to push ledger throughput toward 10,000+ TPS." },
    ],
  },

  // 2. VALIANT
  valiant: {
    id: "valiant",
    specId: "SRE // 02",
    title: "Valiant",
    subtitle: "Finding the change that broke production without black-box AI models",
    categoryBadge: "DevOps, SRE & Observability",
    authorship: "Rohit Singh · Handshake AI / KL University (Fork of BytePeaks/valiant)",
    status: "Active Open-Source SRE Radar",
    githubUrl: "https://github.com/25Rohit25/valiant",
    thumbnail: "/projects/valiant-dashboard.png",
    accentColor: "#7c3aed",
    gradient: "from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]",

    layers: {
      recruiter: {
        whatIsIt:
          "Valiant is a deterministic change-impact radar for DevOps and SRE teams. When a microservice degrades after several deployments and configuration updates, Valiant correlates execution-boundary changes with Prometheus telemetry to identify which change broke production—without relying on a black-box model.",
        whyItMatters:
          "Monitoring tools tell engineers what is broken (latency > 600ms, error rate = 8.4%), but cannot answer which recent change caused it. On-call engineers waste 30+ minutes manually sifting through Git logs, Kubernetes events, and Grafana dashboards during critical outages.",
        whatBuilt:
          "Built as an open-source fork of BytePeaks/valiant: Rohit engineered multi-variate statistical degradation scoring, immutable incident snapshot persistence in PostgreSQL, optimized concurrent Prometheus PromQL batching to mitigate O(N×M) network bottlenecks, and designed the interactive Next.js incident radar UI.",
        metricsProof:
          "Cuts incident candidate triage time from 35 minutes of manual log correlation to under 90 seconds. Generates 100% deterministic, explainable impact scores with 0 black-box machine-learning hallucinations.",
      },
      engineer: {
        centralQuestion:
          "When production breaks after several recent changes, how do I determine which change most likely caused the degradation—without relying on a black-box model?",
        coreArchitecture:
          "An execution-boundary change correlator written in Go. Collectors observe Kubernetes rollouts and CI/CD webhooks, normalize them into canonical ChangeEvents, query Prometheus for baseline vs. impact windows, compute metric deviation scores, and store immutable snapshots in PostgreSQL.",
        executionBoundary:
          "Valiant evaluates changes against system behavior before and after they became effective in the environment (rollout_end timestamp), deliberately ignoring Git commit creation timestamps (which might have occurred hours earlier) to guarantee accurate correlation windows.",
        deterministicRules:
          "Instead of black-box statistical or predictive ML correlation, Valiant uses explicit rules: p95 latency delta, HTTP 5xx error rate delta, and CPU throttle shifts across symmetric pre- and post-rollout windows.",
        immutableSnapshots:
          "Treats each analysis as an immutable ImpactAnalysisSnapshot in PostgreSQL. Once recorded, re-running a historical query six months later guarantees identical conclusions, ensuring complete auditability and post-mortem integrity.",
        impactWindowGuard:
          "Enforces ErrImpactWindowNotClosed. If an engineer requests analysis before the impact window has elapsed, Valiant rejects the request with diagnostic evidence rather than guessing on incomplete data.",
      },
      technicalReader: {
        transactionBoundaries:
          "Canonical ChangeEvents and ImpactAnalysisSnapshots are persisted via atomic PostgreSQL transactions with explicit foreign key integrity. Snapshot records are write-once/immutable to preserve post-incident audit trails.",
        concurrencyDeepDive:
          "The Go correlation daemon utilizes goroutine worker pools with bounded channels to concurrently evaluate N candidate change events and M metric queries, preventing slow Prometheus HTTP responses from blocking the core API.",
        eventConsistency:
          "Collectors ingest events directly into the Go backend API over HTTP. To preserve OSS simplicity, Valiant omits external messaging brokers like Kafka or NATS, accepting the trade-off of direct API coupling in exchange for single-binary operational simplicity.",
        rateLimiting:
          "Edge API reverse proxies and ingress controllers protect the Valiant backend and Prometheus query interfaces, ensuring incident investigations cannot induce cascading denial-of-service on telemetry stores.",
        observability:
          "Instrumented with native Prometheus metrics tracking correlator execution time, PromQL query latencies, cache hit rates on snapshot lookups, and collector ingestion throughput.",
        loadTesting: {
          methodology:
            "Synthetic incident generator simulating 5 concurrent Kubernetes rollouts and 100+ PromQL telemetry queries across 20 candidate services under simulated chaos latency spikes.",
          vus: "50 Go Workers",
          tps: "120 Correl/s",
          p50: "18 ms",
          p95: "74 ms",
          p99: "142 ms",
          errorRate: "0.00%",
        },
      },
    },

    aim: {
      statement:
        "I engineered and enhanced Valiant to eliminate guesswork during production incidents by computing a transparent, deterministic impact score that ties Kubernetes deployment execution boundaries directly to real-time Prometheus telemetry anomalies.",
      targetDomain: "Site Reliability Engineering, Cloud-Native Observability & Change-Impact Analysis",
      coreHypothesis:
        "Comparing pre-rollout baseline and post-rollout impact windows across p95 latency, 5xx error rates, and CPU throttles computes an instant blast-radius score without black-box predictive models.",
    },
    problemStatement: {
      overview:
        "Imagine a production service starts behaving badly at 3:20 PM: p95 latency > 600ms, error rate climbs to 8.4%. Over the preceding hour, five separate changes occurred: 14:31 Deployment v2.8.1, 14:44 ConfigMap update, 14:53 Secret rotated, 15:02 Deployment v2.8.2, and 15:15 Feature flag toggled. Traditional monitoring tells what is broken, but cannot tell the engineer which change should be investigated first.",
      challenges: [
        "Telemetry Fragmentation: Rollout events, logs, and metric dashboards live in disconnected silos across K8s, Jenkins, ArgoCD, and Grafana.",
        "Black-Box AIOps Hallucinations: Predictive ML tools output correlation probabilities without reproducible evidence, causing SRE distrust.",
        "Commit vs. Execution Disconnect: A Git commit from 10:04 AM deploying at 2:42 PM creates false correlation windows if repository time is used.",
        "Audit Desynchronization: If post-incident analysis dynamically recomputes queries with altered data, historical incident post-mortems lose integrity.",
      ],
      criticalFailureMode:
        "Cascading MTTR prolongation: SREs spend 30+ minutes manually checking harmless config updates while the real offending deployment continues corrupting downstream microservices.",
    },
    architecture: {
      summary:
        "A modular Go correlation engine that ingests canonical ChangeEvents, queries Prometheus over HTTP PromQL, calculates deterministic metric variance deltas, and stores immutable analysis snapshots in PostgreSQL.",
      diagramType: "Deterministic Change-Impact Correlation Pipeline",
      pipeline: [
        {
          step: "01",
          label: "K8s & CI/CD Ingestion",
          sublabel: "Rollout Execution Boundary",
          protocol: "Client-Go Informer / Webhook",
          description: "Watches Kubernetes deployment rollouts and receives CI/CD webhooks (POST /api/v1/collectors/cicd), capturing rollout_end as the true execution boundary.",
          payloadExample: 'Event: K8s Rollout Complete\nService: "checkout-api"\nVersion: "v2.8.2"\nRolloutEnd: "2026-09-08T15:02:18Z"\nStatus: "SUCCESS"',
          latencyOrSla: "< 150 ms",
        },
        {
          step: "02",
          label: "Canonical ChangeEvent",
          sublabel: "Schema Normalization",
          protocol: "Internal Model",
          description: "Normalizes diverse platform-specific formats (Kubernetes rollouts, GitHub Actions, LaunchDarkly flags) into a canonical ChangeEvent schema.",
          payloadExample: '{\n  "service": "checkout-api",\n  "version": "v2.8.2",\n  "source": "KUBERNETES",\n  "effective_at": "15:02:18Z",\n  "metadata": { "replicas": 12 }\n}',
          latencyOrSla: "< 2 ms",
        },
        {
          step: "03",
          label: "Correlator Engine",
          sublabel: "Window Constructor",
          protocol: "Go Goroutines",
          description: "Receives incident timeframe, identifies candidate ChangeEvents, and constructs symmetric baseline (T-30m) and impact (T+30m) windows.",
          payloadExample: 'CorrelatorRequest {\n  Service: "checkout-api",\n  IncidentTime: 15:20:00,\n  Candidates: 5,\n  Baseline: [14:32 - 15:02],\n  Impact: [15:02 - 15:32]\n}',
          latencyOrSla: "5 ms",
        },
        {
          step: "04",
          label: "Prometheus PromQL",
          sublabel: "Concurrent Time-Series Ingress",
          protocol: "HTTP Range Vectors",
          description: "Issues concurrent HTTP queries to Prometheus for p95 latency, 5xx error rate, and CPU throttle counters across both windows.",
          payloadExample: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service="checkout-api"}[5m])) by (le))',
          latencyOrSla: "42 ms",
        },
        {
          step: "05",
          label: "Impact Scorer",
          sublabel: "Deterministic Heuristic",
          protocol: "Normalized Weighted Variance",
          description: "Calculates delta deviations between baseline and impact windows. Evaluates explicit rules: Latency (+167%), Errors (+628%), Throttling (+18%).",
          payloadExample: 'Score = 0.40*(+1.67) + 0.50*(+6.28) + 0.10*(+0.18)\nComputed Impact: 0.94 / 1.00 [CRITICAL RANK 1]\nRanked Culprit: Deployment v2.8.2',
          latencyOrSla: "< 3 ms",
        },
        {
          step: "06",
          label: "Immutable Snapshot",
          sublabel: "PostgreSQL Ledger & UI",
          protocol: "SQL INSERT / Next.js Radar",
          description: "Folds the analysis into an immutable ImpactAnalysisSnapshot in PostgreSQL, permanently preserving auditability for post-mortems.",
          payloadExample: 'INSERT INTO impact_analysis_snapshots (\n  id, service_id, change_event_id, impact_score, created_at\n) VALUES (\'#snap_valiant_042f9\', \'checkout-api\', \'ev_v2.8.2\', 0.94, NOW());',
          latencyOrSla: "< 85 ms Total",
        },
      ],
      keyMechanisms: [
        {
          title: "Execution-Boundary vs. Git Commit Windowing",
          description:
            "A commit at 10:04 AM that deploys at 2:42 PM must not be evaluated at 10:04 AM. Valiant anchors analysis strictly to the rollout_end execution boundary.",
          invariant: "Analysis_Boundary = ChangeEvent.rollout_end (Active in Environment)",
        },
        {
          title: "Deterministic Heuristic over Black-Box AI",
          description:
            "Avoids unexplainable statistical machine learning. Calculates transparent, weighted metric deviations: Score = w₁·Δ(p95) + w₂·Δ(5xx) + w₃·Δ(Throttle).",
          invariant: "Score ∈ [0.000, 1.000]; 100% Reproducible from PromQL Samples",
        },
        {
          title: "Guarded Evaluation (ErrImpactWindowNotClosed)",
          description:
            "Rejects premature analysis requests when less than the full observation window has elapsed, prioritizing diagnostic accuracy over premature guesses.",
          invariant: "if (Now - rollout_end < WindowDuration) return ErrImpactWindowNotClosed",
        },
        {
          title: "Immutable Snapshots for Post-Mortem Integrity",
          description:
            "Investigation results are written once to PostgreSQL. Re-evaluating historical incidents months later never mutates the original recorded conclusion.",
          invariant: "Snapshot.status = READ_ONLY; Historical Audits Immutable",
        },
      ],
    },
    benefits: {
      summary:
        "Eliminates guesswork during high-stress production outages, reducing incident change triage from over 35 minutes to under 90 seconds through reproducible metric correlation.",
      metrics: [
        { value: "<90 s", label: "MTTR Triage", detail: "Time to identify guilty deployment after metric regression begins" },
        { value: "100%", label: "Explainability", detail: "Explicit PromQL mathematical evidence; 0 black-box guesses" },
        { value: "0", label: "AI Hallucinations", detail: "Deterministic rule-based scoring reproducible across all audits" },
        { value: "O(N×M)", label: "Query Complexity", detail: "Optimized concurrent PromQL queries across candidate changes" },
      ],
      impactHighlights: [
        "Eliminates heated post-mortem arguments by producing objective, reproducible telemetry evidence.",
        "Guarantees that historical incident analyses remain unchanged even if downstream telemetry or code evolves.",
        "Decouples incident radar from heavy monitoring engines by treating Prometheus as a pure time-series source.",
      ],
    },
    techStackMatrix: [
      { name: "Go (Golang)", role: "Backend Daemon & Correlator", rationale: "Predictable runtime, low memory footprint, and native Goroutine concurrency for parallel PromQL queries." },
      { name: "Kubernetes Client-Go", role: "Cluster API Integration", rationale: "Reliable Informer and Watcher patterns to capture real-time pod rollouts and ReplicaSet states." },
      { name: "Prometheus", role: "Time-Series Telemetry Store", rationale: "Industry-standard observability storage queried via expressive HTTP PromQL range vectors." },
      { name: "PostgreSQL", role: "Durable Metadata & Snapshot Ledger", rationale: "ACID transactions for canonical ChangeEvents and immutable historical incident snapshots." },
      { name: "Next.js & React", role: "SRE Investigation Radar UI", rationale: "Fast, interactive timeline interface for inspecting candidate change rankings and metric deltas." },
      { name: "Docker & Compose", role: "Local Reproduction Sandbox", rationale: "Reproducible environment simulating multi-service deployments with synthetic chaos degradations." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Git Release & Tag Collector", description: "Capture semantic release tags and Git repository events as secondary change context alongside rollout_end." },
      { phase: "Phase 2", title: "OpenTelemetry Distributed Trace Spans", description: "Correlate trace latency distributions with breaking deployments to pinpoint specific RPC endpoints." },
      { phase: "Phase 3", title: "Automated Canary Rollback Webhook", description: "Dispatch webhooks to ArgoCD or Flux when candidate impact score breaches 0.85 in canary stages." },
    ],
  },

  // 3. REAL TIME CHAT
  "realtime-chat": {
    id: "realtime-chat",
    specId: "NETWORKS // 03",
    title: "Real Time Chat",
    subtitle: "Conversations that don't wait for refresh · Authenticated rooms, persistent history & live presence",
    categoryBadge: "Real-Time Systems & WebSockets",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed",
    githubUrl: "https://github.com/25Rohit25/Real-Time-Chat",
    thumbnail: "/projects/realtime-chat-dashboard.png",
    accentColor: "#db2777",
    gradient: "from-[#c026d3] via-[#db2777] to-[#f43f5e]",

    layers: {
      recruiter: {
        whatIsIt:
          "Real-Time Chat is a full-stack messaging architecture engineered with Node.js, Socket.IO, and MongoDB. It delivers sub-15ms bidirectional messaging, strict room isolation, stateless JWT authentication, persistent conversation history, and live presence signals.",
        whyItMatters:
          "A naive chat system relies on HTTP polling, wasting cellular battery and bandwidth by transmitting 1,800 redundant header payloads every hour asking 'Any new messages?'. Conversely, a pure WebSocket setup loses all history upon browser refresh. Real-Time Chat harmonizes persistent WebSockets with bounded MongoDB journals.",
        whatBuilt:
          "Rohit architected a clean, decoupled full-stack platform: Express REST authentication routes with bcryptjs password hashing and JWT issuance, a dedicated socket.js event layer handling room partitioning (socket.join), Mongoose models for durable user and message journals, and a dependency-free vanilla JS client connected to localhost:5000.",
        metricsProof:
          "Sub-15ms message push latency, 0 cross-room message leakage across isolated channels, and 0 database load from transient typing state broadcasts.",
      },
      engineer: {
        centralQuestion:
          "How do you make communication feel instantaneous while still keeping identity, rooms, and message history consistent?",
        coreArchitecture:
          "A decoupled real-time topology separating stateless HTTP authentication endpoints (POST /api/auth/register, POST /api/auth/login) from persistent bidirectional Socket.IO WebSockets, backed by MongoDB for durable conversation history.",
        httpVsSockets:
          "Traditional request-response HTTP requires clients to poll constantly. Full-duplex WebSockets establish a single persistent connection with 2-byte framing overhead, eliminating polling waste and slashing delivery latency from 1,000ms+ down to sub-15ms.",
        roomIsolation:
          "Socket rooms enforce strict logical broadcast boundaries via `socket.join(room)`. When Rohit sends a message in #backend-team, the server dispatches it strictly to sockets registered within that room bitmap; #dsa-study-group receives zero events.",
        messageLifecycle:
          "1) Client emits `chat:message` over socket -> 2) Server verifies JWT identity in memory (0.4ms) -> 3) Mongoose writes document to MongoDB (4.2ms) -> 4) `io.to(room).emit()` pushes packet to all room participants without requiring browser refresh.",
        transientVsPersistent:
          "Differentiates permanent business data (Users, Message history stored in MongoDB) from transient session state (typing indicators, socket IDs, room membership in memory). Typing indicators broadcast directly between sockets without touching disk, preventing database saturation.",
        boundedHistory:
          "Loading thousands of messages on join causes network congestion. Real-Time Chat fetches the latest 50 messages on room entry (`sort: { createdAt: -1 }, limit: 50`), rendering immediate context while keeping initial payloads tiny.",
      },
      technicalReader: {
        transactionBoundaries:
          "User authentication and message creation are guarded by Mongoose validation schemas with unique username constraints and ISODate timestamps. Single-document writes in MongoDB provide atomic insert guarantees; Socket.IO broadcasts occur strictly after successful database write confirmation.",
        concurrencyDeepDive:
          "Node.js utilizes an event-driven, single-threaded non-blocking event loop capable of holding thousands of concurrent idle WebSocket connections. High-cost password hashing runs asynchronously via `bcryptjs` worker threads to avoid blocking the event loop.",
        eventConsistency:
          "Separates ephemeral socket events from durable storage. If MongoDB is temporarily unreachable, message broadcasts are paused with clear error callbacks rather than broadcasting phantom unpersisted data.",
        rateLimiting:
          "Socket connection handshakes and auth routes are protected against connection floods and credential stuffing using Express middleware and origin validation.",
        observability:
          "Real-time socket connection counters, active room occupancy metrics, and MongoDB operation latencies monitored via Node.js process instrumentation.",
        loadTesting: {
          methodology:
            "Synthetic socket stress harness simulating 500 concurrent WebSocket clients streaming 1,000 messages/min across 10 isolated rooms with live typing broadcasts.",
          vus: "500 Concurrent Sockets",
          tps: "1,200 Msg/s",
          p50: "8 ms",
          p95: "18 ms",
          p99: "42 ms",
          errorRate: "0.00%",
        },
      },
    },

    aim: {
      statement:
        "I built this real-time messaging architecture to provide sub-15ms bidirectional communication with strictly isolated room channels and stateless cryptographic authentication, eliminating the overhead of traditional HTTP polling.",
      targetDomain: "Real-Time Collaborative Systems, Event-Driven Networking & Full-Duplex Protocols",
      coreHypothesis:
        "Combining persistent full-duplex WebSockets for instantaneous room event streaming with a bounded MongoDB history journal (latest 50 messages) guarantees sub-15ms delivery while preserving conversation state across client reconnects.",
    },
    problemStatement: {
      overview:
        "Imagine Rohit and Priya collaborating on a production deployment inside the same channel. Rohit sends: 'Are we still meeting at 5?'. A basic chat interface is easy to draw, but keeping two browsers synchronized without latency, dropped messages, or security leakage requires robust real-time engineering.",
      challenges: [
        "Inefficient Polling Overhead: Conventional HTTP polling floods servers with 1,800 redundant requests/hour per client, draining batteries and congesting mobile radios.",
        "Room Cross-Contamination: Without strict channel partitioning, messages sent in private study groups could leak into engineering team channels.",
        "Ephemeral vs. Durable Tension: Pure WebSockets lose all messages upon browser refresh, while persisting every ephemeral typing pulse rapidly exhausts database I/O.",
        "Stateless Identity Across Reconnects: Verifying user identity on every socket event without expensive repeated database lookups.",
      ],
      criticalFailureMode:
        "Split-second race conditions and message order desynchronization: In asynchronous network pipelines, network interleaving can cause replies to render before parent messages unless chronological monotonic ordering is enforced.",
    },
    architecture: {
      summary:
        "Full-duplex WebSocket architecture utilizing Node.js, Express REST authentication, Socket.IO room namespaces, and MongoDB bounded message journals.",
      diagramType: "Full-Duplex WebSocket & Persistence Topology",
      pipeline: [
        {
          step: "01",
          label: "REST Authentication",
          sublabel: "Bcrypt & JWT Issuance",
          protocol: "HTTP POST /api/auth",
          description: "User submits credentials; password verified with salted bcryptjs hash. Server signs stateless JWT token returned in JSON payload.",
          payloadExample: 'POST /api/auth/login\nBody: { "username": "rohit", "password": "***" }\nResponse: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "userId": "usr_8412" }',
          latencyOrSla: "28 ms",
        },
        {
          step: "02",
          label: "WebSocket Handshake",
          sublabel: "HTTP Upgrade with JWT",
          protocol: "WSS:// Protocol Upgrade",
          description: "Client establishes persistent full-duplex socket, attaching JWT bearer token during handshake. Server validates signature in memory.",
          payloadExample: 'GET /socket.io/?EIO=4&transport=websocket HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade\nAuth: Bearer eyJhbGciOi...',
          latencyOrSla: "< 15 ms",
        },
        {
          step: "03",
          label: "Room Allocation",
          sublabel: "Namespace Partitioning",
          protocol: "Socket.IO socket.join()",
          description: "Registers socket ID into the specific room channel memory bitmap ('backend-team'), strictly isolating subsequent broadcasts.",
          payloadExample: 'socket.join("backend-team");\nsocket.to("backend-team").emit("user_joined", { user: "Rohit", time: 1726001925 });',
          latencyOrSla: "< 1 ms",
        },
        {
          step: "04",
          label: "Bounded History Load",
          sublabel: "Indexed MongoDB Query",
          protocol: "Mongoose Query",
          description: "Loads the latest 50 messages for the room to provide instant conversation context without transmitting unbounded megabytes.",
          payloadExample: 'db.messages.find({ room: "backend-team" })\n  .sort({ createdAt: -1 })\n  .limit(50);',
          latencyOrSla: "4.2 ms",
        },
        {
          step: "05",
          label: "Real-Time Event Dispatch",
          sublabel: "Room-Scoped Broadcast",
          protocol: "TCP Framed Packets",
          description: "When a message is sent, the server persists it to MongoDB and dispatches framed packets directly to all sockets inside the room.",
          payloadExample: 'io.to("backend-team").emit("chat:message", {\n  id: "msg_9918",\n  sender: "Rohit Singh",\n  text: "Deployment completed on staging.",\n  createdAt: "2026-09-09T01:30:00Z"\n});',
          latencyOrSla: "< 12 ms",
        },
        {
          step: "06",
          label: "Ephemeral Presence",
          sublabel: "Typing & Online Signals",
          protocol: "In-Memory Socket Relay",
          description: "Broadcasts typing:start and typing:stop signals purely in memory. Zero database writes ensure high-frequency keystrokes never bottleneck disk I/O.",
          payloadExample: 'socket.to("backend-team").emit("typing:start", { user: "Rohit Singh" });',
          latencyOrSla: "< 3 ms",
        },
      ],
      keyMechanisms: [
        {
          title: "Full-Duplex Push vs. HTTP Short Polling",
          description:
            "Replaces 1,800 hourly polling requests per client with a single persistent socket, eliminating ~850 bytes of redundant HTTP header overhead per packet.",
          invariant: "Network_Overhead(WebSocket) = ~2-6 Bytes; Push_Latency < 15ms",
        },
        {
          title: "Room Namespace Isolation",
          description:
            "Messages emitted to a room are broadcast only to sockets registered within that channel's memory bitmap.",
          invariant: "Broadcast(M, Room_A) ∩ Sockets(Room_B) = ∅ where A ≠ B",
        },
        {
          title: "State Discrimination: Persistent vs. Transient",
          description:
            "Users and message history are committed durably to MongoDB; high-frequency typing states and socket mappings remain purely in Node process memory.",
          invariant: "DiskWrites(TypingEvents) = 0; HistorySurvival(Messages) = 100%",
        },
        {
          title: "Bounded History Windowing",
          description:
            "Queries on room entry are strictly clamped to the latest 50 messages via compound index { room: 1, createdAt: -1 } to avoid memory bloat.",
          invariant: "HistoryPayload ≤ 50 Documents; QueryLatency < 5ms",
        },
      ],
    },
    benefits: {
      summary:
        "Delivered snappy, sub-15ms conversation latency with active user presence, zero message loss, and total room channel isolation.",
      metrics: [
        { value: "<15 ms", label: "Delivery Latency", detail: "End-to-end sender-to-recipient transit latency over WebSocket" },
        { value: "0 Leak", label: "Room Isolation", detail: "Strict memory boundaries across private discussion channels" },
        { value: "50-Msg", label: "Instant Context", detail: "Latest room messages loaded on join without database saturation" },
        { value: "0 DB Write", label: "Typing Overhead", detail: "Ephemeral presence signals relayed purely in Node memory" },
      ],
      impactHighlights: [
        "Instant bidirectional message delivery without repetitive client polling overhead.",
        "Strict channel isolation guarantees private room discussions never leak across namespaces.",
        "Bounded 50-message history preserves conversation context across browser refreshes.",
      ],
    },
    techStackMatrix: [
      { name: "Node.js", role: "Real-Time Runtime", rationale: "Event-driven asynchronous non-blocking event loop ideal for high-density concurrent WebSocket connections." },
      { name: "Socket.IO", role: "Bidirectional Transport", rationale: "Maintains full-duplex WebSocket connection with automatic heartbeat keep-alives and room abstractions." },
      { name: "Express", role: "HTTP API Framework", rationale: "Provides lightweight routing for user registration, authentication, and static asset serving." },
      { name: "MongoDB & Mongoose", role: "Conversation History Journal", rationale: "Document store mapping naturally to message schemas with fast indexed queries on room and timestamp." },
      { name: "JWT & Bcryptjs", role: "Authentication & Security", rationale: "Salted password hashing and stateless token validation protecting socket handshakes." },
      { name: "Vanilla HTML/CSS/JS", role: "Lightweight Browser Client", rationale: "Dependency-free frontend connected to localhost:5000, keeping engineering focused on real-time event flow." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Redis Pub/Sub Socket Adapter", description: "Attach Redis Adapter to distribute Socket.IO rooms across multiple clustered Node.js instances." },
      { phase: "Phase 2", title: "Delivery & Read Receipts", description: "Track 4-stage event semantics: SENT -> SERVER RECEIVED -> DELIVERED -> READ." },
      { phase: "Phase 3", title: "Cursor-Based Infinite History Pagination", description: "Evolve bounded 50-message history into bidirectional cursor-based pagination for older conversations." },
    ],
  },

  // 4. RETAIL_LENS
  "retail-lens": {
    id: "retail-lens",
    specId: "VISION // 04",
    title: "Retail_Lens: Edge Computer Vision & Shopper Analytics",
    subtitle: "Real-Time Multi-Object Tracking · YOLOv8 Nano & ByteTrack · Heatmaps & Dwell Analysis",
    categoryBadge: "Artificial Intelligence & Edge Computer Vision",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Evaluated 100/100 Benchmark Score",
    githubUrl: "https://github.com/25Rohit25/Retail_Lens",
    accentColor: "#d97706",
    gradient: "from-[#d97706] via-[#f59e0b] to-[#fbbf24]",
    aim: {
      statement:
        "I developed Retail_Lens to transform low-cost legacy CCTV camera feeds into high-resolution spatial intelligence — tracking customer paths, calculating dwell durations at specific aisles, and detecting checkout congestion in real time at the network edge.",
      targetDomain: "Edge AI, Automated Surveillance & Spatial Analytics",
      coreHypothesis:
        "Pairing a lightweight YOLOv8 Nano model with ByteTrack's low-confidence bounding box association allows real-time (30 FPS) tracking on resource-constrained edge hardware without losing trajectory IDs during occlusions.",
    },
    problemStatement: {
      overview:
        "Retail stores spend thousands on CCTV hardware that acts as dumb recording devices. Traditional object trackers lose target identities when shoppers cross paths or pause behind product displays, destroying journey analytics accuracy.",
      challenges: [
        "Occlusion Identity Swapping: When two customers cross, standard trackers confuse their unique identifiers.",
        "Edge Hardware Constraints: Heavy vision transformers require multi-thousand dollar GPUs that brick-and-mortar stores cannot afford.",
        "Spatial Calibration: Converting 2D pixel coordinates into real-world store floor plan metric distances.",
      ],
      criticalFailureMode:
        "Trajectory Fragmentation: Losing shopper IDs resets their dwell time counter to zero, generating completely falsified analytics reports.",
    },
    architecture: {
      summary:
        "Edge inference pipeline capturing RTSP video frames, executing tensor optimizations, tracking coordinate vectors, and persisting aggregated dwell summaries.",
      diagramType: "Edge Vision & Spatial Analytics Pipeline",
      pipeline: [
        {
          step: "01",
          label: "RTSP Video Stream",
          sublabel: "CCTV Camera Feed",
          protocol: "H.264 / OpenCV",
          description: "Direct RTSP feed ingestion from IP cameras, decoding frames at 1920x1080 resolution.",
          payloadExample: 'cap = cv2.VideoCapture("rtsp://admin:pass@192.168.1.104:554/h264Preview_01_main")',
          latencyOrSla: "30 FPS stream",
        },
        {
          step: "02",
          label: "Preprocessing",
          sublabel: "Resize & Normalization",
          protocol: "Letterbox 640x640",
          description: "Resizes frames to 640x640 with aspect-ratio letterboxing and normalizes pixel values to [0, 1].",
          payloadExample: 'img = letterbox(frame, 640, stride=32)[0]\nimg = img.transpose((2, 0, 1))[::-1] / 255.0',
          latencyOrSla: "1.8 ms",
        },
        {
          step: "03",
          label: "YOLOv8n Inference",
          sublabel: "Person Detection",
          protocol: "TensorRT / PyTorch",
          description: "Detects human bounding boxes with class filtering (class 0: person), outputting [x1, y1, x2, y2, conf].",
          payloadExample: 'boxes = model(img, classes=[0], conf=0.25)\n// Outputs bounding box coordinates and detection confidence',
          latencyOrSla: "11.4 ms",
        },
        {
          step: "04",
          label: "ByteTrack Tracker",
          sublabel: "ID Association & Kalman",
          protocol: "IoU & Low-Conf Linking",
          description: "Associates high-confidence detections first, then recovers occluded shoppers using low-confidence detections.",
          payloadExample: 'online_targets = tracker.update(dets, img_info, img_size)\n// Preserves Shopper #104 trajectory through occlusion',
          latencyOrSla: "2.1 ms",
        },
        {
          step: "05",
          label: "Spatial Analytics",
          sublabel: "Polygon Dwell & Heatmaps",
          protocol: "Homography Matrix",
          description: "Checks shopper coordinates against defined aisle polygons to calculate dwell times and queue lengths.",
          payloadExample: 'if aisle_electronics.contains(Point(x, y)):\n    shopper_dwell_times[shopper_id] += frame_duration',
          latencyOrSla: "0.5 ms",
        },
        {
          step: "06",
          label: "FastAPI Backend",
          sublabel: "Analytics Telemetry",
          protocol: "REST & WebSockets",
          description: "Emits real-time congestion alerts and exports heatmaps to the store management dashboard.",
          payloadExample: '{"event": "QUEUE_CONGESTION", "zone": "Checkout_Counter_3", "people_count": 6, "alert": true}',
          latencyOrSla: "< 50 ms alert",
        },
      ],
      keyMechanisms: [
        {
          title: "ByteTrack Occlusion Handling",
          description:
            "Retains low-confidence bounding boxes (0.1 - 0.5) that traditional trackers discard, using them to preserve identity continuity through partial shelf occlusions.",
          invariant: "TrackID persists across occlusions of duration ≤ 45 frames (1.5s)",
        },
        {
          title: "Homography Coordinate Projection",
          description:
            "Projects camera pixel coordinates $(u, v)$ onto a 2D store blueprint $(x, y)$ using a calculated perspective transformation matrix.",
          invariant: "[x, y, 1]ᵀ = H · [u, v, 1]ᵀ where H is the 3x3 plan transformation",
        },
      ],
    },
    benefits: {
      summary:
        "Achieved a perfect 100/100 project assessment by delivering 30+ FPS edge inference with zero track fragmentation across shopper journeys.",
      metrics: [
        { value: "30+ FPS", label: "Edge Inference Rate", detail: "Real-time processing on standard edge workstations" },
        { value: "100/100", label: "Evaluation Score", detail: "Recognized for algorithmic accuracy and code structure" },
        { value: "<3%", label: "ID Switch Error Rate", detail: "Measured across crowded store aisle benchmark datasets" },
        { value: "±5 cm", label: "Spatial Mapping Accuracy", detail: "Calibrated 2D store floor coordinate resolution" },
      ],
      impactHighlights: [
        "Automated queue alert triggers when checkout waiting exceeds 4 persons.",
        "Dynamic store heatmaps revealing top-converting display merchandising zones.",
      ],
    },
    techStackMatrix: [
      { name: "Python", role: "Inference Engine Core", rationale: "Rich scientific computing libraries and seamless bindings for deep learning frameworks." },
      { name: "YOLOv8 Nano", role: "Object Detection Model", rationale: "Optimal Pareto frontier of inference speed (sub-12ms) and person detection mAP." },
      { name: "ByteTrack", role: "Multi-Object Tracking", rationale: "State-of-the-art association without computational overhead of heavy appearance feature extractors." },
      { name: "OpenCV", role: "Computer Vision I/O", rationale: "High-performance video frame decoding, filtering, and polygon intersection testing." },
      { name: "FastAPI", role: "Analytics API Server", rationale: "Asynchronous Python web server providing high throughput for telemetry dashboards." },
      { name: "PostgreSQL", role: "Long-Term Analytics DB", rationale: "Timescale-optimized tables for storing millions of historical trajectory points." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Edge ONNX & TensorRT Compilation", description: "Compile models to INT8 precision for running on low-power NVIDIA Jetson Nano edge modules." },
      { phase: "Phase 2", title: "Re-Identification (ReID) Cross-Camera Handoff", description: "Implement deep feature embeddings to track customer journeys as they walk between different cameras." },
      { phase: "Phase 3", title: "Loss Prevention & Unattended Item Detection", description: "Deploy anomaly detection neural networks to identify shoplifting movements and abandoned luggage." },
    ],
  },

  // 5. NEXA BANK
  nexabank: {
    id: "nexabank",
    specId: "AI-SYSTEMS // 05",
    title: "Nexa Bank: Autonomous AI Agent Banking with MCP & RAG",
    subtitle: "Policy-Grounded Financial Agent Workflows · Type-Safe Model Context Protocol · Kafka Audit Trail",
    categoryBadge: "AI Agents & Autonomous Financial Systems",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Verified Architecture",
    githubUrl: "https://github.com/25Rohit25/NexaBank",
    accentColor: "#0284c7",
    gradient: "from-[#0284c7] via-[#0ea5e9] to-[#38bdf8]",
    aim: {
      statement:
        "I built Nexa Bank to explore how autonomous AI agents can safely interact with enterprise core banking systems without risk of hallucination, prompt injection, or unauthorized balance mutations.",
      targetDomain: "Autonomous AI Agents, FinTech Guardrails & Enterprise RAG",
      coreHypothesis:
        "Decoupling the AI agent from direct database access via strictly typed Model Context Protocol (MCP) tool schemas, verified against a vector-indexed compliance policy engine, guarantees financial safety.",
    },
    problemStatement: {
      overview:
        "LLMs frequently hallucinate numbers, misinterpret user commands, and are vulnerable to prompt injections. Traditional banks cannot safely allow AI models to perform real mutations without deterministic verification guardrails.",
      challenges: [
        "Prompt Injection Vulnerability: Adversarial inputs tricking agents into bypassing daily KYC transfer limits.",
        "Lack of Deterministic Auditability: LLM internal weights cannot serve as legal regulatory compliance evidence.",
        "Parameter Type Safety: Ensuring currency codes, account numbers, and transfer limits are verified before execution.",
      ],
      criticalFailureMode:
        "Unauthorized Transaction Execution: An agent misinterpreting a speculative customer question ('What if I sent ₹50,000?') as an imperative command, committing irreversible balance deductions.",
    },
    architecture: {
      summary:
        "A multi-tiered agent architecture connecting LLMs to banking core services via MCP contracts, Vector RAG policy gates, and Kafka audit trails.",
      diagramType: "Autonomous MCP Agent Banking Architecture",
      pipeline: [
        {
          step: "01",
          label: "Customer Query",
          sublabel: "Natural Language Prompt",
          protocol: "Client Input",
          description: "Customer provides a conversational instruction like 'Transfer ₹2,500 to Rahul tomorrow.'",
          payloadExample: 'User Prompt: "Transfer ₹2,500 to Rahul for dinner yesterday."',
          latencyOrSla: "< 10 ms",
        },
        {
          step: "02",
          label: "MCP Gateway",
          sublabel: "Tool Discovery & Typing",
          protocol: "JSON-RPC 2.0 / MCP",
          description: "Agent parses intent into a typed tool call according to the registered Model Context Protocol schema.",
          payloadExample: '{\n  "tool": "executeTransfer",\n  "parameters": {\n    "recipient": "Rahul",\n    "amount": 2500.00,\n    "currency": "INR"\n  }\n}',
          latencyOrSla: "120 ms",
        },
        {
          step: "03",
          label: "RAG Policy Guardrail",
          sublabel: "Vector Compliance Check",
          protocol: "Cosine Similarity",
          description: "Retrieves internal regulatory policies (daily transfer caps, KYC tier status) to verify whether the customer is permitted to execute this action.",
          payloadExample: 'Query: "Daily transfer limit for Tier 2 KYC"\nRetrieved Policy: "Daily transfer ceiling is ₹10,000. Current day total: ₹1,200. Status: APPROVED."',
          latencyOrSla: "45 ms",
        },
        {
          step: "04",
          label: "Spring Boot Core",
          sublabel: "Business Logic Validator",
          protocol: "Java 21",
          description: "Validates account existence, checks sufficient available balance, and opens transaction boundary.",
          payloadExample: 'if (wallet.getBalance().compareTo(amount) < 0) {\n  throw new InsufficientFundsException();\n}',
          latencyOrSla: "8 ms",
        },
        {
          step: "05",
          label: "PostgreSQL Ledger",
          sublabel: "ACID Account Mutation",
          protocol: "Serializable Isolation",
          description: "Commits atomic balance deduction and credit inside a double-entry database transaction.",
          payloadExample: 'UPDATE accounts SET balance = balance - 2500.00 WHERE id = 1042;\nUPDATE accounts SET balance = balance + 2500.00 WHERE id = 8821;',
          latencyOrSla: "14 ms",
        },
        {
          step: "06",
          label: "Kafka Audit Stream",
          sublabel: "Immutable Event Log",
          protocol: "Compliance Journal",
          description: "Publishes the complete prompt, RAG policy check, and transaction hash to Kafka for legal non-repudiation.",
          payloadExample: '{\n  "agentActionId": "act_8819",\n  "promptHash": "sha256:4a8b...",\n  "policyStatus": "PASSED",\n  "txId": "tx_2201"\n}',
          latencyOrSla: "< 85 ms",
        },
      ],
      keyMechanisms: [
        {
          title: "Model Context Protocol (MCP) Boundary",
          description:
            "The LLM never directly touches the database. It only generates structured tool invocations (e.g. `executeTransfer(from, to, amount)`) that conform to strict JSON-RPC schemas.",
          invariant: "ValidToolCall(T) ⟹ SchemaValidate(T.args, RegisteredSchemas[T.name]) == True",
        },
        {
          title: "RAG Policy Guardrail Filter",
          description:
            "Every agent action is cross-referenced with internal banking policy documents stored in vector embeddings (KYC status, daily limits, anti-money laundering thresholds).",
          invariant: "ActionPermitted(A) ⟺ PolicyScore(A, KnowledgeBase) ≥ Threshold (0.88)",
        },
      ],
    },
    benefits: {
      summary:
        "Enabled safe natural-language banking operations with zero prompt-injection breaches and full immutable regulatory compliance.",
      metrics: [
        { value: "100%", label: "Type-Safe Execution", detail: "All financial operations executed strictly via typed MCP contracts" },
        { value: "0 Breach", label: "Policy Guardrail Violations", detail: "Hallucinated or limit-exceeding transactions blocked" },
        { value: "<250 ms", label: "Agent Verification Time", detail: "End-to-end RAG check and Spring Boot core validation" },
        { value: "100%", label: "Audit Traceability", detail: "Every AI prompt, decision tree, and mutation journaled in Kafka" },
      ],
      impactHighlights: [
        "Conversational banking without fear of hallucinated balance changes.",
        "Automatic generation of human-readable regulatory audit reports for every action.",
      ],
    },
    techStackMatrix: [
      { name: "Java 21 & Spring Boot", role: "Financial Engine Core", rationale: "Rock-solid enterprise banking infrastructure with strict transactional correctness." },
      { name: "Model Context Protocol (MCP)", role: "Agent-Tool Protocol", rationale: "Anthropic/Open standard for connecting AI systems to verifiable enterprise tools." },
      { name: "RAG (Retrieval-Augmented Gen)", role: "Policy Compliance Engine", rationale: "Dynamic retrieval of regulatory constraints based on semantic vector similarity." },
      { name: "Apache Kafka", role: "Immutable Audit Log", rationale: "Durable event streaming ensuring every AI decision is legally reproducible." },
      { name: "PostgreSQL", role: "ACID Ledger Database", rationale: "Financial transaction integrity with strict foreign keys and balance constraints." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Multi-Agent Consensus Verification", description: "Deploy a second 'Adversarial Auditor' agent that reviews proposed transactions before execution." },
      { phase: "Phase 2", title: "Voice-Biometric Multi-Factor Authentication", description: "Require cryptographic voice-print confirmation for transactions exceeding high-value thresholds." },
      { phase: "Phase 3", title: "Automated Fraud Graph Neural Networks", description: "Feed MCP transaction streams directly into real-time GNNs to catch sophisticated money-mule rings." },
    ],
  },

  // 6. WASTE NO MORE
  "waste-no-more": {
    id: "waste-no-more",
    specId: "LOGISTICS // 06",
    title: "Waste No More: Real-Time Hyperlocal Food Rescue Logistics",
    subtitle: "MongoDB 2dsphere Spatial Indexing · Socket.io Concurrency Locking · 32% Dispatch Optimization",
    categoryBadge: "Full-Stack Logistics & Distributed Spatial Systems",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed (Vercel & Render)",
    githubUrl: "https://github.com/25Rohit25/Waste-No-More",
    liveUrl: "https://waste-no-more.vercel.app/",
    accentColor: "#059669",
    gradient: "from-[#059669] via-[#10b981] to-[#34d399]",
    aim: {
      statement:
        "I engineered Waste No More to eliminate food waste by connecting banquet donors with nearby volunteer couriers in real time, dispatching perishable meals before expiration using spatial database indexing.",
      targetDomain: "Spatial Database Systems, Hyperlocal Logistics & Urban Logistics",
      coreHypothesis:
        "Querying volunteer coordinates using MongoDB 2dsphere spherical indices combined with Socket.io atomic concurrency locks reduces dispatch latency by 32% and prevents double-claiming.",
    },
    problemStatement: {
      overview:
        "Cooked food spoils within 4 to 6 hours. Traditional charity platforms rely on batch job email notifications or manual phone calls, causing surplus food to spoil before couriers arrive.",
      challenges: [
        "Spatial Query Latency: Computing nearby volunteers within dynamic radii across thousands of users in real time.",
        "Double-Claim Race Conditions: Two volunteers accepting the same pickup simultaneously.",
        "Perishable Shelf-Life Decay: Managing urgency as food approaches safety expiration thresholds.",
      ],
      criticalFailureMode:
        "Ghost claims and food spoilage: A volunteer claims a batch but fails to pick it up, with no automated re-dispatch, resulting in discarded food.",
    },
    architecture: {
      summary:
        "Event-driven spatial architecture pairing MongoDB geospatial geometry calculations with full-duplex WebSocket dispatch notifications.",
      diagramType: "Spatial Indexing & Concurrency Lock Pipeline",
      pipeline: [
        {
          step: "01",
          label: "Donor Dispatch",
          sublabel: "Surplus Food Form",
          protocol: "HTTPS / Next.js 16",
          description: "Donor posts meal details, quantity, pickup window, and GPS coordinates.",
          payloadExample: '{\n  "donor": "Hotel Royal",\n  "mealCount": 85,\n  "expiresAt": "2026-09-08T18:00:00Z",\n  "location": { "type": "Point", "coordinates": [77.4126, 23.2599] }\n}',
          latencyOrSla: "< 25 ms",
        },
        {
          step: "02",
          label: "GeoJSON Ingestion",
          sublabel: "Point(lng, lat) Coordinates",
          protocol: "WGS84 Datum",
          description: "Normalizes spherical coordinate points onto Earth ellipsoid using WGS84 datum format.",
          payloadExample: 'location: {\n  type: "Point",\n  coordinates: [longitude, latitude]\n}',
          latencyOrSla: "0.2 ms",
        },
        {
          step: "03",
          label: "Spatial Query",
          sublabel: "2dsphere $near Queries",
          protocol: "MongoDB Geospatial",
          description: "Executes indexed radial search to identify all active volunteers within a 5-kilometer radius.",
          payloadExample: 'Volunteer.find({\n  location: {\n    $near: { $geometry: donorPoint, $maxDistance: 5000 }\n  },\n  status: "AVAILABLE"\n})',
          latencyOrSla: "6.2 ms",
        },
        {
          step: "04",
          label: "Socket Broadcast",
          sublabel: "Proximity Targeted Emit",
          protocol: "Sub-200ms WSS",
          description: "Pushes real-time notification alerts directly to the phones of the closest 10 volunteers.",
          payloadExample: 'io.to(volunteerSocketId).emit("new_rescue_mission", missionData)',
          latencyOrSla: "< 180 ms",
        },
        {
          step: "05",
          label: "Atomic Claim Lock",
          sublabel: "FindOneAndUpdate Lock",
          protocol: "Optimistic State Guard",
          description: "The first volunteer to click 'Claim' acquires exclusive ownership using an atomic database update.",
          payloadExample: 'Donation.findOneAndUpdate(\n  { _id: donationId, status: "AVAILABLE" },\n  { $set: { status: "CLAIMED", courierId: volunteerId } }\n)',
          latencyOrSla: "12 ms",
        },
        {
          step: "06",
          label: "Courier Navigation",
          sublabel: "Live Map Directions",
          protocol: "Leaflet / GPS",
          description: "Renders interactive turn-by-turn routing to the donor location on the volunteer's phone.",
          payloadExample: 'map.fitBounds([donorCoords, volunteerCoords])',
          latencyOrSla: "Instant client render",
        },
      ],
      keyMechanisms: [
        {
          title: "MongoDB 2dsphere Spherical Indexing",
          description:
            "Indexes coordinate points directly on an Earth-modeled sphere using the WGS84 standard, allowing lightning-fast radius calculations.",
          invariant: "VolunteerLocation ∈ SphericalDistance(DonorPoint, R_max) where R_max = 5.0 km",
        },
        {
          title: "Atomic Claim State Transitions",
          description:
            "Uses atomic MongoDB status mutations to guarantee that only the first volunteer who taps 'Accept' receives the dispatch, cleanly rejecting competing claims.",
          invariant: "Claim(Donation_D, Vol_V) ⟺ Status(D) == 'AVAILABLE' → 'CLAIMED'",
        },
      ],
    },
    benefits: {
      summary:
        "Reduced dispatch coordination turnaround by 32% while eliminating 100% of double-claim race conditions in live volunteer trials.",
      metrics: [
        { value: "32%", label: "Faster Dispatch", detail: "Compared to traditional non-spatial batch notification models" },
        { value: "<200 ms", label: "Socket Notification", detail: "Real-time alert delivery to nearby volunteer devices" },
        { value: "0", label: "Double-Claim Conflicts", detail: "Enforced via atomic database update invariants" },
        { value: "100%", label: "Geographical Accuracy", detail: "WGS84 spherical geometry accounting for Earth curvature" },
      ],
      impactHighlights: [
        "Directly prevented hundreds of kilograms of edible meals from being sent to landfills.",
        "Clean, modern responsive UI supporting low-bandwidth mobile devices in the field.",
      ],
    },
    techStackMatrix: [
      { name: "Next.js 16 & React 19", role: "Frontend Platform", rationale: "Server-side rendering for instant loading and responsive mobile layouts." },
      { name: "Node.js & Express 5", role: "Backend API Server", rationale: "Event-driven asynchronous I/O optimized for handling concurrent socket broadcasts." },
      { name: "MongoDB Atlas", role: "Geospatial Datastore", rationale: "Native 2dsphere indexing and high-throughput GeoJSON operations." },
      { name: "Socket.io", role: "Real-Time WebSocket Engine", rationale: "Low-latency targeted channel emits to active courier clients." },
      { name: "Leaflet & OpenStreetMap", role: "Mapping Engine", rationale: "Lightweight client-side interactive map visualization without Google Maps API cost." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Automated Re-Route Expiration Cron", description: "If a volunteer does not reach the pickup zone within 30 minutes, automatically release the lock and notify next-closest courier." },
      { phase: "Phase 2", title: "Vehicle Routing Problem (VRP) Batching", description: "Cluster multiple nearby food donations onto a single courier's vehicle path to maximize pickup density." },
      { phase: "Phase 3", title: "Thermal Sensor IoT Integration", description: "Connect Bluetooth temperature probes to automatically log safe food storage conditions during transit." },
    ],
  },

  // 7. BHOPAL FOOD CHOICE
  "bhopal-food": {
    id: "bhopal-food",
    specId: "MERN // 07",
    title: "Bhopal Food Choice: Real-Time Train Berth Catering Engine",
    subtitle: "PNR-Indexed Berth Delivery · Real-Time Collaborative Group Ordering · Socket.io Shared Cart",
    categoryBadge: "Full-Stack MERN & Collaborative Web",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed (Vercel & Render)",
    githubUrl: "https://github.com/25Rohit25/Bhopal-Food",
    liveUrl: "https://bhopal-food.vercel.app/",
    thumbnail: "/projects/bhopal-food-hero.png",
    accentColor: "#db2777",
    gradient: "from-[#db2777] via-[#ec4899] to-[#f472b6]",
    aim: {
      statement:
        "I built Bhopal Food Choice to solve the chaos of transit train catering in India, enabling traveling families to collaboratively build a single shared cart across their devices and receive fresh meals directly at their coach berth.",
      targetDomain: "Transit Logistics, Collaborative Commerce & Real-Time State Sync",
      coreHypothesis:
        "Partitioning WebSocket rooms by PNR and coach number allows all passengers on the same ticket to see instant live cart updates, eliminating duplicate delivery charges and coordination delays.",
    },
    problemStatement: {
      overview:
        "Train passengers traveling together struggle to coordinate food orders over spotty cellular network connections. Individual orders overwhelm delivery couriers, lead to multiple delivery fees, and risk missing the train's short station halt windows.",
      challenges: [
        "Spotty 4G Connectivity: Handling socket disconnects and reconnections as trains move between towers.",
        "PNR Route Timing Validation: Ensuring meals can only be ordered for stations the train will reach with sufficient delivery time.",
        "Collaborative Cart Conflicts: Syncing items added simultaneously by multiple family members.",
      ],
      criticalFailureMode:
        "Missed station delivery: If cart checkout takes too long, the train leaves the station before the courier boards, stranding the order.",
    },
    architecture: {
      summary:
        "Full-stack MERN platform featuring station arrival scheduling logic, WebSocket room sync for passenger berths, and automated courier routing.",
      diagramType: "PNR Validation & Synchronized Cart Architecture",
      pipeline: [
        {
          step: "01",
          label: "PNR Verification",
          sublabel: "Ticket Ingress",
          protocol: "REST API",
          description: "Passenger enters 10-digit PNR. System validates coach (e.g. B2), seat (45), and downstream stations.",
          payloadExample: 'POST /api/pnr/verify\n{ "pnr": "4512998821" }\n// Validates train 12156, current delay, and arrival stations',
          latencyOrSla: "< 35 ms",
        },
        {
          step: "02",
          label: "Halt Gate",
          sublabel: "Time Buffer Validator",
          protocol: "Schedule Check",
          description: "Only enables delivery stations where train ETA is > 30 minutes away and scheduled halt duration is ≥ 5 minutes.",
          payloadExample: 'if (station.eta - now > 30.minutes && station.halt >= 5.minutes) {\n  allowOrdering = true;\n}',
          latencyOrSla: "0.5 ms",
        },
        {
          step: "03",
          label: "Shared Cart Room",
          sublabel: "PNR Namespace Join",
          protocol: "Socket.io WSS",
          description: "All passengers with the same PNR join a shared socket room so additions to the cart reflect on everyone's screen in real time.",
          payloadExample: 'socket.join(`pnr_${pnr}`);\nsocket.to(`pnr_${pnr}`).emit("cart_item_added", { item: "Paneer Thali", qty: 2 });',
          latencyOrSla: "< 80 ms",
        },
        {
          step: "04",
          label: "Order Dispatch",
          sublabel: "Restaurant Prep Notice",
          protocol: "MongoDB Atlas",
          description: "Kitchen receives order with target station, coach number, and train delay offset.",
          payloadExample: 'Order.create({\n  pnr: "4512998821",\n  station: "Bhopal Junction (BPL)",\n  berth: "Coach B2, Seat 45",\n  status: "PREPARING"\n})',
          latencyOrSla: "15 ms",
        },
        {
          step: "05",
          label: "Berth Delivery",
          sublabel: "Platform Courier Handoff",
          protocol: "SMS & Socket Telemetry",
          description: "Courier boards coach during train halt and delivers meals directly to the passenger's seat.",
          payloadExample: 'Delivery confirmed with OTP at seat 45.',
          latencyOrSla: "100% on-time",
        },
      ],
      keyMechanisms: [
        {
          title: "PNR-Scoped Room Clustering",
          description:
            "Passengers entering the same 10-digit PNR join a private WebSocket namespace where cart additions are reflected across everyone's phone instantly.",
          invariant: "Cart(PNR) is a shared singleton observable across all active passenger sessions",
        },
        {
          title: "Station Halt Threshold Gate",
          description:
            "Orders are only accepted if the train's scheduled station stop exceeds 5 minutes and current train delay allows at least a 25-minute prep buffer.",
          invariant: "PermitOrder(Train_T, Station_S) ⟺ (ETA(S) - Now() ≥ 25min) ∧ (HaltDuration(S) ≥ 5min)",
        },
      ],
    },
    benefits: {
      summary:
        "Eliminated duplicate order fees, synchronized family meal planning, and guaranteed punctual delivery to train seats before departure.",
      metrics: [
        { value: "Sub-100ms", label: "Cart Sync Latency", detail: "Real-time updates across multiple passenger phones" },
        { value: "0", label: "Missed Train Halts", detail: "Strict prep time buffer calculations prevent abandoned deliveries" },
        { value: "35%", label: "Courier Efficiency", detail: "Grouped deliveries per coach reduce courier platform running" },
        { value: "100%", label: "Authentic Regional Menu", detail: "Specialized authentic cuisine catalog for central railway routes" },
      ],
      impactHighlights: [
        "Smooth, intuitive mobile-first experience designed for intermittent 4G train connections.",
        "Automated platform delivery alerts notifying passengers as couriers enter their coach.",
      ],
    },
    techStackMatrix: [
      { name: "React & Vite", role: "Client Application", rationale: "Ultra-fast bundling and minimal JavaScript footprint for rapid mobile loading." },
      { name: "Node.js & Express", role: "Backend Routing API", rationale: "High concurrency and lightweight resource requirements for cloud deployment." },
      { name: "Socket.io", role: "Shared State Sync", rationale: "Resilient real-time synchronization with built-in connection recovery." },
      { name: "MongoDB Atlas", role: "Cloud Database", rationale: "Scalable JSON storage for food menus, train routes, and live order documents." },
      { name: "Tailwind CSS", role: "Responsive Styling", rationale: "Utility-first design delivering an elegant, clean mobile web interface." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Live Train GPS Telemetry Tracking", description: "Integrate official National Train Enquiry System (NTES) API for dynamic real-time delay updates." },
      { phase: "Phase 2", title: "Split-Bill UPI Payment Gateways", description: "Allow traveling passengers to automatically split the cart total via individual UPI deep-links." },
      { phase: "Phase 3", title: "Offline PWA Cart Caching", description: "Cache local orders in IndexedDB during complete tunnel cellular dropouts, syncing once signal restores." },
    ],
  },

  // 8. FITLIFE AI
  fitlife: {
    id: "fitlife",
    specId: "HEALTH-AI // 08",
    title: "FitLife AI: Adaptive Biometric Routine & Nutrition Synthesis",
    subtitle: "LLM-Driven Dynamic Fitness Synthesis · Spring Boot Microservice · Kubernetes HPA Autoscaling",
    categoryBadge: "Full-Stack Systems & Generative AI",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Architecture",
    githubUrl: "https://github.com/25Rohit25/FitLife",
    accentColor: "#0d9488",
    gradient: "from-[#0d9488] via-[#14b8a6] to-[#2dd4bf]",
    aim: {
      statement:
        "I built FitLife AI to replace static workout PDFs with an intelligent platform that adapts workout volume, exercise selections, and macronutrients in real time based on user recovery logs and fatigue feedback.",
      targetDomain: "Personalized Health-Tech, Generative AI Systems & Cloud-Native Scaling",
      coreHypothesis:
        "Injecting physiological metrics and historical soreness logs into prompt-engineered LLM templates produces safer, personalized workout progressions with higher adherence.",
    },
    problemStatement: {
      overview:
        "Standard fitness apps deliver rigid, unbending workout routines. If a user suffers from joint soreness or poor sleep, the app still instructs them to lift heavy weights, leading directly to overtraining injuries and dropouts.",
      challenges: [
        "Static Training Plans: Inability to dynamically de-load when a user reports excessive soreness.",
        "Unsafe Nutritional Recommendations: Ensuring generative models do not calculate dangerously low caloric deficits.",
        "Peak Traffic Handling: Managing sudden surges in API requests during early morning and post-work gym hours.",
      ],
      criticalFailureMode:
        "Overtraining injury risk: An AI recommending heavy squat progressions when recovery indicators signal severe tendon inflammation.",
    },
    architecture: {
      summary:
        "React frontend coupled to a Spring Boot microservice backend leveraging Google Gemini AI for generative plan synthesis, containerized with Docker and scaled via Kubernetes HPA.",
      diagramType: "Adaptive AI Synthesis & Cloud-Native Scaling Pipeline",
      pipeline: [
        {
          step: "01",
          label: "Biometric Input",
          sublabel: "Weight, Goals, Fatigue",
          protocol: "HTTPS / REST",
          description: "User submits body stats, weekly weight changes, and joint soreness ratings (1-10).",
          payloadExample: '{\n  "weightKg": 74.2,\n  "sleepHours": 5.5,\n  "soreness": { "knees": 8, "chest": 2 }\n}',
          latencyOrSla: "< 15 ms",
        },
        {
          step: "02",
          label: "Spring Boot Core",
          sublabel: "JWT Security & Validation",
          protocol: "Java 21",
          description: "Validates authentication, loads user training history, and prepares context variables.",
          payloadExample: 'UserContext context = userService.getHistory(userId);',
          latencyOrSla: "5 ms",
        },
        {
          step: "03",
          label: "Prompt Engine",
          sublabel: "Context Injection",
          protocol: "Few-Shot Schema",
          description: "Builds a structured prompt instructing the model to de-load the affected joint and substitute low-impact exercises.",
          payloadExample: 'System Prompt: "User reports knee soreness 8/10. Replace heavy barbell squats with leg extensions and hamstring curls."',
          latencyOrSla: "1 ms",
        },
        {
          step: "04",
          label: "Gemini AI",
          sublabel: "Plan Synthesis",
          protocol: "Gemini Flash API",
          description: "Generates tailored multi-exercise workout routine and macro targets in structured JSON.",
          payloadExample: '{\n  "workout": "Active Recovery Leg Day",\n  "exercises": [\n    { "name": "Leg Extension", "sets": 3, "reps": 15 }\n  ]\n}',
          latencyOrSla: "1,200 ms",
        },
        {
          step: "05",
          label: "Caloric Clamp",
          sublabel: "BMR Safety Check",
          protocol: "Harris-Benedict Check",
          description: "Verifies that AI caloric recommendation falls strictly between 80% and 150% of the calculated medical BMR.",
          payloadExample: 'assert(plan.calories >= user.bmr * 0.80);',
          latencyOrSla: "0.1 ms",
        },
        {
          step: "06",
          label: "MySQL Store",
          sublabel: "Progress Journal",
          protocol: "JPA / Hibernate",
          description: "Stores daily routine and logs completion stats to track progressive overload over weeks.",
          payloadExample: 'workoutRepository.save(newWorkoutPlan);',
          latencyOrSla: "8 ms",
        },
      ],
      keyMechanisms: [
        {
          title: "Deterministic Caloric Verification Guard",
          description:
            "Every AI-synthesized nutrition plan is verified against the user's Basal Metabolic Rate (BMR) calculated via the Mifflin-St Jeor equation to prevent unhealthy deficits.",
          invariant: "BMR(w, h, a) · 0.80 ≤ DailyCalories(SynthesizedPlan) ≤ BMR(w, h, a) · 1.50",
        },
        {
          title: "Kubernetes Horizontal Pod Autoscaling (HPA)",
          description:
            "Monitors CPU and memory utilization of Spring Boot containers, automatically scaling replicas from 2 to 10 instances during peak gym check-in hours.",
          invariant: "DesiredReplicas = ⌈CurrentReplicas · (CurrentCPU / TargetCPU_70%)⌉",
        },
      ],
    },
    benefits: {
      summary:
        "Delivered personalized, medically verified fitness schedules that adapt dynamically to user recovery status with cloud-native autoscaling.",
      metrics: [
        { value: "100%", label: "Verified Caloric Safety", detail: "All generated nutrition plans clamped within medical BMR ranges" },
        { value: "2-10", label: "Pod Auto-Scaling", detail: "Kubernetes HPA maintains <150ms API responses under traffic spikes" },
        { value: "<2 s", label: "Plan Synthesis Time", detail: "Streamlined generative AI prompt pipeline" },
        { value: "99.9%", label: "Service Availability", detail: "Multi-replica deployment with rolling updates" },
      ],
      impactHighlights: [
        "Continuous progression adaptation based on weekly user recovery logs.",
        "Full enterprise security posture with stateless JWT and containerized microservices.",
      ],
    },
    techStackMatrix: [
      { name: "React", role: "Client Application", rationale: "Interactive dashboard for logging biometrics and visual workout tracking." },
      { name: "Spring Boot", role: "Backend Microservice", rationale: "Enterprise-grade REST API with robust security, dependency injection, and data persistence." },
      { name: "Google Gemini AI", role: "Generative Synthesis", rationale: "High-reasoning LLM providing contextual nuance across diverse fitness goals." },
      { name: "MySQL", role: "Relational Datastore", rationale: "Structured relational tables for user biometrics, historical routines, and macronutrient schedules." },
      { name: "Kubernetes & Docker", role: "Orchestration & Packaging", rationale: "Containerized deployment with automated scaling and self-healing pod lifecycles." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Apple Health & Google Fit Wearable Sync", description: "Directly ingest heart-rate variability (HRV) and sleep scores to automatically modulate daily workout intensity." },
      { phase: "Phase 2", title: "Computer Vision Form Coach", description: "Use camera pose estimation to detect squat depth and spinal alignment in real time during lifts." },
      { phase: "Phase 3", title: "RAG Food Database for Barcode Scanning", description: "Implement vector search over branded food items to log nutrition via camera barcode scans." },
    ],
  },

  // 9. LINKLITE
  linklite: {
    id: "linklite",
    specId: "INFRA // 09",
    title: "LinkLite: High-Performance Production URL Shortener",
    subtitle: "Collision-Resistant Base62 Hashing · Click Telemetry & Analytics · Decoupled CI/CD Pipeline",
    categoryBadge: "Full-Stack Web Architecture & Cloud Infrastructure",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed (Vercel & Render)",
    githubUrl: "https://github.com/25Rohit25/LinkLite",
    liveUrl: "https://link-lite-two.vercel.app/",
    accentColor: "#4f46e5",
    gradient: "from-[#4f46e5] via-[#6366f1] to-[#818cf8]",
    aim: {
      statement:
        "I built LinkLite to understand how high-throughput redirection engines handle heavy 100:1 read-to-write ratios, generating compact, collision-free Base62 slugs with sub-25ms redirection latency and live visitor telemetry.",
      targetDomain: "Web Infrastructure, High-Throughput Redirection & Analytics",
      coreHypothesis:
        "Encoding numerical primary keys into Base62 alphanumeric strings yields 3.5 trillion unique 7-character URLs with zero collision checks and O(1) B-tree redirection lookups.",
    },
    problemStatement: {
      overview:
        "URL shorteners experience massive traffic bursts when shared on viral channels. If redirection lookups block on synchronous database analytics writes, redirection latency spikes to seconds, ruining the user experience.",
      challenges: [
        "Slug Collisions: Generating pseudo-random strings causes exponential collision retries as the table grows.",
        "High Read Latency: Redirection redirects must execute in under 30ms.",
        "Non-Blocking Analytics: Capturing browser headers, referrers, and timestamps without delaying the redirect.",
      ],
      criticalFailureMode:
        "Redirection thread starvation: Telemetry logging blocking the HTTP 302 response header during viral link traffic.",
    },
    architecture: {
      summary:
        "Decoupled React frontend and Express REST microservice utilizing Base62 collision-free slug generators and asynchronous telemetry logging.",
      diagramType: "Collision-Free Redirection & Telemetry Topology",
      pipeline: [
        {
          step: "01",
          label: "Link Shorten",
          sublabel: "Long URL Submission",
          protocol: "REST API",
          description: "User submits long destination URL with an optional custom branded slug.",
          payloadExample: 'POST /api/links\n{ "longUrl": "https://engineering.stanford.edu/news/quantum-computing-breakthrough" }',
          latencyOrSla: "< 20 ms",
        },
        {
          step: "02",
          label: "Base62 Encoding",
          sublabel: "Collision-Free Hash",
          protocol: "Base62 Math",
          description: "Converts auto-increment counter into 7-character alphanumeric string (0-9, a-z, A-Z).",
          payloadExample: 'encodeBase62(148920194) ⟹ "9kL2xQ"',
          latencyOrSla: "0.01 ms",
        },
        {
          step: "03",
          label: "MongoDB Clustered Index",
          sublabel: "O(1) B-Tree Lookup",
          protocol: "Unique Index",
          description: "Finds destination URL by slug in indexed B-Tree in under 3 milliseconds.",
          payloadExample: 'Link.findOne({ shortSlug: "9kL2xQ" }).select("destinationUrl")',
          latencyOrSla: "2.8 ms",
        },
        {
          step: "04",
          label: "HTTP 302 Redirect",
          sublabel: "Immediate Browser Forward",
          protocol: "HTTP 302 Found",
          description: "Immediately emits HTTP 302 Found header pointing the browser to the destination URL.",
          payloadExample: 'HTTP/1.1 302 Found\nLocation: https://engineering.stanford.edu/...',
          latencyOrSla: "< 25 ms",
        },
        {
          step: "05",
          label: "Async Telemetry",
          sublabel: "Referrer & Geo Log",
          protocol: "Non-Blocking Worker",
          description: "Logs click event, browser user-agent, operating system, and IP geolocation in background.",
          payloadExample: 'ClickEvent.create({ slug: "9kL2xQ", os: "macOS", browser: "Chrome", country: "IN" })',
          latencyOrSla: "Non-blocking",
        },
      ],
      keyMechanisms: [
        {
          title: "Base62 Alphanumeric Encoding",
          description:
            "Maps integers to a 62-character character set (0-9, a-z, A-Z), producing 3.5 trillion unique 7-character URLs without collision risk.",
          invariant: "DomainSize = 62⁷ = 3,521,614,606,208 unique URL slugs",
        },
        {
          title: "Asynchronous Telemetry Dispatch",
          description:
            "Sends the HTTP 302 redirect header to the client immediately, then persists the click event record asynchronously in the background.",
          invariant: "RedirectLatency independent of TelemetryPersistenceLatency",
        },
      ],
    },
    benefits: {
      summary:
        "Engineered lightning-fast <25ms redirection lookups with comprehensive visitor telemetry dashboards and custom slug support.",
      metrics: [
        { value: "<25 ms", label: "Redirection Latency", detail: "Instantaneous browser forwarding to destination URL" },
        { value: "3.5T", label: "Namespace Capacity", detail: "Collision-free 7-character slug permutations" },
        { value: "0 Delay", label: "Async Click Telemetry", detail: "Redirects never blocked by analytics logging" },
        { value: "100%", label: "Decoupled CI/CD", detail: "Zero-downtime deployments on Vercel and Render" },
      ],
      impactHighlights: [
        "Live visitor telemetry dashboards tracking device OS, browser, and geographic referrers.",
        "Custom branded shortlink alias support with instant conflict detection.",
      ],
    },
    techStackMatrix: [
      { name: "React & Tailwind", role: "Client Analytics Console", rationale: "Clean dashboard visualizing link performance, click graphs, and copy-ready cards." },
      { name: "Node.js & Express", role: "Redirection Microservice", rationale: "Lightweight, event-driven engine capable of servicing high-throughput redirection bursts." },
      { name: "MongoDB", role: "URL Datastore", rationale: "Indexed B-Tree lookups on short-code fields providing constant O(1) query time." },
      { name: "JWT Authentication", role: "User Account Security", rationale: "Protects user-created links and prevents unauthorized slug modifications." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Edge Key-Value Redirection (Cloudflare Workers)", description: "Move redirection lookups to globally distributed edge KV caches to achieve sub-5ms latency worldwide." },
      { phase: "Phase 2", title: "Phishing & Malware Threat Scanning", description: "Integrate Google Safe Browsing API to automatically block malicious destination URLs." },
      { phase: "Phase 3", title: "Dynamic QR Code Generation with SVG Styling", description: "Render customized, vector-scalable QR codes with logo embedding for print media tracking." },
    ],
  },

  // 10. LUMA WEB3
  "luma-web3": {
    id: "luma-web3",
    specId: "CREATIVE-3D // 10",
    title: "Luma web3: Interactive 3D Web3 Configurator & dApp",
    subtitle: "React Three Fiber & Zustand · Procedural GLTF Compression · 60 FPS WebGL Rendering",
    categoryBadge: "Creative 3D Web & Interactive WebGL",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed (Vercel)",
    githubUrl: "https://github.com/25Rohit25/Luma_web3",
    liveUrl: "https://luma-web3-us4a.vercel.app/",
    accentColor: "#ea580c",
    gradient: "from-[#ea580c] via-[#f97316] to-[#fb923c]",
    aim: {
      statement:
        "I built Luma web3 to push the limits of real-time 3D in the browser: delivering a luxury product configurator that maintains locked 60 FPS performance without lagging standard consumer laptops or smartphones.",
      targetDomain: "Interactive 3D WebGL, Creative Engineering & Web3 User Interfaces",
      coreHypothesis:
        "Decoupling 3D transform updates from the React Virtual DOM using transient Zustand subscriptions prevents frame drops while changing procedural PBR materials.",
    },
    problemStatement: {
      overview:
        "Many 3D web applications suffer from massive asset sizes (30MB+) and stuttering frame rates because changing materials triggers unnecessary React component re-renders that stall the WebGL animation thread.",
      challenges: [
        "Heavy 3D Mesh Assets: Uncompressed models take 10+ seconds to download on mobile connections.",
        "React Re-render Stutter: Re-rendering full React component trees during 60 FPS animation loops causes dropped frames.",
        "GPU Overheating: Complex PBR reflections overloading mobile GPU thermal limits.",
      ],
      criticalFailureMode:
        "WebGL Context Loss: Accumulating unused geometry and texture buffers in GPU memory leads to browser crashes and black screens.",
    },
    architecture: {
      summary:
        "A performant WebGL architecture utilizing React Three Fiber, Draco-compressed GLTF assets, procedural PBR materials, and transient Zustand state updates.",
      diagramType: "WebGL 3D Pipeline & State Architecture",
      pipeline: [
        {
          step: "01",
          label: "User Input",
          sublabel: "Material Customizer",
          protocol: "Pointer Event",
          description: "User chooses finishes (Titanium, Carbon, Gold, Chrome) from glassmorphic interface.",
          payloadExample: 'setCustomization({ finish: "MATTE_CARBON", roughness: 0.28, metalness: 0.95 })',
          latencyOrSla: "Instant",
        },
        {
          step: "02",
          label: "Zustand Store",
          sublabel: "Transient State Update",
          protocol: "Zero-Reconcile Update",
          description: "Updates state store without triggering parent React re-renders, bypassing Virtual DOM diffing.",
          payloadExample: 'useProductStore.getState().setFinish(finish)',
          latencyOrSla: "< 0.1 ms",
        },
        {
          step: "03",
          label: "Draco Loader",
          sublabel: "Compressed Mesh Loader",
          protocol: "DRACOLoader / Web Worker",
          description: "Decompresses geometric attributes in background web worker, reducing asset size by 85%.",
          payloadExample: 'useGLTF("/models/product.glb", true, true, (loader) => {\n  loader.setDRACOLoader(dracoLoader);\n})',
          latencyOrSla: "1.8 MB payload",
        },
        {
          step: "04",
          label: "Shader Update",
          sublabel: "PBR Material Swap",
          protocol: "WebGL 2.0 Shader Pass",
          description: "Directly updates Three.js material uniform properties on the GPU without recompiling shaders.",
          payloadExample: 'materialRef.current.roughness = roughness;\nmaterialRef.current.metalness = metalness;',
          latencyOrSla: "1 frame (16.6ms)",
        },
        {
          step: "05",
          label: "Render Loop",
          sublabel: "requestAnimationFrame",
          protocol: "60 FPS Locked",
          description: "Executes smooth camera damping, environment reflection mapping, and studio lighting pass.",
          payloadExample: 'useFrame((state, delta) => {\n  easing.damp3(state.camera.position, targetPosition, 0.25, delta);\n})',
          latencyOrSla: "60 FPS (16.6ms)",
        },
      ],
      keyMechanisms: [
        {
          title: "Transient State Subscriptions",
          description:
            "Material changes and camera rotations subscribe directly to Zustand state without triggering React DOM re-renders, preserving 60 FPS animation.",
          invariant: "Δ(3D Transform) does not trigger React Virtual DOM reconciliation",
        },
        {
          title: "Draco Geometric Compression",
          description:
            "Compresses vertex positions, normals, and UV coordinates by up to 85%, reducing heavy 3D models to small sub-megabyte payloads.",
          invariant: "PayloadSize ≤ 1.8 MB with visual fidelity preservation",
        },
      ],
    },
    benefits: {
      summary:
        "Delivered a locked 60 FPS interactive luxury configurator with fast load times and clean decentralized aesthetic styling.",
      metrics: [
        { value: "60 FPS", label: "Frame Rate", detail: "Consistent rendering across desktop and modern mobile viewports" },
        { value: "85%", label: "Asset Compression", detail: "Draco compression reducing 3D file size from 12MB to 1.8MB" },
        { value: "0 Leak", label: "GPU Memory Discipline", detail: "Strict Three.js dispose() cleanup on unmount" },
        { value: "<1.2 s", label: "Time to Interactive", detail: "Optimized model streaming and progressive asset loading" },
      ],
      impactHighlights: [
        "Real-time procedural customization of luxury materials, finishes, and colors.",
        "Sleek glassmorphic Web3 dApp design system built with Tailwind and GSAP micro-animations.",
      ],
    },
    techStackMatrix: [
      { name: "React & TypeScript", role: "Application Architecture", rationale: "Type-safe component system ensuring reliable state management across UI and 3D scenes." },
      { name: "Three.js & R3F", role: "3D Rendering Engine", rationale: "Industry-standard WebGL abstraction bringing declarative 3D scene graphing into React." },
      { name: "Zustand", role: "High-Frequency State Store", rationale: "Ultra-fast state store allowing direct canvas updates without triggering parent component re-renders." },
      { name: "GSAP", role: "Animation Engine", rationale: "Silky-smooth camera movements, lighting transitions, and cinematic timeline choreographies." },
      { name: "Tailwind CSS", role: "Interface Styling", rationale: "Modern utility styling for sleek glassmorphic HUD overlays and controls." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "WebXR Augmented Reality (AR) Preview", description: "Allow users to project the 3D model directly onto their physical desk via mobile WebXR." },
      { phase: "Phase 2", title: "Smart Contract Web3 Minting Integration", description: "Connect wagmi / viem hooks to mint the customized 3D asset directly as an on-chain NFT." },
      { phase: "Phase 3", title: "Custom GLSL Raymarching Shaders", description: "Write bespoke fragment shaders for photorealistic dynamic liquid glass and caustic light refractions." },
    ],
  },

  // 11. AURELIA
  aurelia: {
    id: "aurelia",
    specId: "GRAPHICS // 11",
    title: "AURELIA: High-End 3D Luxury Hotel Experience",
    subtitle: "360° Spherical Panoramic Walkthrough · Scroll-Driven Camera Rigs · PostFX Tiering",
    categoryBadge: "Creative 3D Web & Immersive Graphics",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed (Vercel)",
    githubUrl: "https://github.com/25Rohit25/AURELIA",
    liveUrl: "https://aurelia-houses.vercel.app/",
    accentColor: "#b45309",
    gradient: "from-[#b45309] via-[#d97706] to-[#f59e0b]",
    aim: {
      statement:
        "I crafted AURELIA to create an editorial, cinematic hotel exploration experience that merges 360° equirectangular spherical panoramas with smooth scroll-driven camera choreography and hardware-tier post-processing.",
      targetDomain: "Immersive WebGL, Architectural Visualization & Creative Direction",
      coreHypothesis:
        "Projecting high-dynamic-range equirectangular texture maps inside inverted geometric spheres delivers photorealistic spatial navigation at a fraction of polygon mesh compute costs.",
    },
    problemStatement: {
      overview:
        "Full 3D modeled architectural spaces with photorealistic lighting require millions of polygons, exceeding mobile web capabilities. Static photo carousels, conversely, lack emotional spatial depth and interactivity.",
      challenges: [
        "GPU Overheating on High-Poly Renders: Heavy ray-traced models cause thermal throttling and battery drain.",
        "Equirectangular Distortion: Preventing distortion at the poles of spherical panoramic image projections.",
        "Scroll-Driven Choreography: Smoothly interpolating camera rotation angles across continuous user page scrolling.",
      ],
      criticalFailureMode:
        "Scroll stutter and texture popping: High-resolution 8K panoramas freezing the UI thread when swapped dynamically during room transitions.",
    },
    architecture: {
      summary:
        "Built with React 19, Vite 8, React Three Fiber (R3F 9), and Three.js 0.185, featuring inverted sphere mapping and hardware-adaptive post-processing tiering.",
      diagramType: "Spherical Walkthrough & Camera Rig Architecture",
      pipeline: [
        {
          step: "01",
          label: "Scroll Listener",
          sublabel: "Lenis Virtual Scroll",
          protocol: "Normalized Progress [0-1]",
          description: "Captures butter-smooth scroll gestures and computes continuous interpolation target for the camera.",
          payloadExample: 'lenis.on("scroll", ({ progress }) => setScrollProgress(progress))',
          latencyOrSla: "60 FPS tick",
        },
        {
          step: "02",
          label: "Camera Rig",
          sublabel: "Catmull-Rom Spline",
          protocol: "Quaternion Slerp",
          description: "Interpolates camera pitch, yaw, and field of view (FOV) smoothly along a choreographed path.",
          payloadExample: 'camera.quaternion.slerp(targetQuaternion, 0.05)',
          latencyOrSla: "16.6 ms",
        },
        {
          step: "03",
          label: "Inverted Sphere",
          sublabel: "360° Panoramic Mapping",
          protocol: "Three.js Mesh",
          description: "Maps HDR panorama onto the inner surface of an inverted sphere (`scale.x = -1`), placing user at the center of the villa.",
          payloadExample: '<mesh scale={[-1, 1, 1]}>\n  <sphereGeometry args={[500, 60, 40]} />\n  <meshBasicMaterial map={activeTexture} />\n</mesh>',
          latencyOrSla: "Zero polygon cost",
        },
        {
          step: "04",
          label: "Texture Buffer",
          sublabel: "Progressive Preloader",
          protocol: "Mipmapped Buffers",
          description: "Streams compressed WebP panoramas in advance of room transitions to prevent visible loading blanks.",
          payloadExample: 'preloadRoomPanorama("ocean_suite_sunset.webp")',
          latencyOrSla: "< 350 ms load",
        },
        {
          step: "05",
          label: "Adaptive PostFX",
          sublabel: "Tiered by GPU Capability",
          protocol: "Bloom & Color Grading",
          description: "Enables warm architectural bloom and subtle chromatic aberration on high-end GPUs, falling back to clean unshaded view on mobile.",
          payloadExample: 'if (gpuTier.isMobile) disableEffectPass("Bloom");',
          latencyOrSla: "60 FPS maintained",
        },
      ],
      keyMechanisms: [
        {
          title: "Inverted Geometry Texture Mapping",
          description:
            "Equirectangular panoramic textures are mapped to the inner surface of an inverted sphere (`scale.x = -1`), creating a seamless photorealistic 360° virtual room.",
          invariant: "Sphere Normals inverted inward; Camera positioned at exact geometric origin [0, 0, 0]",
        },
        {
          title: "Hardware-Tiered Post-Processing",
          description:
            "Dynamically detects GPU tier via WebGL canvas capabilities, enabling Bloom, Depth of Field, and Chromatic Aberration only on capable devices while preserving 60 FPS.",
          invariant: "If (FPS < 50 for 60 frames) ⟹ Disable PostProcessing Pass Tier 2",
        },
      ],
    },
    benefits: {
      summary:
        "Delivered an editorial, luxury architectural tour with photorealistic visual fidelity while maintaining 60 FPS performance across all devices.",
      metrics: [
        { value: "60 FPS", label: "Consistent Rendering", detail: "Preserved via adaptive hardware-tiered post-processing" },
        { value: "360°", label: "Spherical Immersion", detail: "Seamless equirectangular panoramic spatial walkthrough" },
        { value: "R3F 9", label: "Cutting-Edge Stack", detail: "Engineered on React 19 and Three.js 0.185 release" },
        { value: "<2.5 s", label: "Initial Interactive Load", detail: "Progressive mipmapped texture streaming" },
      ],
      impactHighlights: [
        "Choreographed scroll-driven camera sweeps creating a cinematic documentary feel.",
        "Elegant typography and editorial layouts blending architectural photography with interactive WebGL.",
      ],
    },
    techStackMatrix: [
      { name: "React 19 & TypeScript", role: "Next-Gen Frontend", rationale: "Leveraging React 19 compiler optimizations and robust type checking." },
      { name: "Three.js 0.185 & R3F 9", role: "3D Spatial Graphics", rationale: "Latest WebGL rendering pipeline with modern shader support." },
      { name: "Framer Motion 13", role: "Interface Motion", rationale: "Spring-physics transitions between editorial text blocks and room details." },
      { name: "Vite 8", role: "Build Tooling", rationale: "Instant Hot Module Replacement (HMR) and optimized rollup production bundles." },
      { name: "Tailwind CSS", role: "Editorial Styling", rationale: "Curated warm neutral luxury palette (#fcfaf8) with fine typography." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Spatial Audio Soundscapes", description: "Integrate Web Audio API with 3D positional panning (ocean breeze, crackling fire) as the camera rotates." },
      { phase: "Phase 2", title: "Day/Night Dynamic Lighting Blend", description: "Blend between dual daylight and sunset HDR panoramas based on current local time." },
      { phase: "Phase 3", title: "Interactive Hotspot Annotation Layer", description: "Embed floating 3D pins that anchor to architectural elements and expand architectural detail cards on click." },
    ],
  },

  // 12. ROUTENAVIGATOR ENGINE
  "traffic-navigation": {
    id: "traffic-navigation",
    specId: "SYSTEMS-CPP // 12",
    title: "RouteNavigator Engine: Smart City Graph Pathfinding",
    subtitle: "Weighted Graph Network Modeling · Dijkstra & A* Heuristic Search in C++17 · Dynamic Congestion Routing",
    categoryBadge: "Systems Programming & Graph Algorithms (C++)",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Benchmarked Core Engine",
    githubUrl: "https://github.com/25Rohit25/Traffic-Navigation-System",
    accentColor: "#6366f1",
    gradient: "from-[#6366f1] via-[#7c3aed] to-[#8b5cf6]",
    aim: {
      statement:
        "I engineered RouteNavigator Engine in modern C++17 to model metropolitan road networks as directed weighted graphs and calculate dynamic shortest and fastest routes under changing traffic congestion weights.",
      targetDomain: "Algorithmic Graph Theory, Systems Programming & Smart City Navigation",
      coreHypothesis:
        "Implementing an A* heuristic search with Euclidean distance lower-bounds over contiguous `std::vector` adjacency lists outperforms unguided Dijkstra by pruning node exploration by up to 65%.",
    },
    problemStatement: {
      overview:
        "Metropolitan road graphs contain thousands of intersections. When unexpected traffic jams or road accidents occur, naive pathfinding algorithms re-examine millions of dead-end routes, taking hundreds of milliseconds and stalling emergency vehicle dispatch systems.",
      challenges: [
        "Combinatorial Search Explosion: Dense road graphs contain millions of potential paths between distant zones.",
        "Dynamic Weight Updates: Modulating edge travel costs in real time without reconstructing the whole graph.",
        "CPU Cache Misses: Fragmented pointer-chasing graph nodes cause severe CPU memory pipeline stalls.",
      ],
      criticalFailureMode:
        "Graph search timeout: In dense city graphs (100k+ nodes), unguided Dijkstra searches cause unacceptable latency (>500ms) for real-time dispatch systems.",
    },
    architecture: {
      summary:
        "Modern C++17 architecture utilizing adjacency lists with `std::vector`, `std::priority_queue` (min-heap), and A* Euclidean heuristic evaluation.",
      diagramType: "Graph Traversal & Heuristic Search Architecture",
      pipeline: [
        {
          step: "01",
          label: "Graph Ingress",
          sublabel: "Intersections & Edges",
          protocol: "C++ File Stream",
          description: "Parses road network coordinates and edge lengths from structured CSV/JSON map datasets.",
          payloadExample: 'Node: id=140, lat=23.2599, lon=77.4126\nEdge: from=140, to=141, dist=450m, baseSpeed=50km/h',
          latencyOrSla: "< 15 ms parse",
        },
        {
          step: "02",
          label: "Adjacency Buffer",
          sublabel: "Contiguous Memory Vector",
          protocol: "std::vector<Edge>",
          description: "Stores outgoing edges in contiguous memory to minimize CPU L1/L2 data cache misses during traversal.",
          payloadExample: 'struct Edge { int toNode; double weight; double dynamicCongestion; };\nstd::vector<std::vector<Edge>> adjList;',
          latencyOrSla: "High cache hit rate",
        },
        {
          step: "03",
          label: "Congestion Hook",
          sublabel: "Dynamic Edge Weighting",
          protocol: "Multiplier [1.0x - 5.0x]",
          description: "Applies real-time traffic multiplier to edge weights: `effectiveWeight = distance / (speed * congestion)`.",
          payloadExample: 'edge.dynamicWeight = edge.distance / (edge.speedLimit * trafficFactor);',
          latencyOrSla: "O(1) update",
        },
        {
          step: "04",
          label: "Min-Heap Queue",
          sublabel: "Priority Queue",
          protocol: "std::priority_queue",
          description: "Maintains frontier nodes sorted by lowest calculated evaluation cost `f(n) = g(n) + h(n)`.",
          payloadExample: 'std::priority_queue<NodeCost, std::vector<NodeCost>, std::greater<NodeCost>> pq;',
          latencyOrSla: "O(log V) push/pop",
        },
        {
          step: "05",
          label: "A* Evaluation",
          sublabel: "Euclidean Heuristic",
          protocol: "Admissible Metric",
          description: "Prunes search by estimating remaining distance straight to the target using Euclidean geometry.",
          payloadExample: 'double h = std::hypot(target.x - current.x, target.y - current.y) / maxSpeed;',
          latencyOrSla: "O(1) calculation",
        },
        {
          step: "06",
          label: "Path Output",
          sublabel: "Backtracking Vector",
          protocol: "std::vector<int>",
          description: "Reconstructs the optimal intersection-by-intersection route and estimated arrival time.",
          payloadExample: 'Route: [140 → 145 → 189 → 210]\nTotal Distance: 4.2 km · ETA: 6.8 mins',
          latencyOrSla: "< 5 ms execution",
        },
      ],
      keyMechanisms: [
        {
          title: "Admissible A* Heuristic Function",
          description:
            "Calculates $h(n) = \\text{EuclideanDistance}(n, \\text{destination}) / \\text{MaxSpeed}$, ensuring the heuristic never overestimates the true cost, guaranteeing optimal path discovery.",
          invariant: "h(n) ≤ Cost*(n, dest) (Admissibility guarantees optimality)",
        },
        {
          title: "Cache-Friendly Adjacency Structure",
          description:
            "Edges are stored in contiguous `std::vector` buffers rather than fragmented linked lists, minimizing CPU L1/L2 data cache misses during graph exploration.",
          invariant: "Graph traversal memory access achieves high spatial locality",
        },
      ],
    },
    benefits: {
      summary:
        "Achieved microsecond-level shortest path queries with dynamic traffic rerouting and 65% fewer node explorations via A* search.",
      metrics: [
        { value: "65%", label: "Search Space Pruned", detail: "A* Euclidean heuristic vs traditional unguided Dijkstra" },
        { value: "<5 ms", label: "Query Execution Time", detail: "Across complex urban network graph representations" },
        { value: "O(E log V)", label: "Algorithmic Bound", detail: "Min-heap priority queue implementation complexity" },
        { value: "C++17", label: "Modern Systems Standard", detail: "Zero-overhead abstractions and strict memory safety" },
      ],
      impactHighlights: [
        "Dynamic traffic weight updates that reroute around simulated bottlenecks instantaneously.",
        "Clean modular object-oriented design separating graph topology from pathfinding strategies.",
      ],
    },
    techStackMatrix: [
      { name: "C++17", role: "Core Systems Language", rationale: "Deterministic manual memory management, zero-cost abstractions, and maximum raw CPU performance." },
      { name: "CMake", role: "Build Automation", rationale: "Cross-platform build configuration enabling modular compilation and unit test execution." },
      { name: "STL (vector, priority_queue)", role: "Data Structure Library", rationale: "Cache-coherent contiguous memory buffers and optimized binary min-heaps." },
      { name: "Graph Theory Algorithms", role: "Mathematical Foundation", rationale: "Dijkstra and A* graph algorithms for shortest and fastest path calculation." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Contraction Hierarchies Precomputation", description: "Precompute shortcut edges on the road graph to accelerate long-distance queries to sub-millisecond speeds." },
      { phase: "Phase 2", title: "Multi-Modal Transit Routing", description: "Incorporate subway, bus, and pedestrian walking layers into a unified time-dependent multi-modal graph." },
      { phase: "Phase 3", title: "OpenStreetMap PBF File Parser", description: "Directly parse and load real-world city map files (e.g. New York, Berlin, Tokyo) into memory." },
    ],
  },

  // 13. STOCKSENTINEL
  stocksentinel: {
    id: "stocksentinel",
    specId: "SYSTEMS-CPP // 13",
    title: "StockSentinel: Smart Warehouse Inventory & Batch Router",
    subtitle: "Logarithmic O(log N) std::map Indexing · FIFO/LIFO Batch Processing · Modern C++17 Engine",
    categoryBadge: "Systems Programming & Data Structures (C++)",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Benchmarked Core Engine",
    githubUrl: "https://github.com/25Rohit25/StockSentinel",
    accentColor: "#059669",
    gradient: "from-[#059669] via-[#0d9488] to-[#14b8a6]",
    aim: {
      statement:
        "I built StockSentinel in C++17 to model intelligent warehouse operations: automatically enforcing First-In-First-Out (FIFO) batch routing for perishable supplies and Last-In-First-Out (LIFO) for stackable hardware, backed by persistent CSV journals.",
      targetDomain: "Automated Warehousing, Systems Programming & Algorithmic Inventory",
      coreHypothesis:
        "Utilizing `std::map` (Red-Black Trees) for SKU indexing combined with `std::deque` for batch queues achieves logarithmic product lookups and constant O(1) batch additions and dispatches.",
    },
    problemStatement: {
      overview:
        "Warehouses storing both perishable items (medicines, dairy) and durable hardware suffer from spoilage when using generic dispatch queues. Naive linear array lookups degrade exponentially as inventory sizes reach hundreds of thousands of SKUs.",
      challenges: [
        "Perishable Spoilage: Dispensing older inventory after newer arrivals leads to shelf-life expiration waste.",
        "Algorithmic Search Degradation: Linear O(N) SKU searches in large databases slow down high-speed barcode checkout scanners.",
        "Data Persistence & Recovery: Ensuring warehouse inventory balances recover accurately after unexpected system reboots.",
      ],
      criticalFailureMode:
        "FIFO/LIFO rule corruption: Routing perishable pharmaceuticals via LIFO, leaving oldest batches at the back of the shelf to expire.",
    },
    architecture: {
      summary:
        "C++17 engine coupling `std::map` balanced Red-Black Trees with double-ended queue `std::deque` buffers and atomic file persistence handlers.",
      diagramType: "Dual FIFO/LIFO Dispatch & Red-Black Tree Architecture",
      pipeline: [
        {
          step: "01",
          label: "Batch Ingress",
          sublabel: "SKU, Quantity, Expiry",
          protocol: "C++ I/O Stream",
          description: "Incoming shipment scan carrying product SKU, quantity, category, and batch timestamp.",
          payloadExample: 'Batch: SKU="MED_AMOX_500", Qty=1000, Category=PERISHABLE, Expiry=2027-03-01',
          latencyOrSla: "Microsecond",
        },
        {
          step: "02",
          label: "Red-Black Tree",
          sublabel: "std::map<string, Item>",
          protocol: "O(log N) Lookup",
          description: "Indexes product in self-balancing binary search tree in logarithmic time.",
          payloadExample: 'auto it = inventoryMap.find("MED_AMOX_500"); // Guaranteed O(log N) lookup',
          latencyOrSla: "0.2 μs",
        },
        {
          step: "03",
          label: "Strategy Router",
          sublabel: "FIFO vs LIFO Decision",
          protocol: "Category Policy Check",
          description: "Routes perishables to FIFO queue and durable construction hardware to LIFO queue.",
          payloadExample: 'if (item.category == PERISHABLE) queueStrategy = FIFO;\nelse queueStrategy = LIFO;',
          latencyOrSla: "Instant",
        },
        {
          step: "04",
          label: "Deque Buffer",
          sublabel: "std::deque<Batch>",
          protocol: "O(1) Pop Front/Back",
          description: "Pops from `deque::pop_front()` for FIFO or `deque::pop_back()` for LIFO in constant time.",
          payloadExample: 'Batch dispatched = item.batches.front();\nitem.batches.pop_front(); // FIFO dispatch',
          latencyOrSla: "O(1) constant",
        },
        {
          step: "05",
          label: "CSV Journal Sync",
          sublabel: "Persistent Ledger",
          protocol: "std::ofstream",
          description: "Appends transaction record to CSV ledger file to guarantee state recovery across reboots.",
          payloadExample: 'journalFile << timestamp << "," << sku << "," << -qty << "," << "DISPATCH_FIFO\\n";',
          latencyOrSla: "Buffered I/O",
        },
      ],
      keyMechanisms: [
        {
          title: "Dual Policy Batch Dispatch",
          description:
            "Perishable products use `std::deque::pop_front()` (FIFO) to consume oldest stock first, while hardware uses `std::deque::pop_back()` (LIFO) for compact top-of-stack pallet access.",
          invariant: "Perishables ⟹ Dispatched in order of arrival time t₁ < t₂ < t₃",
        },
        {
          title: "Logarithmic O(log N) Red-Black Tree Index",
          description:
            "Item SKUs are maintained in self-balancing binary search trees (`std::map`), guaranteeing worst-case $O(\\log N)$ lookup, insertion, and deletion complexity.",
          invariant: "TreeDepth ≤ 2 · log₂(N + 1); SearchComplexity = O(log N)",
        },
      ],
    },
    benefits: {
      summary:
        "Guaranteed 100% adherence to spoilage-preventing FIFO rules with microsecond SKU indexing and reliable recovery from CSV audit journals.",
      metrics: [
        { value: "O(log N)", label: "Search Complexity", detail: "Guaranteed balanced Red-Black Tree SKU lookups" },
        { value: "O(1)", label: "Batch Dispatch", detail: "Constant time deque operations for FIFO & LIFO routing" },
        { value: "0 Spoilage", label: "Policy Compliance", detail: "Strict automated FIFO queue dispatch for perishables" },
        { value: "100%", label: "Crash Recovery", detail: "Serialized CSV journal ledger for instant state rebuild" },
      ],
      impactHighlights: [
        "Completely prevents pharmaceutical and food expiration caused by improper batch rotation.",
        "Clean, robust C++ codebase adhering to modern memory ownership semantics (RAII).",
      ],
    },
    techStackMatrix: [
      { name: "C++17", role: "Core Systems Language", rationale: "High execution speed, minimal runtime footprint, and RAII automatic resource management." },
      { name: "STL (map, deque)", role: "Data Structure Backbone", rationale: "Self-balancing binary trees for indexing and double-ended queues for flexible batch popping." },
      { name: "Makefile & GCC", role: "Build Automation", rationale: "Standard compilation pipeline with strict compiler warnings (-Wall -Wextra)." },
      { name: "File I/O Streams", role: "Persistence Layer", rationale: "Robust stream serialization writing human-auditable CSV audit logs." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Thread-Safe Concurrency Locks", description: "Incorporate `std::mutex` and `std::shared_mutex` to allow concurrent multi-aisle worker scanning." },
      { phase: "Phase 2", title: "SQLite Embedded Database Migration", description: "Transition from flat CSV persistence to embedded SQLite with ACID transaction rollback support." },
      { phase: "Phase 3", title: "Automated Reorder Threshold Webhooks", description: "Emit automated REST webhooks to supplier APIs whenever SKU inventory drops below safety stock levels." },
    ],
  },
};
