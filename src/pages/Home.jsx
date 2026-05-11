import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome, FaTshirt, FaLaptop, FaCampground,
  FaCar, FaTools, FaCouch, FaBox,
  FaBolt, FaArrowRight, FaMicrophone,
} from "react-icons/fa";
import NeuralCanvas from "../components/NeuralCanvas";

/* ─── Data ─────────────────────────────────────────────── */

const intentPlaceholders = [
  "plan a weekend camping trip...",
  "set up a home recording studio...",
  "throw a garden party for 80 guests...",
  "film a short documentary...",
  "renovate my kitchen this weekend...",
  "host a corporate conference...",
  "go on a road trip across Europe...",
];

const quickIntents = ["Weekend Camping", "Garden Party", "Film Shoot", "Home Reno", "Wedding", "Road Trip"];

const kits = [
  {
    id: "garden-party",
    name: "Garden Party Kit",
    desc: "Host up to 80 guests outdoors",
    items: ["Party Marquee", "Garden Chairs", "Outdoor Lighting", "BBQ Grill", "Sound System"],
    gradient: "from-emerald-500/10 to-teal-500/10",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
    emoji: "🌿",
    price: "From £85/day",
  },
  {
    id: "filmmaker",
    name: "Weekend Filmmaker",
    desc: "Cinema-quality production setup",
    items: ["DSLR Camera", "Prime Lenses", "Lighting Rig", "Audio Recorder", "Gimbal"],
    gradient: "from-violet-500/10 to-purple-600/10",
    accent: "text-violet-400",
    border: "border-violet-500/20",
    emoji: "🎬",
    price: "From £120/day",
  },
  {
    id: "home-reno",
    name: "Home Renovation Kit",
    desc: "Everything for a weekend project",
    items: ["Power Drill", "Circular Saw", "Sander", "Scaffolding Tower", "Cement Mixer"],
    gradient: "from-orange-500/10 to-amber-500/10",
    accent: "text-orange-400",
    border: "border-orange-500/20",
    emoji: "🔨",
    price: "From £65/day",
  },
  {
    id: "road-trip",
    name: "Road Trip Kit",
    desc: "Adventure-ready vehicle & gear",
    items: ["Campervan", "Roof Box", "Camping Gear", "Portable Solar", "Navigation Device"],
    gradient: "from-cyan-500/10 to-blue-500/10",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
    emoji: "🚐",
    price: "From £150/day",
  },
  {
    id: "wedding",
    name: "Wedding Essentials",
    desc: "Make the day unforgettable",
    items: ["Photo Booth", "Floral Arch", "Vintage Car", "Lighting Canopy", "Catering Gear"],
    gradient: "from-pink-500/10 to-rose-500/10",
    accent: "text-pink-400",
    border: "border-pink-500/20",
    emoji: "💍",
    price: "From £200/day",
  },
];

const activities = [
  { avatar: "S", name: "Sarah M.", action: "rented DSLR Camera", location: "Manchester", time: "2m" },
  { avatar: "J", name: "James K.", action: "booked Party Marquee", location: "London", time: "5m" },
  { avatar: "P", name: "Priya S.", action: "listed Electric Car", location: "Birmingham", time: "8m" },
  { avatar: "T", name: "Tom W.", action: "rented Camping Gear", location: "Bristol", time: "12m" },
  { avatar: "A", name: "Alex R.", action: "returned Power Tools", location: "Leeds", time: "15m" },
  { avatar: "M", name: "Maya L.", action: "booked Photo Booth", location: "Edinburgh", time: "18m" },
  { avatar: "D", name: "David C.", action: "rented Campervan", location: "Glasgow", time: "22m" },
  { avatar: "N", name: "Nina H.", action: "listed Luxury Villa", location: "Bath", time: "25m" },
];

const stats = [
  { value: "2.4M+", label: "Active Users", sub: "across 40 cities" },
  { value: "8.9M+", label: "Live Listings", sub: "updated in real-time" },
  { value: "£48M+", label: "Earned by Hosts", sub: "this year alone" },
  { value: "< 2min", label: "Avg. Response", sub: "from verified hosts" },
];

