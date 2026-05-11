import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome, FaTshirt, FaLaptop, FaCampground,
  FaCar, FaTools, FaCouch, FaBox,
  FaSearch, FaMapMarkerAlt, FaArrowRight,
  FaStar, FaShieldAlt, FaBolt, FaUsers,
} from "react-icons/fa";

const categories = [
  {
    name: "Properties",
    icon: FaHome,
    path: "/properties",
    gradient: "from-blue-500 to-cyan-500",
    count: "2 categories",
    desc: "Residential & Commercial",
  },
  {
    name: "Clothing & Accessories",
    icon: FaTshirt,
    path: "/clothing-accessories",
    gradient: "from-pink-500 to-rose-500",
    count: "7 categories",
    desc: "Fashion for everyone",
  },
  {
    name: "Electronics & Gadgets",
    icon: FaLaptop,
    path: "/electronics-gadgets",
    gradient: "from-violet-500 to-purple-600",
    count: "10 categories",
    desc: "Tech & innovation",
  },
  {
    name: "Outdoor & Adventure",
    icon: FaCampground,
    path: "/outdoor-adventure",
    gradient: "from-emerald-500 to-green-500",
    count: "8 categories",
    desc: "Explore the outdoors",
  },
  {
    name: "Vehicles",
    icon: FaCar,
    path: "/vehicles",
    gradient: "from-orange-500 to-amber-500",
    count: "6 categories",
    desc: "Cars, bikes & more",
  },
  {
    name: "Tools & Equipment",
    icon: FaTools,
    path: "/tools-equipments",
    gradient: "from-yellow-500 to-lime-500",
    count: "3 categories",
    desc: "DIY & professional",
  },
  {
    name: "Home & Furniture",
    icon: FaCouch,
    path: "/home-furniture",
    gradient: "from-teal-500 to-cyan-400",
    count: "2 categories",
    desc: "Comfort & style",
  },
  {
    name: "Miscellaneous",
    icon: FaBox,
    path: "/miscellaneous",
    gradient: "from-indigo-500 to-blue-600",
    count: "5 categories",
    desc: "Events, jobs & more",
  },
];

const stats = [
  { value: "2.4M+", label: "Active Users",    icon: FaUsers },
  { value: "8.9M+", label: "Live Listings",   icon: FaStar },
  { value: "100%",  label: "Verified Hosts",  icon: FaShieldAlt },
  { value: "< 2m",  label: "Avg. Response",   icon: FaBolt },
];

const steps = [
  {
    num: "01",
    title: "Search & Discover",
    desc: "AI-powered search finds exactly what you need, when you need it — filtered by location, price and availability.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    num: "02",
    title: "Book Instantly",
    desc: "Seamless booking with verified hosts, smart contracts and instant confirmation in seconds.",
    color: "from-purple-400 to-pink-500",
  },
  {
    num: "03",
    title: "Rent & Enjoy",
    desc: "Collect your rental, enjoy it, and return with a tap. Fully insured. Fully frictionless.",
    color: "from-emerald-400 to-cyan-500",
  },
];

