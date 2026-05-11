import MissionPlanner from "../components/MissionPlanner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHome, FaTshirt, FaLaptop, FaCampground,
  FaCar, FaTools, FaCouch, FaBox, FaArrowRight,
} from "react-icons/fa";

const categories = [
  { name: "Properties",     icon: FaHome,      path: "/properties",           gradient: "from-blue-500 to-cyan-500",     color: "text-blue-400",   desc: "Residential & commercial" },
  { name: "Clothing",       icon: FaTshirt,    path: "/clothing-accessories", gradient: "from-pink-500 to-rose-500",     color: "text-pink-400",   desc: "Fashion for every occasion" },
  { name: "Electronics",    icon: FaLaptop,    path: "/electronics-gadgets",  gradient: "from-violet-500 to-purple-600", color: "text-violet-400", desc: "Tech & professional gear" },
  { name: "Outdoor",        icon: FaCampground,path: "/outdoor-adventure",    gradient: "from-emerald-500 to-green-500", color: "text-emerald-400",desc: "Explore the outdoors" },
  { name: "Vehicles",       icon: FaCar,       path: "/vehicles",             gradient: "from-orange-500 to-amber-500",  color: "text-orange-400", desc: "Cars, bikes & more" },
  { name: "Tools",          icon: FaTools,     path: "/tools-equipments",     gradient: "from-yellow-500 to-lime-500",   color: "text-yellow-400", desc: "DIY & professional" },
  { name: "Home & Furniture",icon: FaCouch,    path: "/home-furniture",       gradient: "from-teal-500 to-cyan-400",     color: "text-teal-400",   desc: "Comfort & style" },
  { name: "Misc",           icon: FaBox,       path: "/miscellaneous",        gradient: "from-indigo-500 to-blue-600",   color: "text-indigo-400", desc: "Events, jobs & more" },
];

export default function Home() {
  return (
    <div className="bg-[#050510] text-white min-h-screen overflow-x-hidden">

      {/* ── MISSION PLANNER (full-screen hero) ── */}
      <MissionPlanner />

      {/* ── BROWSE CATEGORIES ── */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-purple-400 text-[10px] font-bold tracking-widest uppercase font-mono">
              Browse
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 leading-tight">
              Or explore by category.
            </h2>
            <p className="text-gray-600 text-sm mt-2">Prefer to browse? Every category, one platform.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(({ name, icon: Icon, path, gradient, color, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={path} className="block h-full">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.18 }}
                    className="glass-card rounded-xl p-4 h-full group relative overflow-hidden flex flex-col gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
                    >
                      <Icon className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{name}</div>
                      <div className="text-gray-600 text-xs mt-0.5">{desc}</div>
                    </div>
                    <FaArrowRight
                      className={`text-[9px] ${color} opacity-0 group-hover:opacity-100 transition-opacity mt-auto`}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity rounded-xl pointer-events-none`}
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
