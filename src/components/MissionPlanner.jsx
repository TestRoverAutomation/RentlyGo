import { useState, useRef } from "react";
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
    <div
      className="glass-card rounded-2xl p-5 space-y-3"
      role="log"
      aria-label="Agent activity"
      aria-live="polite"
    >
      <div className="text-xs font-medium text-gray-500 mb-1 tracking-wide">
        Working on it
      </div>
      {events.map((ev, i) => {
        const meta = TOOL_META[ev.name] || { label: ev.name };
        const summary = toolSummary(ev);
        return (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 text-sm"
          >
            <span className="shrink-0 flex items-center justify-center w-5">
              {ev.status === "running" ? (
                <FaSpinner className="animate-spin text-indigo-400 text-xs" aria-hidden="true" />
              ) : (
                <FaCheck className="text-emerald-400 text-xs" aria-hidden="true" />
              )}
            </span>
            <span className="flex-1 text-gray-300 text-sm">
              {meta.label}
              {ev.status === "running" && (
                <span className="text-gray-600">…</span>
              )}
              {ev.status === "done" && summary && (
                <span className="text-gray-500 text-xs ml-1.5">— {summary}</span>
              )}
            </span>
          </motion.div>
        );
      })}
    </div>
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
  const [phase, setPhase] = useState("idle");
  const [mission, setMission] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [plan, setPlan] = useState(null);
  const [agentText, setAgentText] = useState("");
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);

  const reset = () => {
    setPhase("idle");
    setEvents([]);
    setPlan(null);
    setAgentText("");
    setError(null);
    setMission("");
    setLocation("");
  };

  const submit = async (missionText = mission) => {
    const text = missionText.trim();
    if (!text || phase === "thinking") return;

    setPhase("thinking");
    setEvents([]);
    setPlan(null);
    setAgentText("");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    let accText = "";

    try {
      await runMission({
        mission: text,
        location,
        onEvent: (ev) => {
          if (ev.type === "tool_start") {
            setEvents((prev) => [
              ...prev,
              { id: `${ev.name}-${Date.now()}`, name: ev.name, input: ev.input, status: "running" },
            ]);
          } else if (ev.type === "tool_result") {
            setEvents((prev) =>
              prev.map((e) =>
                e.name === ev.name && e.status === "running"
                  ? { ...e, status: "done", result: ev.result }
                  : e
              )
            );
            if (ev.name === "build_rental_plan" && ev.result?.plan) {
              setPlan(ev.result.plan);
            }
          } else if (ev.type === "text") {
            accText += ev.content;
            setAgentText(accText);
          } else if (ev.type === "done") {
            setPhase("complete");
          } else if (ev.type === "error") {
            setError(ev.message);
            setPhase("idle");
          }
        },
      });
    } catch (err) {
      setError(err.message);
      setPhase("idle");
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

      {/* Subtle ambient gradient — no particles */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 md:py-24">

        {/* Headline — only when idle */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
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

          {phase !== "idle" && (
            <motion.div
              key="working"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
              aria-live="polite"
            >
              <div className="text-sm font-medium text-gray-500 tracking-wide">
                {phase === "thinking" ? "Searching…" : "Done"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <motion.div layout className="mb-6">
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
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                onKeyDown={handleKey}
                placeholder='Describe what you need… e.g. "Garden party for 50 people in Manchester next weekend, budget £400"'
                rows={phase === "idle" ? 3 : 2}
                disabled={phase === "thinking"}
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
                  disabled={phase === "thinking"}
                  aria-label="Location"
                  className="bg-transparent text-sm text-gray-300 placeholder-gray-600 focus:outline-none flex-1"
                />
              </div>
              <button
                onClick={() => submit()}
                disabled={!mission.trim() || phase === "thinking"}
                aria-label={phase === "thinking" ? "Searching, please wait" : "Find rentals"}
                className="shrink-0 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#09090f]"
              >
                {phase === "thinking" ? (
                  <>
                    Searching <FaSpinner className="animate-spin text-xs" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Find rentals <FaArrowRight className="text-xs" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
          <p id="input-hint" className="text-gray-600 text-xs mt-2 px-1">
            Press Enter to search · Shift+Enter for a new line
          </p>
        </motion.div>

        {/* Example prompts */}
        <AnimatePresence>
          {phase === "idle" && (
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
                  onClick={() => { setMission(ex); submit(ex); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/[0.10] text-gray-500 hover:text-gray-200 hover:border-white/25 hover:bg-white/[0.03] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {ex.length > 55 ? ex.slice(0, 55) + "…" : ex}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
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
                onClick={reset}
                aria-label="Dismiss error"
                className="text-gray-500 hover:text-white focus:outline-none rounded p-0.5"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent timeline */}
        <AnimatePresence>
          {events.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <AgentTimeline events={events} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streaming text */}
        <AnimatePresence>
          {agentText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 glass-card rounded-xl p-5"
            >
              <span className="text-xs text-indigo-400 font-medium block mb-2.5 tracking-wide">
                Assistant
              </span>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                {agentText}
                {phase === "thinking" && (
                  <span
                    className="inline-block w-1.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle rounded-sm opacity-80"
                    aria-hidden="true"
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rental plan */}
        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RentalPlan plan={plan} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
