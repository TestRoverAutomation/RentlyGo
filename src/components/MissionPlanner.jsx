import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight, FaMapMarkerAlt,
  FaSpinner, FaCheck, FaTimes, FaRedo,
} from "react-icons/fa";
import { runMission } from "../services/agentStream";

/* ─── Static data ───────────────────────────────────────── */

const EXAMPLES = [
  "Garden party for 50 people in Manchester next Saturday, budget £400",
  "Weekend short film shoot — need camera, lighting and audio gear in London",
  "Family camping trip for 4 days in the Lake District",
  "Full kitchen renovation this weekend — need all the tools",
  "Wedding reception for 120 guests in Birmingham in June",
  "Road trip across Scotland for 10 days, two adults",
];

const TOOL_META = {
  search_rentals:     { label: "Searching listings" },
  check_availability: { label: "Checking availability" },
  build_rental_plan:  { label: "Building your plan" },
};

/* ─── Helpers ───────────────────────────────────────────── */

function toolSummary(event) {
  if (event.status !== "done" || !event.result) return null;
  if (event.name === "search_rentals") {
    const n = event.result.count ?? event.result.listings?.length ?? 0;
    return `${n} listing${n !== 1 ? "s" : ""} found`;
  }
  if (event.name === "check_availability") return "all available";
  if (event.name === "build_rental_plan") {
    const cost = event.result.plan?.totalCost;
    return cost != null ? `£${cost} total` : "plan ready";
  }
  return null;
}

/* ─── Sub-components ────────────────────────────────────── */

