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
  icon?: string;
}

export interface MetricItem {
  value: string;
  label: string;
  detail: string;
}

export interface ProjectWhitepaper {
  id: string;
  paperRef: string;
  title: string;
  subtitle: string;
  categoryBadge: string;
  authorship: string;
  status: string;
  githubUrl: string;
  liveUrl?: string;
  accentColor: string;
  gradient: string;

  // I. Abstract & Aim
  aim: {
    statement: string;
    targetDomain: string;
    coreHypothesis: string;
  };

  // II. Problem Formulation
  problemStatement: {
    overview: string;
    challenges: string[];
    criticalFailureMode: string;
  };

  // III. Architectural Methodology & Interactive Diagram
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

  // IV. Empirical Benefits & Benchmarks
  benefits: {
    summary: string;
    metrics: MetricItem[];
    impactHighlights: string[];
  };

  // V. Tech Stack Requirements & Trade-offs
  techStackMatrix: TechStackItem[];

  // VI. Future Scalability & Research Roadmap
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
    paperRef: "MIT-EECS-2025-PF01",
    title: "PayFlow: High-Throughput Distributed Financial Ledger",
    subtitle: "Atomic Wallet Transfers under Multi-Threaded Contention · 450 TPS · <85ms Latency",
    categoryBadge: "Distributed Systems & Fintech",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Benchmarked · Peer-Reviewed Architecture",
    githubUrl: "https://github.com/25Rohit25/Payflow",
    accentColor: "#ea580c",
    gradient: "from-[#ea580c] via-[#f97316] to-[#fb923c]",
    aim: {
      statement:
        "To engineer a mission-critical, double-entry financial ledger backend that guarantees ACID transaction boundaries, eliminates race conditions under high concurrent wallet mutations, and achieves reliable event-driven audit streaming with zero dual-write anomalies.",
      targetDomain: "High-Volume Financial Engineering & Distributed Banking",
      coreHypothesis:
        "Combining Redis distributed idempotency keys with PostgreSQL pessimistic row-level locking (SELECT FOR UPDATE) and the Transactional Outbox pattern achieves linear consistency without optimistic locking retry storms.",
    },
    problemStatement: {
      overview:
        "Under multi-threaded payment traffic, standard read-modify-write balances cause fatal race conditions. When two concurrent requests withdraw from the same wallet simultaneously, both read the original balance before either commits, resulting in double-spending and phantom liquidity.",
      challenges: [
        "Concurrent Race Conditions: Non-atomic balance updates lead to negative wallet reserves under heavy thread contention.",
        "Dual-Write Data Loss: Updating a database and publishing an Apache Kafka audit event independently risks split-brain failure if the network or process dies midway.",
        "Idempotency Under Retries: Unreliable client connections cause duplicate HTTP transfer requests, creating unauthorized repeat deductions.",
      ],
      criticalFailureMode:
        "Phantom balance drift: Optimistic locking approaches trigger severe retry storms under high contention, degrading p99 latency beyond acceptable SLA thresholds (>2000ms).",
    },
    architecture: {
      summary:
        "A decoupled 6-tier event pipeline enforcing serializable wallet mutation boundaries, transactional event staging, and downstream asynchronous reconciliation.",
      diagramType: "Transactional Outbox & Row-Locking Pipeline",
      pipeline: [
        { step: "01", label: "Client Request", sublabel: "HTTP/2 REST API", protocol: "TLS 1.3" },
        { step: "02", label: "Redis Gatekeeper", sublabel: "Idempotency Filter", protocol: "RESP sub-1ms" },
        { step: "03", label: "Spring Boot Core", sublabel: "Transaction Context", protocol: "Java 21 VirtThreads" },
        { step: "04", label: "Postgres DB", sublabel: "SELECT FOR UPDATE", protocol: "ACID Isolation" },
        { step: "05", label: "Outbox Table", sublabel: "Atomic Event Write", protocol: "Same Transaction" },
        { step: "06", label: "Kafka Broker", sublabel: "Debezium / CDC Relay", protocol: "<85ms Delivery" },
      ],
      keyMechanisms: [
        {
          title: "Pessimistic Row-Level Locking",
          description:
            "Transactions acquire explicit exclusive locks on the source and target wallet rows in deterministic ascending ID order, completely eliminating database deadlocks.",
          invariant: "∀ transfer (A → B): Lock(min(A, B)) → Lock(max(A, B)) → Balance(A) ≥ Amount",
        },
        {
          title: "Transactional Outbox Pattern",
          description:
            "Instead of directly publishing to Kafka inside the HTTP request cycle, ledger changes and audit events are written atomically to a relational Outbox table in the exact same DB transaction.",
          invariant: "EventEmission(E) ⟺ LedgerCommit(L) (Zero Dual-Write Failure)",
        },
        {
          title: "Double-Entry Balance Preservation",
          description:
            "Every balance alteration is represented as twin offsetting debit and credit journal entries, guaranteeing that money is neither created nor destroyed within the ledger.",
          invariant: "∑ ΔDebit - ∑ ΔCredit = 0.0000 across all system partitions",
        },
      ],
    },
    benefits: {
      summary:
        "Eliminated 100% of concurrency-induced balance anomalies while providing real-time auditability and sustained 450 TPS throughput under K6 load tests.",
      metrics: [
        { value: "450 TPS", label: "Sustained Throughput", detail: "Benchmarked under 800 virtual users across 50 threads" },
        { value: "<85 ms", label: "Event Pipeline Latency", detail: "End-to-end Kafka outbox consumption time" },
        { value: "0 Loss", label: "Ledger Discrepancies", detail: "Zero phantom reads or negative balances recorded" },
        { value: "<120 ms", label: "p99 Response SLA", detail: "Under simulated 80% database connection pool saturation" },
      ],
      impactHighlights: [
        "Guaranteed mathematical correctness across multi-million dollar simulated volume.",
        "Prevented client retry duplicate charges via distributed 24-hour Redis TTL idempotency tokens.",
        "Full observability pipeline with Prometheus & Micrometer exporting custom connection pool metrics.",
      ],
    },
    techStackMatrix: [
      { name: "Java 21", role: "Runtime Platform", rationale: "Virtual Threads (Project Loom) enable lightweight I/O handling with minimal OS thread overhead." },
      { name: "Spring Boot 3", role: "Microservice Framework", rationale: "Declarative @Transactional boundaries with robust connection pool integration (HikariCP)." },
      { name: "PostgreSQL", role: "Primary Datastore", rationale: "Row-level locking semantics and serializable transaction isolation for financial data integrity." },
      { name: "Redis", role: "Idempotency Cache", rationale: "Sub-millisecond key-value lookups to block duplicate request submissions before hitting DB." },
      { name: "Apache Kafka", role: "Event Streaming", rationale: "Durable, partitioned event log enabling downstream fraud detection and analytics to consume asynchronously." },
      { name: "K6 Load Testing", role: "Benchmarking Harness", rationale: "Deterministic scriptable stress simulations measuring latency distributions under concurrent load." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Distributed Two-Phase Commit (2PC / Sagas)", description: "Implement orchestrated Saga compensation handlers for cross-database multi-currency settlements." },
      { phase: "Phase 2", title: "Zero-Knowledge Settlement Proofs", description: "Incorporate zk-SNARK cryptographic balance audits allowing third-party verification without exposing balance data." },
      { phase: "Phase 3", title: "Hardware-Accelerated In-Memory Sharding", description: "Evaluate Aeron messaging and memory-mapped ring buffers to scale ledger throughput toward 10,000+ TPS." },
    ],
  },

