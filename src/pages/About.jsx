import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRocket, FaShieldAlt, FaUsers, FaArrowRight } from "react-icons/fa";

const values = [
  { icon: FaRocket,    title: "AI-first",  desc: "The world's first AI-powered rental assistant. Describe what you need — it finds it, plans it, and prices it in seconds.", bg: "bg-indigo-500/10", color: "text-indigo-400" },
  { icon: FaUsers,     title: "Community", desc: "Every listing on RentlyGo is from a real person. We connect neighbours, not warehouses.", bg: "bg-violet-500/10", color: "text-violet-400" },
  { icon: FaShieldAlt, title: "Trust",     desc: "Verified hosts, transparent reviews, and secure transactions on every rental.", bg: "bg-emerald-500/10", color: "text-emerald-400" },
];

export default function About() {
  return (
    <div className="bg-[#09090f] text-white min-h-screen">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-xs text-indigo-300 font-medium mb-8 tracking-wide">
            About RentlyGo
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Rent anything.<br />
            <span className="gradient-text">Effortlessly.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            RentlyGo is the UK's first AI-powered peer-to-peer rental marketplace.
            Describe what you need and our assistant finds it, plans it, and prices it —
            from real people in your area.
          </p>
        </motion.div>
      </div>

      {/* Values */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {values.map(({ icon: Icon, title, desc, bg, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`${color} text-sm`} aria-hidden="true" />
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <h2 className="text-white font-bold text-xl mb-4">Our story</h2>
          <p className="text-gray-400 text-base leading-relaxed mb-4">
            RentlyGo started with a simple question: why do people buy things they only need once?
            A marquee for a single garden party. A DSLR for one weekend shoot. A power drill for a
            Saturday renovation. These items sit unused in garages across the UK — while someone
            nearby needs exactly that thing.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            We built RentlyGo to connect those two people — and added AI to make the process instant.
            Tell our assistant what you're planning. It searches real listings, checks availability, and
            builds your complete rental plan in seconds.
          </p>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-8 py-3.5 rounded-xl text-sm"
          >
            Try the AI assistant <FaArrowRight className="text-xs" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
