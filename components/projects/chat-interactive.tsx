"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  room: string;
  isSelf?: boolean;
}

export function ChatSyncSimulator() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "Rohit Singh",
      text: "Hey everyone!",
      time: "10:12 AM",
      room: "general",
      isSelf: true,
    },
    {
      id: "m2",
      sender: "Priya",
      text: "Hi Rohit! How's the project going?",
      time: "10:13 AM",
      room: "general",
    },
    {
      id: "m3",
      sender: "Rohit Singh",
      text: "It's going well. I just finished the authentication flow.",
      time: "10:14 AM",
      room: "general",
      isSelf: true,
    },
    {
      id: "m4",
      sender: "Amit",
      text: "Nice! I'll work on the chat UI today.",
      time: "10:15 AM",
      room: "general",
    },
    {
      id: "m5",
      sender: "Priya",
      text: "Great, let me know if you need any help.",
      time: "10:16 AM",
      room: "general",
    },
  ]);

  const [inputVal, setInputVal] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [eventLogs, setEventLogs] = useState<string[]>([
    "[System] Socket connected: socket_id = 'ws_9a8f21' (stateless JWT verified).",
    "[System] Joined room: 'general'. Loaded latest 5 messages from MongoDB (sort: { createdAt: -1 }, limit: 50).",
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputVal.trim();
    if (!content) return;

    setInputVal("");
    setIsTyping(true);
    setActiveStep(1);

    // Step 1: typing:start emitted
    setEventLogs((prev) => [
      ...prev,
      `[0.00ms] Client emits \`typing:start\` { room: 'general', user: 'Rohit' } over WebSocket.`,
    ]);

    // Step 2: client emits chat:message
    setTimeout(() => {
      setActiveStep(2);
      setEventLogs((prev) => [
        ...prev,
        `[3.12ms] Client emits \`chat:message\` event with payload: "${content}".`,
        `[3.80ms] Node.js Express server validates JWT token signature. Identity verified: Rohit (usr_8412).`,
      ]);
    }, 800);

    // Step 3: MongoDB writes document
    setTimeout(() => {
      setActiveStep(3);
      setEventLogs((prev) => [
        ...prev,
        `[7.45ms] Mongoose writes to MongoDB: \`db.messages.insertOne({ sender: 'Rohit', room: 'general', text: '${content}' })\`.`,
        `[11.20ms] MongoDB write committed with ObjectId: 66dd9f82...`,
      ]);
    }, 1800);

    // Step 4: Room broadcast to Priya & Amit
    setTimeout(() => {
      setActiveStep(4);
      setIsTyping(false);

      const newMsg: ChatMessage = {
        id: `m_${Date.now()}`,
        sender: "Rohit Singh",
        text: content,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        room: "general",
        isSelf: true,
      };

      setMessages((prev) => [...prev, newMsg]);

      setEventLogs((prev) => [
        ...prev,
        `[14.10ms] \`io.to('general').emit('chat:message', doc)\` broadcasts to all 4 connected sockets.`,
        `[15.80ms] Priya, Amit, and Neha client UIs render message bubble instantly without page refresh!`,
      ]);
    }, 2800);

    setTimeout(() => {
      setActiveStep(0);
    }, 4500);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-7 text-slate-100 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-pink-400 uppercase tracking-wider">
            Real-Time Engine // 01
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Full-Duplex Socket.IO &amp; MongoDB Message Lifecycle
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOCKET CONNECTED: ws_9a8f21</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Chat Window & Lifecycle Event Trace */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Chat Window */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-inner">
          {/* Room Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-pink-400">#</span>
              <span className="text-xs sm:text-sm font-bold text-white">general</span>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[9px] text-slate-400">
                4 online
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">Room Partition Key: &apos;general&apos;</div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 space-y-3 min-h-[260px] max-h-[300px] overflow-y-auto font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isSelf ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-[11px] text-slate-300">
                    {m.sender}
                  </span>
                  <span className="text-[9px] text-slate-500">{m.time}</span>
                </div>
                <div
                  className={`rounded-2xl px-3.5 py-2 max-w-[85%] leading-relaxed ${
                    m.isSelf
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20 rounded-tr-xs"
                      : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono pt-1">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span>Rohit is typing (typing:start event broadcast)...</span>
              </div>
            )}
          </div>

          {/* Input & Quick Presets */}
          <div className="border-t border-slate-800 bg-slate-950/90 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message in #general..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={activeStep !== 0 && activeStep !== 4}
                className="rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-pink-500 transition-all cursor-pointer disabled:opacity-50"
              >
                Send ↗
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 font-mono">Quick Test:</span>
              <button
                type="button"
                onClick={() => handleSendMessage("Sure, thanks!")}
                className="rounded-lg bg-pink-950/60 border border-pink-700/50 px-2 py-1 text-[10px] text-pink-200 hover:bg-pink-900/60 transition-all cursor-pointer font-medium"
              >
                &quot;Sure, thanks!&quot;
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Deployment completed on staging.")}
                className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
              >
                &quot;Deployment completed&quot;
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("WebSocket heartbeat latency is 14ms.")}
                className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
              >
                &quot;Heartbeat 14ms&quot;
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Event Trace & Execution Pipeline */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Synchronous Event Journey
              </span>
              <span className="text-[10px] text-pink-400 font-bold">
                {activeStep === 0 ? "IDLE" : `STAGE 0${activeStep} ACTIVE`}
              </span>
            </div>

            <div className="space-y-2">
              <div
                className={`rounded-lg border p-2.5 transition-all ${
                  activeStep === 1
                    ? "border-pink-500 bg-pink-950/30 text-white"
                    : "border-slate-800 bg-slate-900/40 text-slate-400"
                }`}
              >
                <div className="font-bold text-[11px]">1. Client Event Emission</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Socket.IO client dispatches `typing:start` and payload packet
                </div>
              </div>

              <div
                className={`rounded-lg border p-2.5 transition-all ${
                  activeStep === 2
                    ? "border-purple-500 bg-purple-950/30 text-white"
                    : "border-slate-800 bg-slate-900/40 text-slate-400"
                }`}
              >
                <div className="font-bold text-[11px]">2. Node.js + Express Ingress</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Verifies JWT token signature and room authorization
                </div>
              </div>

              <div
                className={`rounded-lg border p-2.5 transition-all ${
                  activeStep === 3
                    ? "border-amber-500 bg-amber-950/30 text-white"
                    : "border-slate-800 bg-slate-900/40 text-slate-400"
                }`}
              >
                <div className="font-bold text-[11px]">3. MongoDB Persistence</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Mongoose saves message document to ensure survival across reconnects
                </div>
              </div>

              <div
                className={`rounded-lg border p-2.5 transition-all ${
                  activeStep === 4
                    ? "border-emerald-500 bg-emerald-950/30 text-white"
                    : "border-slate-800 bg-slate-900/40 text-slate-400"
                }`}
              >
                <div className="font-bold text-[11px]">4. Room Broadcast</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  `io.to(room).emit()` pushes packet to Priya, Amit, and Neha
                </div>
              </div>
            </div>
          </div>

          {/* Event Log Output */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5">
              Live Socket Event Stream
            </div>
            <div className="bg-black/60 rounded-lg p-2.5 max-h-[110px] overflow-y-auto text-[10px] text-emerald-400 space-y-1 font-mono">
              {eventLogs.slice(-4).map((log, idx) => (
                <div key={idx} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HttpVsSocketSimulator() {
  const [activeMode, setActiveMode] = useState<"socket" | "polling">("socket");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-pink-600 uppercase tracking-wider">
            Network Architecture // Protocol Comparison
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Why Ordinary HTTP Polling Is Not Enough for Chat
          </h4>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMode("socket")}
            className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              activeMode === "socket"
                ? "bg-pink-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ⚡ Socket.IO (WebSocket)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("polling")}
            className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
              activeMode === "polling"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            🐢 HTTP Short Polling
          </button>
        </div>
      </div>

      <div className="mt-5">
        {activeMode === "socket" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 text-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-500/20 pb-2">
                <span>FULL-DUPLEX WEBSOCKET CONNECTION</span>
                <span>SUB-15MS PUSH LATENCY</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="text-[10px] text-slate-400">Initial Handshake</div>
                  <div className="text-emerald-400 font-bold mt-1">1 HTTP Upgrade</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">HTTP/1.1 → WSS://</div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="text-[10px] text-slate-400">Per-Message Overhead</div>
                  <div className="text-emerald-400 font-bold mt-1">~2 to 6 Bytes</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Framed binary packets</div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="text-[10px] text-slate-400">Idle Network Load</div>
                  <div className="text-emerald-400 font-bold mt-1">0 Requests / Hour</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Server pushes on demand</div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-black/50 text-[11px] text-slate-300">
                <span className="text-emerald-400 font-bold">Why it matters: </span>
                When Priya sends a message, the server immediately pushes it over Rohit&apos;s open socket.
                Rohit&apos;s browser never has to waste bandwidth asking &quot;Any new messages? Any new messages?&quot;
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 text-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between text-amber-400 font-bold border-b border-amber-500/20 pb-2">
                <span>CONVENTIONAL HTTP POLLING (GET /messages EVERY 2s)</span>
                <span>AVERAGE 1,000MS LATENCY</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="text-[10px] text-slate-400">Hourly Requests (Per Client)</div>
                  <div className="text-red-400 font-bold mt-1">1,800 Requests / Hr</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Even when 0 messages sent</div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="text-[10px] text-slate-400">Per-Message Overhead</div>
                  <div className="text-red-400 font-bold mt-1">~850 Bytes Headers</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Cookies, User-Agent, TCP</div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="text-[10px] text-slate-400">Battery &amp; CPU Drain</div>
                  <div className="text-red-400 font-bold mt-1">Severe Mobile Drain</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Continuous radio wakeups</div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-black/50 text-[11px] text-slate-300">
                <span className="text-amber-400 font-bold">The Polling Hazard: </span>
                If Priya sends a message 100ms after Rohit polls, Rohit will wait 1,900ms before his next scheduled poll. Conversations feel sluggish, lagging, and disconnect-prone.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RoomIsolationVisualizer() {
  const [selectedRoom, setSelectedRoom] = useState<"backend" | "dsa">("backend");
  const [broadcastLog, setBroadcastLog] = useState<string>(
    "Ready. Select a room to demonstrate zero message leakage between isolated socket channels."
  );

  const sendTestMessage = (targetRoom: "backend" | "dsa") => {
    setSelectedRoom(targetRoom);
    if (targetRoom === "backend") {
      setBroadcastLog(
        "Emitted to room 'backend-team': Received by Rohit, Priya, Arjun. Room 'dsa-study-group' received ZERO events (100% channel isolation)."
      );
    } else {
      setBroadcastLog(
        "Emitted to room 'dsa-study-group': Received by Amit, Neha, Rahul. Room 'backend-team' received ZERO events (100% channel isolation)."
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-pink-600 uppercase tracking-wider">
            Channel Boundaries // Room Isolation
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Preventing Cross-Room Data Leakage with `socket.join(room)`
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => sendTestMessage("backend")}
            className="rounded-full bg-pink-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-pink-500 transition-all cursor-pointer"
          >
            Emit to #backend-team
          </button>
          <button
            type="button"
            onClick={() => sendTestMessage("dsa")}
            className="rounded-full bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-500 transition-all cursor-pointer"
          >
            Emit to #dsa-study
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room A */}
        <div
          className={`rounded-xl border p-4 transition-all ${
            selectedRoom === "backend"
              ? "border-pink-500 bg-pink-50/50 shadow-md ring-2 ring-pink-500/20"
              : "border-slate-200 bg-slate-50/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-pink-700">ROOM A: #backend-team</span>
            {selectedRoom === "backend" && (
              <span className="rounded bg-pink-600 px-2 py-0.5 font-mono text-[9px] font-bold text-white animate-pulse">
                EVENT DELIVERED
              </span>
            )}
          </div>
          <div className="mt-3 space-y-1 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Rohit Singh (socket_id: ws_01)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Priya Patel (socket_id: ws_02)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Arjun Rao (socket_id: ws_03)</span>
            </div>
          </div>
        </div>

        {/* Room B */}
        <div
          className={`rounded-xl border p-4 transition-all ${
            selectedRoom === "dsa"
              ? "border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20"
              : "border-slate-200 bg-slate-50/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-purple-700">ROOM B: #dsa-study-group</span>
            {selectedRoom === "dsa" && (
              <span className="rounded bg-purple-600 px-2 py-0.5 font-mono text-[9px] font-bold text-white animate-pulse">
                EVENT DELIVERED
              </span>
            )}
          </div>
          <div className="mt-3 space-y-1 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Amit Kumar (socket_id: ws_04)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Neha Sharma (socket_id: ws_05)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Rahul Roy (socket_id: ws_06)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-900 p-3 font-mono text-xs text-emerald-400">
        <span className="text-slate-400">Isolation Proof: </span>
        {broadcastLog}
      </div>
    </div>
  );
}

export function ChatSchemaVisualizer() {
  const [selectedCollection, setSelectedCollection] = useState<string>("messages");

  const collections = [
    {
      name: "messages",
      badge: "CONVERSATION JOURNAL",
      description: "Immutable conversation records partitioned by room and sorted chronologically",
      compoundIndex: "{ room: 1, createdAt: -1 }",
      fields: [
        { name: "_id", type: "ObjectId", role: "PK (Unique Monotonic ID)" },
        { name: "room", type: "String", role: "PARTITION KEY ('backend-team')" },
        { name: "sender", type: "String", role: "USERNAME (Ref: User.username)" },
        { name: "content", type: "String", role: "RAW MESSAGE TEXT" },
        { name: "createdAt", type: "Date", role: "INDEXED SORT (ISODate)" },
      ],
    },
    {
      name: "users",
      badge: "AUTHENTICATED IDENTITY",
      description: "Cryptographically secured user identity profiles",
      compoundIndex: "{ username: 1 } (Unique)",
      fields: [
        { name: "_id", type: "ObjectId", role: "PK" },
        { name: "username", type: "String", role: "UNIQUE INDEX" },
        { name: "passwordHash", type: "String", role: "BCRYPT HASH (Cost 10)" },
        { name: "createdAt", type: "Date", role: "ACCOUNT CREATION" },
      ],
    },
  ];

  const current = collections.find((c) => c.name === selectedCollection) || collections[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-pink-600 uppercase tracking-wider">
            Persistence Layer // MongoDB Mongoose Schemas
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Relational Boundaries &amp; Compound Index Optimization
          </h4>
        </div>

        <div className="flex gap-1.5 font-mono text-xs">
          {collections.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelectedCollection(c.name)}
              className={`rounded-full px-3 py-1 font-semibold transition-all cursor-pointer ${
                selectedCollection === c.name
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              collection: {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-900">
              COLLECTION: {current.name}
            </span>
            <span className="rounded bg-pink-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-pink-800">
              {current.badge}
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            Compound Index: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-800">{current.compoundIndex}</code>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-2.5">Field</th>
                <th className="px-4 py-2.5">BSON Type</th>
                <th className="px-4 py-2.5">Index / Functional Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {current.fields.map((f) => (
                <tr key={f.name} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2 font-bold text-slate-900">{f.name}</td>
                  <td className="px-4 py-2 text-slate-600">{f.type}</td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {f.role}
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

export function TransientVsPersistentMatrix() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-pink-50/50 via-white to-slate-50 p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-pink-600 px-3 py-0.5 font-mono text-xs font-bold text-white">
          STATE DISCRIMINATION
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-900">
        Persistent State vs. Transient Ephemeral Signals
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        A common junior pitfall is attempting to persist every real-time packet to the database.
        Real-Time Chat explicitly differentiates between state that must survive server restarts and ephemeral signals that exist only for the duration of an active socket.
      </p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-emerald-800 uppercase">
            <span>DURABLE STATE (MongoDB)</span>
            <span>Survives Reboots</span>
          </div>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li className="flex items-start gap-1.5">
              <strong className="text-emerald-700">• User Accounts:</strong>
              <span>Usernames and bcryptjs password hashes.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <strong className="text-emerald-700">• Message Journal:</strong>
              <span>Raw text, sender identity, room tag, and exact timestamps.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <strong className="text-emerald-700">• Bounded History:</strong>
              <span>Queried on room join: `limit(50)` for instant context.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-pink-200 bg-pink-50/40 p-4">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-pink-800 uppercase">
            <span>TRANSIENT STATE (Socket.IO Memory)</span>
            <span>Zero DB Write</span>
          </div>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li className="flex items-start gap-1.5">
              <strong className="text-pink-700">• Typing Indicators:</strong>
              <span>`typing:start` and `typing:stop` broadcasts. Never written to disk.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <strong className="text-pink-700">• Socket Session IDs:</strong>
              <span>Generated dynamically upon WebSocket handshake (`ws_9a8f`).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <strong className="text-pink-700">• Active Room Membership:</strong>
              <span>Tracked in Node process memory via `socket.rooms` set.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function RedisClusterArchitecture() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
          HORIZONTAL SCALABILITY // ROADMAP
        </span>
        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-purple-800">
          MULTI-NODE SOCKET ADAPTER
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-900">
        Scaling Beyond One Node.js Instance via Redis Pub/Sub
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        A single Node.js process comfortably handles ~10,000 concurrent sockets.
        When scaling to 100,000+ users across a multi-server cluster, clients connected to <strong>Node Server 1</strong> must be able to chat with users connected to <strong>Node Server 3</strong>.
        Integrating the <strong>Socket.IO Redis Adapter</strong> connects cluster instances over high-throughput Redis Pub/Sub channels.
      </p>

      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5 text-slate-200 font-mono text-xs text-center">
        <div className="text-[10px] text-slate-400 font-bold uppercase pb-3 border-b border-slate-800">
          Clustered Real-Time Socket Architecture
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="rounded-xl border border-blue-500/50 bg-blue-950/40 p-3 w-full md:w-auto">
            <div className="font-bold text-blue-400">CLIENTS 1 - 30K</div>
            <div className="text-[10px] text-slate-400 mt-1">WebSocket Connections</div>
          </div>
          <span className="text-slate-500">→</span>
          <div className="rounded-xl border border-pink-500/50 bg-pink-950/40 p-3 w-full md:w-auto">
            <div className="font-bold text-pink-400">NODE INSTANCE 1</div>
            <div className="text-[10px] text-slate-400 mt-1">Socket.IO Server</div>
          </div>
          <span className="text-purple-400 font-bold">⇄ REDIS PUB/SUB ⇄</span>
          <div className="rounded-xl border border-pink-500/50 bg-pink-950/40 p-3 w-full md:w-auto">
            <div className="font-bold text-pink-400">NODE INSTANCE 2</div>
            <div className="text-[10px] text-slate-400 mt-1">Socket.IO Server</div>
          </div>
          <span className="text-slate-500">→</span>
          <div className="rounded-xl border border-blue-500/50 bg-blue-950/40 p-3 w-full md:w-auto">
            <div className="font-bold text-blue-400">CLIENTS 30K - 60K</div>
            <div className="text-[10px] text-slate-400 mt-1">WebSocket Connections</div>
          </div>
        </div>
      </div>
    </div>
  );
}
