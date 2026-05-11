import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBolt, FaArrowRight, FaMapMarkerAlt,
  FaSpinner, FaCheck, FaTimes, FaRedo,
} from "react-icons/fa";
import NeuralCanvas from "./NeuralCanvas";
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
  search_rentals:   { icon: "🔍", verb: "Searching" },
  check_availability: { icon: "📅", verb: "Checking availability" },
  build_rental_plan:  { icon: "📋", verb: "Building your plan" },
};

/* ─── Helpers ───────────────────────────────────────────── */

function toolSummary(event) {
  if (event.status !== "done" || !event.result) return null;
  if (event.name === "search_rentals") {
    const n = event.result.count ?? event.result.listings?.length ?? 0;
    return `found ${n} listing${n !== 1 ? "s" : ""}`;
  }
  if (event.name === "check_availability") return "all available ✓";
  if (event.name === "build_rental_plan") {
    const cost = event.result.plan?.totalCost;
    return cost != null ? `£${cost} total` : "plan ready";
  }
  return null;
}

/* ─── Sub-components ────────────────────────────────────── */

function AgentTimeline({ events }) {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="text-[10px] font-mono text-gray-600 tracking-widest mb-1">AGENT ACTIVITY</div>
      {events.map((ev, i) => {
        const meta = TOOL_META[ev.name] || { icon: "⚡", verb: ev.name };
        const summary = toolSummary(ev);
        return (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 text-sm"
          >
            <span className="text-base w-6 text-center shrink-0">{meta.icon}</span>
            <span className="flex-1 text-gray-400">
              {meta.verb}
              {ev.status === "running" && (
                <span className="text-gray-600 ml-1 animate-pulse"> — working…</span>
              )}
              {ev.status === "done" && summary && (
                <span className="text-gray-500 text-xs ml-1">— {summary}</span>
              )}
            </span>
            <span className="shrink-0">
              {ev.status === "running" ? (
                <FaSpinner className="animate-spin text-cyan-400/50 text-xs" />
              ) : (
                <FaCheck className="text-emerald-400 text-xs" />
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card rounded-xl p-4 flex items-start gap-3 hover:border-white/15 transition-all"
    >
      <span className="text-2xl shrink-0">{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm truncate">{item.name}</div>
        <div className="text-gray-500 text-xs mt-0.5 truncate">
          {item.host} · ⭐ {item.hostRating} · {item.location}
        </div>
        <div className="text-gray-600 text-xs mt-0.5 line-clamp-1">{item.description}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-white font-bold text-sm">£{item.totalForTrip}</div>
        <div className="text-gray-600 text-[10px]">£{item.price}/day</div>
      </div>
    </motion.div>
  );
}

function RentalPlan({ plan, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Plan header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 tracking-widest mb-1">
            YOUR RENTAL PLAN
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
            {plan.title}
          </h2>
          {plan.dates?.start && (
            <p className="text-gray-500 text-xs mt-1.5">
              {plan.dates.start}
              {plan.dates.end ? ` → ${plan.dates.end}` : ""}
              {" · "}
              {plan.dates.days} day{plan.dates.days !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl md:text-4xl font-black gradient-text">£{plan.totalCost}</div>
          <div className="text-gray-600 text-xs">est. total</div>
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
        <div className="glass-card rounded-xl p-4 text-gray-400 text-sm leading-relaxed">
          <span className="text-cyan-400/70 font-mono text-[10px] tracking-widest block mb-1">
            CONCIERGE NOTES
          </span>
          {plan.notes}
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-3 pt-1">
        <button className="flex-1 glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl text-sm">
          Book All Items →
        </button>
        <button
          onClick={onReset}
          className="glass-card text-white font-semibold px-5 py-3.5 rounded-xl hover:border-white/20 transition-all text-sm flex items-center gap-2"
        >
          <FaRedo className="text-xs" /> New Mission
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main component ────────────────────────────────────── */

export default function MissionPlanner() {
  const [phase, setPhase] = useState("idle"); // idle | thinking | complete
  const [mission, setMission] = useState("");
  const [location, setLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [plan, setPlan] = useState(null);
  const [agentText, setAgentText] = useState("");
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom while agent is working
  useEffect(() => {
    if (phase === "thinking") bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events, agentText, phase]);

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
    <div className="relative min-h-screen bg-[#050510] text-white overflow-x-hidden">
      <NeuralCanvas />

      {/* Ambient orbs */}
      <div className="orb w-[650px] h-[650px] bg-cyan-500 opacity-[0.04] -top-52 -left-52" />
      <div
        className="orb w-[500px] h-[500px] bg-purple-600 opacity-[0.04] -bottom-36 -right-36"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.07] rounded-full px-5 py-2 text-[10px] font-mono text-cyan-400/70 tracking-widest">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            AI RENTAL CONCIERGE · LIVE
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* Headline — only when idle */}
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="headline"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="text-center mb-10"
            >
              <h1 className="font-black tracking-tighter leading-tight text-5xl sm:text-6xl md:text-7xl mb-4">
                What are you<br />
                <span className="gradient-text">planning?</span>
              </h1>
              <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                Describe your event, project, or trip. Our AI agent will search local
                hosts and build your complete rental plan — in real time.
              </p>
            </motion.div>
          )}

          {phase !== "idle" && (
            <motion.div
              key="working"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="text-[10px] font-mono text-cyan-400/50 tracking-widest">
                {phase === "thinking" ? "AGENT WORKING…" : "MISSION COMPLETE"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mission input */}
        <motion.div layout className="mb-6">
          <div className="concierge-input bg-white/[0.03] border border-white/[0.09] rounded-2xl overflow-hidden focus-within:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-start gap-3 p-4">
              <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-glow-pulse">
                <FaBolt className="text-white text-xs" />
              </div>
              <textarea
                ref={textareaRef}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                onKeyDown={handleKey}
                placeholder='Describe your mission… e.g. "Garden party for 50 people in Manchester next weekend, budget £400"'
                rows={phase === "idle" ? 3 : 2}
                disabled={phase === "thinking"}
                className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none text-sm md:text-base resize-none w-full leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 gap-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2 flex-1">
                <FaMapMarkerAlt className="text-gray-700 text-xs shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional)"
                  disabled={phase === "thinking"}
                  className="bg-transparent text-xs text-gray-500 placeholder-gray-700 focus:outline-none flex-1"
                />
              </div>
              <button
                onClick={() => submit()}
                disabled={!mission.trim() || phase === "thinking"}
                className="shrink-0 glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {phase === "thinking" ? (
                  <>
                    Planning <FaSpinner className="animate-spin text-xs" />
                  </>
                ) : (
                  <>
                    Plan Mission <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Example missions */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 justify-center mb-8"
            >
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setMission(ex); submit(ex); }}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/[0.07] text-gray-600 hover:text-cyan-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-xl p-4 mb-6 text-red-400 text-sm flex items-center gap-2"
            >
              <FaTimes />
              <span className="flex-1">{error}</span>
              <button onClick={reset} className="text-gray-600 hover:text-white">
                <FaTimes />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent timeline */}
        <AnimatePresence>
          {events.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
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
              className="mb-6 text-gray-400 text-sm leading-relaxed glass-card rounded-xl p-4"
            >
              <span className="text-[10px] font-mono text-purple-400/60 tracking-widest block mb-2">
                CONCIERGE
              </span>
              {agentText}
              {phase === "thinking" && (
                <span className="inline-block w-1.5 h-4 bg-cyan-400/60 ml-0.5 animate-pulse align-middle" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rental plan */}
        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <RentalPlan plan={plan} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