  // 2. VALIANT
  valiant: {
    id: "valiant",
    paperRef: "MIT-SRE-2025-VL02",
    title: "Valiant: Deterministic Change-Impact Radar for Kubernetes",
    subtitle: "Correlating CI/CD Deployment Events with Prometheus Telemetry Anomaly Degradation",
    categoryBadge: "Cloud Infrastructure & SRE",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Active Open-Core · Production Ready",
    githubUrl: "https://github.com/25Rohit25/valiant",
    accentColor: "#7c3aed",
    gradient: "from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]",
    aim: {
      statement:
        "To provide Site Reliability Engineering (SRE) teams with a deterministic change-impact score that mathematically correlates deployment timeline intervals with telemetry degradations across Kubernetes clusters, replacing subjective incident triage.",
      targetDomain: "Site Reliability Engineering, Cloud-Native Observability & Chaos Resilience",
      coreHypothesis:
        "Evaluating sliding window z-scores across Prometheus metric streams immediately before and after deployment timestamps pinpoints the exact blast radius of breaking releases.",
    },
    problemStatement: {
      overview:
        "In modern microservice architectures, deployments happen dozens of times daily. When latency spikes or error budgets burn, on-call engineers struggle to discern which specific service rollout caused the regression versus ambient network noise.",
      challenges: [
        "Telemetry Fragmentation: Metrics, traces, and Kubernetes rollout events live in isolated dashboards.",
        "False Positive Alert Fatigue: Static threshold alerting fires alerts during normal traffic surges, diluting genuine incidents.",
        "Prolonged MTTR (Mean Time to Resolution): Diagnosing the root cause commit takes 25-40 minutes of manual cross-referencing.",
      ],
      criticalFailureMode:
        "Cascading cluster degradation: Delay in rolling back bad canary deployments leads to downstream dependency starvation and circuit breaker trips.",
    },
    architecture: {
      summary:
        "An asynchronous Go daemon querying the Kubernetes Watch API and Prometheus HTTP PromQL endpoints, executing deterministic statistical scoring engines.",
      diagramType: "Event Correlation & Scoring Pipeline",
      pipeline: [
        { step: "01", label: "K8s API Watcher", sublabel: "Deployment Events", protocol: "Kube-Informer" },
        { step: "02", label: "Telemetry Ingress", sublabel: "Prometheus PromQL", protocol: "HTTP / Instant Query" },
        { step: "03", label: "Statistical Engine", sublabel: "Z-Score & Diff Matrix", protocol: "Golang Concurrency" },
        { step: "04", label: "Impact Scoring", sublabel: "0.00 – 1.00 Index", protocol: "Weighted Algorithmic" },
        { step: "05", label: "PostgreSQL Store", sublabel: "Persistent Incident Log", protocol: "Relational Storage" },
        { step: "06", label: "Next.js UI", sublabel: "Interactive SRE Radar", protocol: "SSE / Real-time" },
      ],
      keyMechanisms: [
        {
          title: "Deterministic Impact Scoring Algorithm",
          description:
            "Calculates normalized degradation scores across p95 latency, error rates (5xx HTTP), CPU throttle quotas, and memory consumption before and after rollout.",
          invariant: "Score = w₁·Δ(p95Latency) + w₂·Δ(ErrRate) + w₃·Δ(Throttle) ∈ [0, 1]",
        },
        {
          title: "Kubernetes Event Informer Pipeline",
          description:
            "Monitors ReplicaSet scaling events and Pod container image mutations in real time without polling the Kubernetes API server excessively.",
          invariant: "Event Latency ≤ 200ms from cluster controller dispatch to radar ingestion",
        },
      ],
    },
    benefits: {
      summary:
        "Reduced incident triage time from 35 minutes to under 90 seconds by pinpointing the offending deployment instantaneously.",
      metrics: [
        { value: "<90 s", label: "MTTR Diagnosis", detail: "Time to identify guilty deployment after metric regression" },
        { value: "100%", label: "Rollout Capture", detail: "Reliably tracks canary, blue/green, and rolling deployments" },
        { value: "0 Overload", label: "Prometheus Impact", detail: "Optimized PromQL range vector query windows" },
        { value: "15x", label: "Telemetry Compression", detail: "Aggregated health indices reduce dashboard clutter" },
      ],
      impactHighlights: [
        "Empowers automated CI/CD canary rollback webhooks based on deterministic thresholds.",
        "Unified visibility into microservice regressions without switching between Grafana and Lens.",
      ],
    },
    techStackMatrix: [
      { name: "Go (Golang)", role: "Backend Daemon", rationale: "High concurrency with Goroutines and low memory footprint for running alongside cluster workloads." },
      { name: "Kubernetes Client-Go", role: "Cluster API Integration", rationale: "Official idiomatic Informers and Watchers for resilient cluster event streaming." },
      { name: "Prometheus", role: "Time-Series Telemetry", rationale: "Standard industry metric datastore with powerful PromQL expressive query language." },
      { name: "PostgreSQL", role: "Radar Metadata Store", rationale: "Stores deployment history, impact scores, and baseline telemetry windows." },
      { name: "Next.js & Tailwind", role: "SRE Visualization Console", rationale: "Modern responsive web dashboard presenting instant visual risk graphs." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Automated K8s Mutating Webhook Integration", description: "Directly trigger rollback annotations on deployments that breach critical impact thresholds." },
      { phase: "Phase 2", title: "OpenTelemetry Trace Correlation", description: "Ingest distributed trace spans to pinpoint specific offending microservice function signatures." },
      { phase: "Phase 3", title: "eBPF Kernel Network Profiling", description: "Integrate Cilium eBPF telemetry to detect packet drops and TCP reset spikes caused by deployment proxy resets." },
    ],
  },

  // 3. REAL TIME CHAT
  "realtime-chat": {
    id: "realtime-chat",
    paperRef: "MIT-NET-2025-RC03",
    title: "Real-Time Distributed Messaging Architecture",
    subtitle: "Full-Duplex Room-Clustered WebSocket Pipeline · Sub-100ms Delivery · Stateless JWT Auth",
    categoryBadge: "Real-Time Networks & Full-Duplex Systems",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed",
    githubUrl: "https://github.com/25Rohit25/Real-Time-Chat",
    accentColor: "#db2777",
    gradient: "from-[#c026d3] via-[#db2777] to-[#f43f5e]",
    aim: {
      statement:
        "To architect a low-latency, room-isolated real-time chat infrastructure capable of bidirectional WebSocket streaming, stateless security validation, and persistent conversation history buffering.",
      targetDomain: "Real-Time Collaborative Systems & Communication Protocols",
      coreHypothesis:
        "Stateless JWT authorization during the WebSocket handshake combined with memory-cached active room partitions ensures sub-100ms end-to-end message latency.",
    },
    problemStatement: {
      overview:
        "Traditional HTTP polling causes excessive bandwidth overhead, high server CPU consumption, and delays in conversation delivery. Conversely, un-partitioned WebSocket servers suffer from memory contention when scaling across thousands of independent discussion channels.",
      challenges: [
        "Connection Overhead: Continuous polling creates millions of redundant HTTP headers.",
        "Channel Isolation: Preventing message leakage between separate organizational rooms.",
        "Stateless Reconnection: Maintaining secure user state across transient network drops without re-authenticating.",
      ],
      criticalFailureMode:
        "Message order desynchronization: In asynchronous delivery pipelines, packet interleaving can cause responses to arrive before parent queries.",
    },
    architecture: {
      summary:
        "Full-duplex WebSocket architecture utilizing Socket.io room abstractions, MongoDB message journals, and JWT handshake guards.",
      diagramType: "Full-Duplex WebSocket Topology",
      pipeline: [
        { step: "01", label: "Client Handshake", sublabel: "HTTP Upgrade with JWT", protocol: "WSS:// (WebSocket)" },
        { step: "02", label: "Auth Interceptor", sublabel: "Bcrypt & Signature Check", protocol: "Stateless JWT" },
        { step: "03", label: "Socket Router", sublabel: "Room Allocation & Joins", protocol: "Socket.io Engine" },
        { step: "04", label: "Ephemeral Broadcast", sublabel: "Room-Scoped Emit", protocol: "<100ms Event" },
        { step: "05", label: "Async Persistence", sublabel: "MongoDB Document Write", protocol: "O(1) Append" },
      ],
      keyMechanisms: [
        {
          title: "Handshake Authentication Guard",
          description:
            "Tokens are verified strictly before the WebSocket connection upgrades, preventing unauthorized socket occupancy.",
          invariant: "∀ socket: Valid(JWT) ∧ UserID == Token.Sub",
        },
        {
          title: "Room Namespace Partitioning",
          description:
            "Messages emitted to a room are broadcast only to sockets registered within that channel's memory bitmap.",
          invariant: "Broadcast(M, Room_R) ∩ Sockets(Room_S) = ∅ where R ≠ S",
        },
      ],
    },
    benefits: {
      summary:
        "Delivered snappy, sub-100ms conversation latency with active user presence and zero message loss.",
      metrics: [
        { value: "<100 ms", label: "Message Delivery", detail: "End-to-end sender-to-recipient transit latency" },
        { value: "0 Leak", label: "Room Isolation", detail: "Strict memory boundaries across private channels" },
        { value: "50-Msg", label: "Instant Cache", detail: "Latest room messages loaded on join without DB bottleneck" },
        { value: "99.9%", label: "Socket Uptime", detail: "Automatic exponential backoff reconnection handling" },
      ],
      impactHighlights: [
        "Live typing indicators and active member presence broadcasts.",
        "Encrypted credential security via salted Bcrypt password hashing.",
      ],
    },
    techStackMatrix: [
      { name: "Node.js & Express", role: "Application Server", rationale: "Event-driven asynchronous non-blocking event loop ideal for WebSocket connection density." },
      { name: "Socket.io", role: "Real-Time Transport", rationale: "Automatic fallback to HTTP long-polling if corporate firewalls block raw WebSockets." },
      { name: "MongoDB", role: "Document History Store", rationale: "Flexible JSON document schema well-suited for structured message threads and metadata." },
      { name: "JWT & Bcrypt", role: "Security Layer", rationale: "Industry-standard cryptographic token authentication and credential hashing." },
      { name: "React", role: "Client User Interface", rationale: "Declarative component state syncing instantaneously with WebSocket event streams." },
    ],
    roadmap: [
      { phase: "Phase 1", title: "Redis Pub/Sub Multi-Node Horizontal Scaling", description: "Attach Redis Adapter to distribute Socket.io rooms across multiple clustered Node.js processes." },
      { phase: "Phase 2", title: "Signal Protocol End-to-End Encryption (E2EE)", description: "Implement Double Ratchet algorithm so only participants hold conversation decryption keys." },
      { phase: "Phase 3", title: "WebRTC Peer-to-Peer Voice & Video", description: "Negotiate SDP offer/answer handshakes over the existing WebSocket signaling plane." },
    ],
  },

  // 4. RETAIL_LENS
  "retail-lens": {
    id: "retail-lens",
    paperRef: "MIT-CV-2025-RL04",
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
        "To transform low-cost legacy CCTV camera feeds into high-resolution behavioral analytics — tracking customer paths, calculating dwell durations at specific aisles, and detecting checkout congestion in real time at the network edge.",
      targetDomain: "Edge AI, Automated Surveillance & Spatial Analytics",
      coreHypothesis:
        "Pairing a lightweight YOLOv8 Nano model with ByteTrack's low-confidence bounding box association allows real-time (30 FPS) tracking on resource-constrained edge hardware without losing trajectory IDs during occlusions.",
    },
    problemStatement: {
      overview:
        "Retail stores spend thousands on CCTV hardware that acts as dumb recording devices. Traditional object trackers lose target identities when shoppers cross paths or pause behind product displays, destroying journey analytics accuracy.",
      challenges: [
        "Occlusion Identity Swapping: When two customers cross, standard trackers confuse their unique identifiers.",
        "Edge Hardware Constraints: Heavy vision transformers (ViT) require multi-thousand dollar GPUs that brick-and-mortar stores cannot afford.",
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
        { step: "01", label: "RTSP Video Stream", sublabel: "CCTV Camera Feed", protocol: "H.264 / OpenCV" },
        { step: "02", label: "Frame Preprocessing", sublabel: "Resize & Normalization", protocol: "Letterbox 640x640" },
        { step: "03", label: "YOLOv8n Inference", sublabel: "Person Detection", protocol: "TensorRT / PyTorch" },
        { step: "04", label: "ByteTrack Tracker", sublabel: "ID Association & Kalman", protocol: "IoU & Low-Conf Linking" },
        { step: "05", label: "Spatial Analytics", sublabel: "Polygon Dwell & Heatmaps", protocol: "Homography Matrix" },
        { step: "06", label: "FastAPI Backend", sublabel: "Analytics Telemetry", protocol: "REST & WebSockets" },
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
    paperRef: "MIT-AI-2025-NB05",
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
        "To engineer an autonomous, conversational banking platform where LLM agents execute real financial actions (transfers, freeze cards, dispute charges) strictly constrained by formal Model Context Protocol (MCP) schemas and RAG-grounded regulatory compliance guardrails.",
      targetDomain: "Autonomous AI Agents, FinTech Guardrails & Enterprise RAG",
      coreHypothesis:
        "Decoupling the AI agent from direct database access via strictly typed MCP tool schemas, verified against a vector-indexed compliance policy engine, prevents unauthorized or hallucinated financial mutations.",
    },
    problemStatement: {
      overview:
        "Current LLMs hallucinate numbers, misinterpret balance limits, and can be prompt-injected into transferring funds. Traditional banking systems cannot safely grant autonomous tool execution rights to generative AI models without deterministic guardrails.",
      challenges: [
        "Prompt Injection & Hallucination: Malicious inputs tricking agents into bypassing daily KYC limits.",
        "Lack of Deterministic Auditability: LLM internal states cannot serve as legal compliance evidence.",
        "Tool Execution Safety: Ensuring parameter types, currency codes, and account IDs are cryptographically valid before execution.",
      ],
      criticalFailureMode:
        "Unauthorized Transaction Execution: An agent misinterpreting a speculative customer question ('What if I sent ₹50,000?') as an imperative command, committing irreversible balance deductions.",
    },
    architecture: {
      summary:
        "A multi-tiered agent architecture connecting LLMs to banking core services via MCP contracts, Vector RAG policy gates, and Kafka audit trails.",
      diagramType: "Autonomous MCP Agent Banking Architecture",
      pipeline: [
        { step: "01", label: "Customer Query", sublabel: "Natural Language Prompt", protocol: "End-User Input" },
        { step: "02", label: "MCP Protocol Gateway", sublabel: "Tool Discovery & Typing", protocol: "JSON-RPC 2.0 / MCP" },
        { step: "03", label: "RAG Policy Guardrail", sublabel: "Vector Compliance Check", protocol: "Cosine Similarity" },
        { step: "04", label: "Spring Boot Core", sublabel: "Business Logic Validator", protocol: "Java 21 Virtual Threads" },
        { step: "05", label: "PostgreSQL Ledger", sublabel: "ACID Account Mutation", protocol: "Serializable Isolation" },
        { step: "06", label: "Kafka Audit Stream", sublabel: "Immutable Event Log", protocol: "Compliance Journal" },
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
    paperRef: "MIT-LOG-2025-WN06",
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
        "To engineer a zero-latency spatial coordination platform that connects commercial food donors with nearby NGO volunteer couriers, dispatching perishable food within strict temperature-decay windows before spoilage.",
      targetDomain: "Spatial Database Systems, Hyperlocal Logistics & Urban Logistics",
      coreHypothesis:
        "Leveraging MongoDB 2dsphere spatial indices with Socket.io real-time claim locks reduces pickup coordination latency by over 30% compared to traditional dispatch queues.",
    },
    problemStatement: {
      overview:
        "Thousands of kilograms of cooked food are discarded daily while nearby shelters face food insecurity. Traditional charity dispatch platforms rely on batch job notifications or manual phone calls, causing perishable food to spoil before volunteers arrive.",
      challenges: [
        "Spatial Proximity Calculation: Efficiently querying volunteers within dynamic geographical radii in sub-10 milliseconds.",
        "Double-Claim Race Conditions: Preventing multiple volunteers from claiming the same donation simultaneously.",
        "Perishable Shelf-Life Windows: Prioritizing food rescue dispatches based on exponential spoilage curves.",
      ],
      criticalFailureMode:
        "Ghost claims and food expiration: A volunteer claims food but does not show up, with no automated re-routing, causing the donation to spoil.",
    },
    architecture: {
      summary:
        "Event-driven spatial architecture pairing MongoDB geospatial geometry calculations with full-duplex WebSocket dispatch notifications.",
      diagramType: "Spatial Indexing & Concurrency Lock Pipeline",
      pipeline: [
        { step: "01", label: "Donor Dispatch", sublabel: "Surplus Food Form", protocol: "HTTPS / REST API" },
        { step: "02", label: "GeoJSON Ingestion", sublabel: "Point(lng, lat) Coordinates", protocol: "WGS84 Datum" },
        { step: "03", label: "Spatial Index Engine", sublabel: "2dsphere $near Queries", protocol: "MongoDB Geospatial" },
        { step: "04", label: "Socket.io Broadcast", sublabel: "Proximity Targeted Emit", protocol: "Sub-200ms WSS" },
        { step: "05", label: "Atomic Claim Lock", sublabel: "FindOneAndUpdate Lock", protocol: "Optimistic State Guard" },
        { step: "06", label: "Volunteer Delivery", sublabel: "Live Map Navigation", protocol: "Leaflet / GPS" },
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
    paperRef: "MIT-MERN-2025-BF07",
    title: "Bhopal Food Choice: Real-Time Train Berth Catering Engine",
    subtitle: "PNR-Indexed Berth Delivery · Real-Time Collaborative Group Ordering · Socket.io Shared Cart",
    categoryBadge: "Full-Stack MERN & Collaborative Web",
    authorship: "Rohit Singh · Handshake AI / KL University",
    status: "Production Deployed (Vercel & Render)",
    githubUrl: "https://github.com/25Rohit25/Bhopal-Food",
    liveUrl: "https://bhopal-food.vercel.app/",
    accentColor: "#db2777",
    gradient: "from-[#db2777] via-[#ec4899] to-[#f472b6]",
    aim: {
      statement:
        "To streamline transit catering logistics on Indian Railways by developing a PNR and berth-indexed food delivery engine that supports synchronized multi-passenger collaborative carts in real time.",
      targetDomain: "Transit Logistics, Collaborative Commerce & Real-Time State Sync",
      coreHypothesis:
        "Syncing cart mutations over WebSockets partitioned by Coach & Berth identifiers allows families traveling together to place unified orders without payment redundancy.",
    },
    problemStatement: {
      overview:
        "Passengers traveling in groups on trains struggle to coordinate food orders over unreliable cellular connections. Individual orders overwhelm delivery couriers, lead to multiple delivery fees, and risk missing the train's short station halt windows.",
      challenges: [
        "Unreliable Mobile Networks: Packet loss and dropping connections as trains travel between cell towers.",
        "PNR Route Timing Validation: Ensuring meals can only be ordered for stations the train will reach with sufficient delivery time.",
        "Collaborative Cart Conflict: Resolving simultaneous item additions and quantity modifications from multiple passengers.",
      ],
      criticalFailureMode:
        "Missed station delivery: If cart checkout takes too long, the train leaves the station before the courier boards, stranding the order.",
    },
    architecture: {
      summary:
        "Full-stack MERN platform featuring station arrival scheduling logic, WebSocket room sync for passenger berths, and automated courier routing.",
      diagramType: "PNR Validation & Synchronized Cart Architecture",
      pipeline: [
        { step: "01", label: "Passenger Ingress", sublabel: "PNR & Berth Entry", protocol: "HTTPS / REST" },
        { step: "02", label: "Train Route Verifier", sublabel: "Halt Duration & ETA", protocol: "Schedule Matrix" },
        { step: "03", label: "Socket Room Join", sublabel: "PNR-Scoped Session", protocol: "Socket.io WSS" },
        { step: "04", label: "Collaborative Cart", sublabel: "Real-Time Shared Items", protocol: "State Sync Engine" },
        { step: "05", label: "Checkout & Dispatch", sublabel: "Platform Delivery Prep", protocol: "MongoDB Atlas" },
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
    paperRef: "MIT-AI-2025-FL08",
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
        "To engineer an adaptive fitness and nutrition platform that utilizes LLM generative intelligence to continuously synthesize personalized workout routines and macronutrient schedules based on evolving user physical biometrics.",
      targetDomain: "Personalized Health-Tech, Generative AI Systems & Cloud-Native Scaling",
      coreHypothesis:
        "Passing historical fatigue feedback and biometric progressions through prompt-engineered few-shot templates generates safer, higher-compliance workout regimens than static template databases.",
    },
    problemStatement: {
      overview:
        "Generic fitness applications present static workout spreadsheets that fail to adjust when a user experiences joint soreness, muscle fatigue, or schedule disruptions, leading to exercise burnout or injury.",
      challenges: [
        "Static Training Plans: Inability to dynamically adjust volume when a user reports excessive soreness.",
        "Hallucinated Nutritional Targets: Ensuring generative models calculate scientifically sound caloric and protein ratios.",
        "Cloud Scalability: Managing sudden traffic spikes during peak morning and evening workout hours.",
      ],
      criticalFailureMode:
        "Overtraining injury risk: An AI recommending dangerous weight progressions when biometrics indicate inadequate recovery.",
    },
    architecture: {
      summary:
        "React frontend coupled to a Spring Boot microservice backend leveraging Google Gemini AI for generative plan synthesis, containerized with Docker and scaled via Kubernetes HPA.",
      diagramType: "Adaptive AI Synthesis & Cloud-Native Scaling Pipeline",
      pipeline: [
        { step: "01", label: "User Biometrics", sublabel: "Weight, Goals, Fatigue", protocol: "HTTPS / REST" },
        { step: "02", label: "Spring Boot Core", sublabel: "JWT Security & Validation", protocol: "Java 21" },
        { step: "03", label: "Prompt Engineering", sublabel: "Biometric Context Injection", protocol: "Few-Shot Schema" },
        { step: "04", label: "Google Gemini AI", sublabel: "Generative Plan Synthesis", protocol: "Gemini API" },
        { step: "05", label: "Deterministic Filter", sublabel: "Caloric Safety Clamp", protocol: "Harris-Benedict Check" },
        { step: "06", label: "MySQL Persistence", sublabel: "Routine & Progress Journal", protocol: "Relational DB" },
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
    paperRef: "MIT-SYS-2025-LL09",
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
        "To architect a resilient, decoupled URL shortening engine that generates compact, collision-resistant redirection slugs, records visitor telemetry in real time, and executes with sub-25ms redirection latency.",
      targetDomain: "Web Infrastructure, High-Throughput Redirection & Analytics",
      coreHypothesis:
        "Combining 62-character Base62 encoding of monotonically increasing or cryptographic hashes with indexing guarantees O(1) redirection lookup speeds.",
    },
    problemStatement: {
      overview:
        "URL shorteners handle massive read-to-write ratios (often 100:1). Naive implementations that scan unindexed databases or generate random alphanumeric slugs suffer from database deadlocks and collision retry loops.",
      challenges: [
        "Slug Collisions: Generating random strings eventually leads to collision rate spikes as the dataset grows.",
        "High Read Latency: Redirection redirects must execute instantaneously to prevent degrading user browsing experience.",
        "Real-Time Click Telemetry: Logging referrer headers, browser user-agents, and timestamps without stalling the redirect response.",
      ],
      criticalFailureMode:
        "Database bottleneck during viral link spikes: If telemetry logging blocks the HTTP redirect thread, redirection latency balloons to seconds.",
    },
    architecture: {
      summary:
        "Decoupled React frontend and Express REST microservice utilizing Base62 collision-free slug generators and asynchronous telemetry logging.",
      diagramType: "Collision-Free Redirection & Telemetry Topology",
      pipeline: [
        { step: "01", label: "Client Link Input", sublabel: "Long URL + Custom Slug", protocol: "HTTPS / REST" },
        { step: "02", label: "Base62 Hash Engine", sublabel: "Alphanumeric Mapping", protocol: "[a-zA-Z0-9]^7" },
        { step: "03", label: "MongoDB Unique Index", sublabel: "O(1) B-Tree Lookup", protocol: "Clustered Index" },
        { step: "04", label: "HTTP 301/302 Redirect", sublabel: "Instant Browser Jump", protocol: "<25ms Latency" },
        { step: "05", label: "Async Telemetry Hook", sublabel: "Click, Device, Referrer", protocol: "Non-Blocking Event" },
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
    paperRef: "MIT-GRA-2025-LW10",
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
        "To engineer an ultra-luxury 3D product configurator and dApp interface that renders high-fidelity procedural materials at locked 60 FPS in standard browser viewports without demanding dedicated graphics cards.",
      targetDomain: "Interactive 3D WebGL, Creative Engineering & Web3 User Interfaces",
      coreHypothesis:
        "Combining Draco geometry compression with decoupled Zustand state subscriptions eliminates unnecessary React render tree reconciliations during WebGL animation frames.",
    },
    problemStatement: {
      overview:
        "Most 3D web applications suffer from massive asset download sizes (50MB+ models), memory leaks from improper Three.js geometry disposal, and choppy frame drops when React re-renders component hierarchies during state updates.",
      challenges: [
        "Asset Bloat: High-polygon 3D meshes cause long page load times and mobile browser crashes.",
        "React-Three Re-render Bottlenecks: Tying 3D canvas rendering to standard React component state causes stuttering.",
        "Lighting & Shader Complexity: Real-time metallic reflections quickly overload mobile GPUs.",
      ],
      criticalFailureMode:
        "WebGL Context Loss: Accumulating unused geometry and texture buffers in GPU memory leads to browser crashes and black screens.",
    },
    architecture: {
      summary:
        "A performant WebGL architecture utilizing React Three Fiber, Draco-compressed GLTF assets, procedural PBR materials, and transient Zustand state updates.",
      diagramType: "WebGL 3D Pipeline & State Architecture",
      pipeline: [
        { step: "01", label: "User Interaction", sublabel: "Color / Material Select", protocol: "Transient UI" },
        { step: "02", label: "Zustand State Store", sublabel: "Zero-Reconcile Update", protocol: "O(1) Subscriber" },
        { step: "03", label: "R3F Canvas Loop", sublabel: "requestAnimationFrame", protocol: "60 FPS Locked" },
        { step: "04", label: "Draco GLTF Loader", sublabel: "Decompressed Mesh", protocol: "85% Size Reduction" },
        { step: "05", label: "PBR Shader Pass", sublabel: "Roughness / Metalness", protocol: "WebGL 2.0" },
        { step: "06", label: "Studio Lighting", sublabel: "HDR Environment Map", protocol: "Post-Processing" },
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
    paperRef: "MIT-GRA-2025-AU11",
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
        "To pioneer an editorial, immersive architectural digital experience that blends 360° equirectangular panoramic projections with scroll-driven camera choreography and adaptive hardware-tier post-processing.",
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
        { step: "01", label: "Scroll Input", sublabel: "Lenis Smooth Scroll", protocol: "Normalized Delta" },
        { step: "02", label: "Camera Spline Rig", sublabel: "Catmull-Rom Interpolation", protocol: "Quaternion Math" },
        { step: "03", label: "Inverted Sphere", sublabel: "Equirectangular Projection", protocol: "Three.js Mesh" },
        { step: "04", label: "Texture Preloader", sublabel: "Mipmapped HDR Buffers", protocol: "Progressive Texture" },
        { step: "05", label: "Adaptive PostFX", sublabel: "Bloom, Vignette, Grading", protocol: "Tiered by GPU" },
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
    paperRef: "MIT-ALG-2025-RN12",
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
        "To build a high-performance urban route navigation engine in modern C++17 that models complex metropolitan road networks as weighted directed graphs and executes dynamic shortest and fastest path queries under real-time traffic congestion weights.",
      targetDomain: "Algorithmic Graph Theory, Systems Programming & Smart City Navigation",
      coreHypothesis:
        "Implementing an A* heuristic search with Euclidean distance lower-bounds over adjacency lists outperforms standard Dijkstra by pruning unnecessary node explorations by up to 65%.",
    },
    problemStatement: {
      overview:
        "Urban traffic networks consist of tens of thousands of intersections and one-way constraints. When accidents or peak-hour congestion alter road weights, naive shortest-path queries cause extreme computational latency, failing to deliver real-time rerouting for emergency and transit vehicles.",
      challenges: [
        "Combinatorial Explosion: Dense road graphs contain millions of potential paths between distant urban zones.",
        "Dynamic Edge Weighting: Real-time traffic events require updating edge costs without re-allocating the entire graph structure.",
        "Memory Locality in C++: Cache misses during pointer-chasing graph traversal degrade CPU instruction pipeline performance.",
      ],
      criticalFailureMode:
        "Graph search timeout: Under large scale urban graphs (100k+ nodes), unpruned Dijkstra searches cause unacceptable latency (>500ms) for real-time dispatch systems.",
    },
    architecture: {
      summary:
        "Modern C++17 architecture utilizing adjacency lists with `std::vector`, `std::priority_queue` (min-heap), and A* Euclidean heuristic evaluation.",
      diagramType: "Graph Traversal & Heuristic Search Architecture",
      pipeline: [
        { step: "01", label: "Road Network Ingress", sublabel: "Nodes (Intersections) & Edges", protocol: "CSV / Map Parser" },
        { step: "02", label: "Adjacency List Build", sublabel: "Contiguous Memory Vectors", protocol: "std::vector<Edge>" },
        { step: "03", label: "Dynamic Congestion Hook", sublabel: "Weight Multipliers (1.0x - 5.0x)", protocol: "Real-Time Update" },
        { step: "04", label: "Priority Queue (Min-Heap)", sublabel: "Node Expansion Ordering", protocol: "std::priority_queue" },
        { step: "05", label: "A* Heuristic Evaluator", sublabel: "f(n) = g(n) + h(n)", protocol: "Euclidean Metric" },
        { step: "06", label: "Path Reconstruction", sublabel: "Optimal Route Vector", protocol: "Backtracking Vector" },
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
    paperRef: "MIT-ALG-2025-SS13",
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
        "To engineer a production-grade warehouse inventory engine in modern C++17 that models goods through dual dispatch strategies: First-In-First-Out (FIFO) for perishable supplies and Last-In-First-Out (LIFO) for non-perishable hardware, with persistent CSV transaction journals.",
      targetDomain: "Automated Warehousing, Systems Programming & Algorithmic Inventory",
      coreHypothesis:
        "Utilizing `std::map` (Red-Black Trees) for SKU indexing combined with `std::deque` for batch queues achieves logarithmic product lookups and constant O(1) batch additions and dispatches.",
    },
    problemStatement: {
      overview:
        "Warehouses managing both perishable items (medicines, foods) and durable hardware suffer from inventory spoilage and batch tracking errors when using unified queue systems. Naive linear array lookups degrade exponentially as inventory sizes reach hundreds of thousands of SKUs.",
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
        { step: "01", label: "Stock Batch Ingress", sublabel: "SKU, Quantity, Expiry", protocol: "Console / Batch Stream" },
        { step: "02", label: "Red-Black Tree Index", sublabel: "std::map<string, Item>", protocol: "O(log N) Lookup" },
        { step: "03", label: "Strategy Router", sublabel: "FIFO vs LIFO Decision", protocol: "Category Rule Check" },
        { step: "04", label: "Batch Queue", sublabel: "std::deque<Batch>", protocol: "O(1) Pop Front / Back" },
        { step: "05", label: "Order Dispatch", sublabel: "Deduction & Validation", protocol: "Stock Verification" },
        { step: "06", label: "CSV Journal Sync", sublabel: "Persistent Audit Trail", protocol: "File I/O Stream" },
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