const categories = [
  {
    name: "Properties",
    icon: FaHome,
    path: "/properties",
    gradient: "from-blue-500 to-cyan-500",
    color: "text-blue-400",
    desc: "Residential & Commercial",
    count: "2 sub-categories",
    featured: true,
  },
  {
    name: "Clothing",
    icon: FaTshirt,
    path: "/clothing-accessories",
    gradient: "from-pink-500 to-rose-500",
    color: "text-pink-400",
    desc: "Fashion for every occasion",
    count: "7 sub-categories",
  },
  {
    name: "Electronics",
    icon: FaLaptop,
    path: "/electronics-gadgets",
    gradient: "from-violet-500 to-purple-600",
    color: "text-violet-400",
    desc: "Tech & professional gear",
    count: "10 sub-categories",
  },
  {
    name: "Outdoor",
    icon: FaCampground,
    path: "/outdoor-adventure",
    gradient: "from-emerald-500 to-green-500",
    color: "text-emerald-400",
    desc: "Explore the outdoors",
    count: "8 sub-categories",
  },
  {
    name: "Vehicles",
    icon: FaCar,
    path: "/vehicles",
    gradient: "from-orange-500 to-amber-500",
    color: "text-orange-400",
    desc: "Cars, bikes & more",
    count: "6 sub-categories",
  },
  {
    name: "Tools",
    icon: FaTools,
    path: "/tools-equipments",
    gradient: "from-yellow-500 to-lime-500",
    color: "text-yellow-400",
    desc: "DIY & professional",
    count: "3 sub-categories",
  },
  {
    name: "Home & Furniture",
    icon: FaCouch,
    path: "/home-furniture",
    gradient: "from-teal-500 to-cyan-400",
    color: "text-teal-400",
    desc: "Comfort & style",
    count: "2 sub-categories",
  },
  {
    name: "Misc",
    icon: FaBox,
    path: "/miscellaneous",
    gradient: "from-indigo-500 to-blue-600",
    color: "text-indigo-400",
    desc: "Events, jobs & more",
    count: "5 sub-categories",
  },
];

const steps = [
  {
    num: "01",
    title: "Describe your need",
    desc: "Tell our AI what you're planning. A weekend trip, an event, a project — it understands context, not just keywords.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    num: "02",
    title: "AI curates your kit",
    desc: "In seconds, the concierge assembles the perfect set of rentals — matched to your dates, location, and budget.",
    color: "from-purple-400 to-pink-500",
  },
  {
    num: "03",
    title: "Connect & go",
    desc: "Book directly from verified local hosts. Pickup or delivery. Fully insured. Return with a tap.",
    color: "from-emerald-400 to-cyan-500",
  },
];