function AgentTimeline({ events }) {
  return (
    <ul className="space-y-1.5 mb-4" aria-label="Agent activity">
      {events.map((ev) => {
        const meta  = TOOL_META[ev.name] ?? { label: ev.name };
        const done  = ev.status === "done";
        const sum   = toolSummary(ev);
        return (
          <li key={ev.id} className="flex items-center gap-2.5 text-xs text-gray-400">
            <span
              className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                done ? "bg-emerald-500/15 text-emerald-400" : "bg-indigo-500/15 text-indigo-400"
              }`}
              aria-hidden="true"
            >
              {done
                ? <FaCheck className="text-[8px]" />
                : <FaSpinner className="text-[8px] animate-spin" />}
            </span>
            <span>{meta.label}</span>
            {sum && <span className="text-gray-600 ml-auto">{sum}</span>}
          </li>
        );
      })}
    </ul>
  );
}

function PlanCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-xl p-4 flex items-start gap-3 hover:border-indigo-400/20 transition-all"
    >
      <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm truncate">{item.name}</div>
        <div className="text-gray-500 text-xs mt-0.5 truncate">
          {item.host} · ⭐ {item.hostRating} · {item.location}
        </div>
        <div className="text-gray-600 text-xs mt-0.5 line-clamp-1">{item.description}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-white font-bold text-sm">£{item.totalForTrip}</div>
        <div className="text-gray-600 text-[11px]">£{item.price}/day</div>
      </div>
    </motion.div>
  );
}

function RentalPlan({ plan, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Plan header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-indigo-400 font-medium mb-1.5 tracking-wide">
            Your rental plan
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {plan.title}
          </h2>
          {plan.dates?.start && (
            <p className="text-gray-500 text-sm mt-1.5">
              {plan.dates.start}
              {plan.dates.end ? ` – ${plan.dates.end}` : ""}
              {" · "}
              {plan.dates.days} day{plan.dates.days !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl md:text-4xl font-black gradient-text">£{plan.totalCost}</div>
          <div className="text-gray-600 text-xs mt-0.5">estimated total</div>
        </div>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {plan.items.map((item, i) => (
          <PlanCard key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* Notes */}
      {plan.notes && (
        <div className="glass-card rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
          <span className="text-indigo-400 text-xs font-medium block mb-2 tracking-wide">
            Recommendations
          </span>
          {plan.notes}
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-3 pt-1">
        <button
          className="flex-1 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#09090f]"
          aria-label="Book all items in this plan"
        >
          Book all items →
        </button>
        <button
          onClick={onReset}
          className="glass-card text-gray-300 hover:text-white font-medium px-5 py-3.5 rounded-xl hover:border-white/20 transition-all text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#09090f]"
          aria-label="Start a new search"
        >
          <FaRedo className="text-xs" aria-hidden="true" /> Start over
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────── */

export default function MissionPlanner() {
  // messages: [{id, role: "user"|"assistant", content, events, plan, streaming}]
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [location, setLocation] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  const isConversation = messages.length > 0;

  useEffect(() => {
    if (!isConversation || !bottomRef.current) return;
    // Scroll so bottomRef lands STICKY_FOOTER_HEIGHT above the viewport bottom.
    // Using scrollIntoView block:"start" would push the AI reply above the fold.
    // Using window.scrollTo(body.scrollHeight) overshoots to the page footer.
    const STICKY_FOOTER_HEIGHT = 200;
    const rect = bottomRef.current.getBoundingClientRect();
    const target = window.scrollY + rect.top - (window.innerHeight - STICKY_FOOTER_HEIGHT);
    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [messages]);

  const reset = () => {
    setMessages([]);
    setReply("");
    setIsThinking(false);
    setError(null);
  };

  const submit = async (text = reply) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    setReply("");
    setError(null);

    const userMsg = { id: Date.now(), role: "user", content: trimmed };
    const assistantId = Date.now() + 1;
    const assistantMsg = {
      id: assistantId,
      role: "assistant",
      content: "",
      events: [],
      plan: null,
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsThinking(true);

    // Build history for API: all settled messages + new user message
    const history = [...messages, userMsg]
      .filter((m) => !m.streaming)
      .map((m) => ({ role: m.role, content: m.content }));

    let accText = "";

    try {
      await runMission({
        conversationHistory: history,
        location,
        onEvent: (ev) => {
          if (ev.type === "tool_start") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      events: [
                        ...m.events,
                        { id: `${ev.name}-${Date.now()}`, name: ev.name, input: ev.input, status: "running" },
                      ],
                    }
                  : m
              )
            );
          } else if (ev.type === "tool_result") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      events: m.events.map((e) =>
                        e.name === ev.name && e.status === "running"
                          ? { ...e, status: "done", result: ev.result }
                          : e
                      ),
                      plan:
                        ev.name === "build_rental_plan" && ev.result?.plan
                          ? ev.result.plan
                          : m.plan,
                    }
                  : m
              )
            );
          } else if (ev.type === "text") {
            accText += ev.content;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: accText } : m))
            );
          } else if (ev.type === "done") {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m))
            );
            setIsThinking(false);
          } else if (ev.type === "error") {
            setError(ev.message);
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
            setIsThinking(false);
          }
        },
      });
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      setIsThinking(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090f] text-white overflow-x-hidden">

      {/* Subtle ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className={`relative z-10 max-w-4xl mx-auto px-4 ${isConversation ? "pt-8 pb-52" : "py-16 md:py-24"}`}>

        {/* Headline — idle only */}
        <AnimatePresence mode="wait">
          {!isConversation && (
            <motion.div
              key="headline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-1.5 text-xs text-indigo-300 font-medium mb-8 tracking-wide">
                AI-powered rental assistant
              </div>
              <h1 className="font-black tracking-tight leading-tight text-5xl sm:text-6xl md:text-7xl mb-5">
                Rent anything,<br />
                <span className="gradient-text">effortlessly.</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                Describe your event, project, or trip. Our AI searches local hosts
                and builds your complete rental plan — in seconds.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation thread */}
        <AnimatePresence>
          {isConversation && (
            <motion.div
              key="thread"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
              aria-live="polite"
              aria-label="Conversation"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-[80%] bg-indigo-600/20 border border-indigo-500/20 rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-white text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 glass-card rounded-2xl rounded-tl-sm p-5">
                      <span className="text-xs text-indigo-400 font-medium block mb-3 tracking-wide">
                        Assistant
                      </span>
                      {msg.events.length > 0 && <AgentTimeline events={msg.events} />}
                      {msg.content ? (
                        <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                          {msg.content}
                          {msg.streaming && (
                            <span
                              className="inline-block w-1.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle rounded-sm opacity-80"
                              aria-hidden="true"
                            />
                          )}
                        </p>
                      ) : msg.streaming ? (
                        <p className="text-gray-600 text-sm animate-pulse">Thinking…</p>
                      ) : null}
                      {msg.plan && (
                        <div className="mt-5">
                          <RentalPlan plan={msg.plan} onReset={reset} />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial input — idle only */}
        <AnimatePresence>
          {!isConversation && (
            <motion.div
              key="initial-input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <div className="concierge-input bg-[#0e0e18] border border-white/[0.10] rounded-2xl overflow-hidden focus-within:border-indigo-500/40 transition-all duration-300">
                <div className="flex items-start gap-3 p-4 pb-3">
                  <div
                    className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow"
                    aria-hidden="true"
                  >
                    <span className="text-white text-[10px] font-black">RG</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder='Describe what you need… e.g. "Garden party for 50 people in Manchester next weekend, budget £400"'
                    rows={3}
                    disabled={isThinking}
                    aria-label="Describe your rental needs"
                    aria-describedby="input-hint"
                    className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none text-sm md:text-base resize-none w-full leading-relaxed"
                  />
                </div>
                <div className="flex items-center justify-between px-4 pb-3.5 gap-3 border-t border-white/[0.06] pt-3">
                  <div className="flex items-center gap-2 flex-1">
                    <FaMapMarkerAlt className="text-gray-600 text-xs shrink-0" aria-hidden="true" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location (optional)"
                      disabled={isThinking}
                      aria-label="Location"
                      className="bg-transparent text-sm text-gray-300 placeholder-gray-600 focus:outline-none flex-1"
                    />
                  </div>
                  <button
                    onClick={() => submit()}
                    disabled={!reply.trim() || isThinking}
                    aria-label="Find rentals"
                    className="shrink-0 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#09090f]"
                  >
                    Find rentals <FaArrowRight className="text-xs" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p id="input-hint" className="text-gray-600 text-xs mt-2 px-1">
                Press Enter to search · Shift+Enter for a new line
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Example prompts — idle only */}
        <AnimatePresence>
          {!isConversation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 justify-center mb-10"
              role="list"
              aria-label="Example searches"
            >
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  role="listitem"
                  onClick={() => { setReply(ex); submit(ex); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/[0.10] text-gray-500 hover:text-gray-200 hover:border-white/25 hover:bg-white/[0.03] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {ex.length > 55 ? ex.slice(0, 55) + "…" : ex}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error — idle only */}
        <AnimatePresence>
          {error && !isConversation && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="glass-card rounded-xl p-4 mb-6 text-red-300 text-sm flex items-center gap-3 border border-red-500/20"
            >
              <FaTimes className="shrink-0 text-red-400 text-xs" aria-hidden="true" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError(null)}
                aria-label="Dismiss error"
                className="text-gray-500 hover:text-white focus:outline-none rounded p-0.5"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Sticky reply bar — conversation mode ─────────────── */}
      <AnimatePresence>
        {isConversation && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.06]"
            style={{ background: "rgba(9,9,15,0.97)", backdropFilter: "blur(14px)" }}
          >
            <div className="max-w-4xl mx-auto px-4 py-3">

              {/* Inline error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    role="alert"
                    className="flex items-center gap-2 text-red-300 text-xs mb-2 px-1 overflow-hidden"
                  >
                    <FaTimes className="text-red-400 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{error}</span>
                    <button
                      onClick={() => setError(null)}
                      className="text-gray-500 hover:text-white focus:outline-none"
                      aria-label="Dismiss error"
                    >
                      <FaTimes aria-hidden="true" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="concierge-input bg-[#0e0e18] border border-white/[0.10] rounded-2xl overflow-hidden focus-within:border-indigo-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                  <textarea
                    ref={textareaRef}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Reply…"
                    rows={1}
                    disabled={isThinking}
                    aria-label="Reply to assistant"
                    className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none text-sm resize-none leading-relaxed"
                    style={{ maxHeight: "100px", overflowY: "auto" }}
                  />
                </div>
                <div className="flex items-center justify-between px-4 pb-3 gap-3 border-t border-white/[0.06] pt-2.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FaMapMarkerAlt className="text-gray-600 text-xs shrink-0" aria-hidden="true" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location (optional)"
                      disabled={isThinking}
                      aria-label="Location"
                      className="bg-transparent text-sm text-gray-300 placeholder-gray-600 focus:outline-none flex-1 min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={reset}
                      className="text-gray-500 hover:text-gray-200 text-xs font-medium px-3 py-2 rounded-lg border border-white/[0.08] hover:border-white/20 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-white/20"
                      aria-label="Start a new search"
                    >
                      <FaRedo className="text-[10px]" aria-hidden="true" /> New search
                    </button>
                    <button
                      onClick={() => submit()}
                      disabled={!reply.trim() || isThinking}
                      aria-label={isThinking ? "Searching, please wait" : "Send reply"}
                      className="glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {isThinking ? (
                        <>
                          <FaSpinner className="animate-spin text-xs" aria-hidden="true" /> Searching…
                        </>
                      ) : (
                        <>
                          Send <FaArrowRight className="text-xs" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-xs mt-1.5 px-1">
                Press Enter to send · Shift+Enter for a new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
