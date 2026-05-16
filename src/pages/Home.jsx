import MissionPlanner from "../components/MissionPlanner";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome, FaTshirt, FaLaptop, FaCampground,
  FaCar, FaTools, FaCouch, FaBox, FaArrowRight,
} from "react-icons/fa";

const categories = [
  { name: "Properties",      icon: FaHome,       path: "/properties",           color: "text-blue-400",   bg: "bg-blue-500/10",   border: "hover:border-blue-400/30",   desc: "Residential & commercial" },
  { name: "Clothing",        icon: FaTshirt,     path: "/clothing-accessories", color: "text-pink-400",   bg: "bg-pink-500/10",   border: "hover:border-pink-400/30",   desc: "Fashion for every occasion" },
  { name: "Electronics",     icon: FaLaptop,     path: "/electronics-gadgets",  color: "text-violet-400", bg: "bg-violet-500/10", border: "hover:border-violet-400/30", desc: "Tech & professional gear" },
  { name: "Outdoor",         icon: FaCampground, path: "/outdoor-adventure",    color: "text-emerald-400",bg: "bg-emerald-500/10",border: "hover:border-emerald-400/30",desc: "Explore the outdoors" },
  { name: "Vehicles",        icon: FaCar,        path: "/vehicles",             color: "text-orange-400", bg: "bg-orange-500/10", border: "hover:border-orange-400/30", desc: "Cars, bikes & more" },
  { name: "Tools",           icon: FaTools,      path: "/tools-equipments",     color: "text-amber-400",  bg: "bg-amber-500/10",  border: "hover:border-amber-400/30",  desc: "DIY & professional" },
  { name: "Home & Furniture",icon: FaCouch,      path: "/home-furniture",       color: "text-teal-400",   bg: "bg-teal-500/10",   border: "hover:border-teal-400/30",   desc: "Comfort & style" },
  { name: "Miscellaneous",   icon: FaBox,        path: "/miscellaneous",        color: "text-indigo-400", bg: "bg-indigo-500/10", border: "hover:border-indigo-400/30", desc: "Events, jobs & more" },
];

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "RentlyGo – Rent Anything Near You",
  "description": "AI-powered peer-to-peer rental marketplace. Rent properties, vehicles, electronics, tools, clothing, outdoor gear and more from people near you across the UK.",
  "url": "https://rentlygo.netlify.app",
};

export default function Home() {
  return (
    <div className="bg-[#09090f] text-white min-h-screen overflow-x-hidden">
      <SEO
        title="Rent Anything Near You"
        description="RentlyGo is the UK's AI-powered peer-to-peer rental marketplace. Describe what you need and our AI assistant finds it, plans it, and prices it instantly. Rent properties, vehicles, electronics, tools, clothing and outdoor gear."
        keywords="rent items UK, peer to peer rental, hire near me, rental marketplace, rent anything, AI rental assistant, rent property UK, vehicle hire, tool hire, electronics rental"
        url="/"
        jsonLd={HOME_JSONLD}
      />

      {/* AI Rental Assistant hero */}
      <MissionPlanner />

      {/* Browse categories */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Browse by category
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">Every category, one platform.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(({ name, icon: Icon, path, color, bg, border, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={path} className="block h-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.15 }}
                    className={`glass-card rounded-xl p-4 h-full group relative overflow-hidden flex flex-col gap-3 transition-all ${border}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon className={`${color} text-sm`} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{desc}</div>
                    </div>
                    <FaArrowRight
                      className={`text-[9px] ${color} opacity-0 group-hover:opacity-60 transition-opacity mt-auto`}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