/* ─── Fade-in on scroll ────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Component ────────────────────────────────────────── */
export default function Home() {
  const [intentIdx, setIntentIdx] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setInterval(
      () => setIntentIdx((i) => (i + 1) % intentPlaceholders.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#050510] text-white min-h-screen overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        <NeuralCanvas />

        {/* Ambient orbs — subtle, not neon */}
        <div className="orb w-[700px] h-[700px] bg-cyan-500 opacity-[0.05] -top-64 -left-56" />
        <div
          className="orb w-[600px] h-[600px] bg-purple-600 opacity-[0.05] -bottom-48 -right-48"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2 text-[11px] font-mono text-cyan-400/80 tracking-widest">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              AI RENTAL CONCIERGE · LIVE · 2030
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="font-black tracking-tighter leading-[0.92] mb-10">
              <span className="block text-white text-6xl sm:text-7xl md:text-[88px]">
                Rent anything.
              </span>
              <span className="block gradient-text text-6xl sm:text-7xl md:text-[88px]">
                Anywhere.
              </span>
              <span className="block text-white/25 text-4xl sm:text-5xl md:text-6xl mt-3">
                Tell us what you need.
              </span>
            </h1>
          </motion.div>

          {/* AI Concierge input */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-5"
          >
            <div className="relative max-w-3xl mx-auto">
              <div className="concierge-input flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-cyan-500/40 focus-within:bg-white/[0.06] transition-all duration-300">
                {/* AI indicator orb */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 animate-glow-pulse">
                  <FaBolt className="text-white text-xs" />
                </div>
                <span className="text-gray-600 text-sm shrink-0 hidden sm:block font-mono">
                  I need to
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={intentPlaceholders[intentIdx]}
                  className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none text-sm md:text-base min-w-0"
                />
                <button
                  className="shrink-0 p-2 text-gray-600 hover:text-cyan-400 transition-colors"
                  aria-label="Voice input"
                >
                  <FaMicrophone className="text-sm" />
                </button>
                <button className="shrink-0 glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-5 py-2 rounded-xl whitespace-nowrap">
                  Find →
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick intent chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-wrap justify-center gap-2 text-xs"
          >
            {quickIntents.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3.5 py-1.5 rounded-full border border-white/[0.07] text-gray-500 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-gray-700 text-[9px] font-mono tracking-[0.2em]">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-cyan-400/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ══ LIVE ACTIVITY TICKER ══════════════════════════ */}
      <div className="border-y border-white/5 bg-white/[0.015] overflow-hidden py-3">
        <div className="flex items-center gap-4">
          <div className="shrink-0 flex items-center gap-2 pl-5 pr-4 border-r border-white/10">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-mono font-bold tracking-widest">
              LIVE
            </span>
          </div>
          <div className="overflow-hidden flex-1">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 whitespace-nowrap"
            >
              {[...activities, ...activities].map((a, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center text-[9px] font-bold text-gray-400 border border-white/10">
                    {a.avatar}
                  </span>
                  <span className="text-gray-400">{a.name}</span>
                  <span>{a.action}</span>
                  <span className="text-gray-700">in {a.location}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-gray-700">{a.time} ago</span>
                  <span className="text-white/5 mx-3">|</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══ STATS ════════════════════════════════════════ */}
      <FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5 border-b border-white/5">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="py-10 px-8 text-center">
              <div className="text-3xl md:text-4xl font-black gradient-text mb-1">{value}</div>
              <div className="text-white text-sm font-semibold mb-0.5">{label}</div>
              <div className="text-gray-600 text-xs">{sub}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ══ RENTAL KITS ══════════════════════════════════ */}
      <section className="py-24 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase font-mono">
                AI Curated · Unique to RentlyGo
              </span>
              <h2 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
                Rental Kits<br />
                <span className="gradient-text">for every occasion.</span>
              </h2>
              <p className="text-gray-500 mt-3 text-sm max-w-sm leading-relaxed">
                Not just items — complete setups. Tell us your plan, we bundle the
                perfect kit instantly.
              </p>
            </div>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-cyan-400 transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0"
            >
              View all kits <FaArrowRight className="text-[10px]" />
            </a>
          </FadeIn>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {kits.map((kit, i) => (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`shrink-0 w-72 rounded-2xl p-6 border ${kit.border} bg-gradient-to-br ${kit.gradient} cursor-pointer`}
              >
                <div className="text-4xl mb-4">{kit.emoji}</div>
                <div className={`text-[10px] font-bold font-mono tracking-widest ${kit.accent} mb-2`}>
                  {kit.price}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{kit.name}</h3>
                <p className="text-gray-500 text-xs mb-4">{kit.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {kit.items.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] text-gray-400 border border-white/10 rounded-full px-2.5 py-0.5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <button
                  className={`text-xs font-bold ${kit.accent} flex items-center gap-1.5 group`}
                >
                  Explore Kit{" "}
                  <FaArrowRight className="text-[9px] group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BENTO CATEGORIES ═════════════════════════════ */}
      <section className="py-24 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-purple-400 text-[10px] font-bold tracking-widest uppercase font-mono">
              Browse
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
              Every category.
              <br />
              <span className="gradient-text">One platform.</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[160px] md:auto-rows-[210px] gap-3">
            {categories.map(({ name, icon: Icon, path, gradient, color, desc, count, featured }, i) => (
              <motion.div
                key={name}
                className={featured ? "md:row-span-2" : ""}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={path} className="block h-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="bento-tile h-full rounded-2xl p-5 glass-card group overflow-hidden relative flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <Icon className="text-white text-base" />
                      </div>
                      <h3 className="text-white font-bold text-sm md:text-base leading-snug">
                        {name}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">{desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-[10px] font-mono ${color}`}>{count}</span>
                      <FaArrowRight
                        className={`text-[9px] ${color} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`}
                      />
                    </div>
                    {/* Gradient hover overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300 rounded-2xl pointer-events-none`}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════ */}
      <section className="py-24 px-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase font-mono">
              Intelligence
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
              AI that works
              <br />
              <span className="gradient-text">for you, not with you.</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              RentlyGo's concierge doesn't just search — it understands context,
              assembles kits, and connects you to the right host instantly.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map(({ num, title, desc, color }, i) => (
              <FadeIn key={num} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="glass-card rounded-2xl p-8 h-full relative overflow-hidden"
                >
                  <div
                    className={`text-[100px] font-black bg-gradient-to-br ${color} bg-clip-text text-transparent opacity-[0.07] absolute -top-4 -right-4 select-none leading-none pointer-events-none`}
                  >
                    {num}
                  </div>
                  <div
                    className={`inline-block text-[10px] font-bold font-mono tracking-widest bg-gradient-to-r ${color} bg-clip-text text-transparent uppercase mb-5`}
                  >
                    Step {num}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <div className="orb w-80 h-80 bg-cyan-500 opacity-[0.07] -top-28 -left-28" />
              <div
                className="orb w-80 h-80 bg-purple-600 opacity-[0.07] -bottom-28 -right-28"
                style={{ animationDelay: "2s" }}
              />
              <div className="relative z-10">
                <span className="text-pink-400 text-[10px] font-bold tracking-widest uppercase font-mono">
                  Earn with RentlyGo
                </span>
                <h2 className="text-3xl md:text-5xl font-black mt-4 mb-5 leading-tight">
                  Have something to
                  <br />
                  <span className="gradient-text">rent out?</span>
                </h2>
                <p className="text-gray-400 mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                  List your item in under 2 minutes. Join thousands of hosts already
                  earning with RentlyGo — from a spare camera to an entire property.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/manage-ads">
                    <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-4 rounded-xl text-base w-full sm:w-auto">
                      Post a Free Ad
                    </button>
                  </Link>
                  <Link to="/about">
                    <button className="glass-card text-white font-bold px-8 py-4 rounded-xl text-base hover:border-white/25 transition-all w-full sm:w-auto">
                      Learn How →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