const trending = ["Electric Cars", "Camping Gear", "DSLR Camera", "Party Marquee", "E-Bikes", "Power Tools"];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="bg-[#060610] text-white min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 py-24">
        {/* Ambient orbs */}
        <div className="orb w-[500px] h-[500px] bg-cyan-500 opacity-[0.12] -top-40 -left-40" />
        <div className="orb w-[400px] h-[400px] bg-purple-600 opacity-[0.12] -bottom-32 -right-32"
          style={{ animationDelay: "2.5s" }} />
        <div className="orb w-[300px] h-[300px] bg-pink-600 opacity-[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: "1.2s" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-lines opacity-100" />

        <div className="relative z-10 text-center max-w-5xl mx-auto w-full">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-10 text-sm text-cyan-300 animate-float">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse inline-block" />
            AI-Powered Rental Platform · Built for 2030
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-6 tracking-tight">
            <span className="block text-white">Rent Anything.</span>
            <span className="block gradient-text">Anywhere.</span>
            <span className="block text-white/60">Instantly.</span>
          </h1>

          <p className="text-base md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The world's most intelligent peer-to-peer rental ecosystem. From a tent
            for the weekend to a luxury villa for a month — discover, book, and go.
          </p>

          {/* Search bar */}
          <div className="glass-card search-glow rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-3 flex-1 bg-white/5 rounded-xl px-4 py-3">
              <FaSearch className="text-cyan-400 shrink-0 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="What do you want to rent?"
                className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none text-sm md:text-base"
              />
            </div>
            <div className="flex items-center gap-3 flex-1 bg-white/5 rounded-xl px-4 py-3">
              <FaMapMarkerAlt className="text-purple-400 shrink-0 text-sm" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City, postcode or area"
                className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none text-sm md:text-base"
              />
            </div>
            <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3 rounded-xl text-sm md:text-base whitespace-nowrap">
              Search
            </button>
          </div>

          {/* Trending tags */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-gray-600 self-center">Trending:</span>
            {trending.map(tag => (
              <button
                key={tag}
                className="px-3 py-1.5 rounded-full border border-white/10 text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/5 py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl glass-card mb-3 group-hover:scale-110 transition-transform duration-300">
                <Icon className="text-cyan-400 text-lg" />
              </div>
              <div className="text-2xl md:text-3xl font-black gradient-text">{value}</div>
              <div className="text-gray-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Browse</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
              Every Category.{" "}
              <span className="gradient-text">One Platform.</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm md:text-base">
              8 major categories, 50+ subcategories. Whatever you need, RentlyGo has it.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(({ name, icon: Icon, path, gradient, count, desc }) => (
              <Link to={path} key={name}>
                <div className="category-card glass-card rounded-2xl p-5 h-full group cursor-pointer">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <h3 className="font-bold text-white text-sm md:text-base leading-snug mb-1">{name}</h3>
                  <p className="text-gray-500 text-xs mb-2">{desc}</p>
                  <span className="text-xs text-cyan-500 font-medium">{count}</span>
                  <div className="mt-3 flex items-center gap-1 text-xs text-gray-600 group-hover:text-cyan-400 transition-colors">
                    Explore
                    <FaArrowRight className="text-[9px] group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-400 text-xs font-bold tracking-widest uppercase">Process</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
              How <span className="gradient-text">RentlyGo</span> Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map(({ num, title, desc, color }) => (
              <div
                key={num}
                className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300"
              >
                <div
                  className={`text-8xl font-black bg-gradient-to-br ${color} bg-clip-text text-transparent opacity-10 absolute -top-2 -right-2 select-none pointer-events-none leading-none`}
                >
                  {num}
                </div>
                <div className={`text-xs font-bold tracking-widest bg-gradient-to-r ${color} bg-clip-text text-transparent uppercase mb-5`}>
                  Step {num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="orb w-72 h-72 bg-cyan-500 opacity-10 -top-24 -left-24" />
            <div className="orb w-72 h-72 bg-purple-600 opacity-10 -bottom-24 -right-24" style={{ animationDelay: "2s" }} />
            <div className="relative z-10">
              <span className="text-pink-400 text-xs font-bold tracking-widest uppercase">Earn with RentlyGo</span>
              <h2 className="text-3xl md:text-5xl font-black mt-3 mb-4 leading-tight">
                Have something to <span className="gradient-text">rent out?</span>
              </h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto text-sm md:text-base">
                List your item in under 2 minutes and start earning. Join thousands
                of hosts already on RentlyGo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/manage-ads">
                  <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-4 rounded-xl text-base w-full sm:w-auto">
                    Post a Free Ad
                  </button>
                </Link>
                <Link to="/about">
                  <button className="glass-card text-white font-bold px-8 py-4 rounded-xl text-base hover:border-white/25 transition-all w-full sm:w-auto">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
