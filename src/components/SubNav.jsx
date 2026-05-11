import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars, FaTimes, FaChevronDown,
  FaHome, FaTshirt, FaLaptop, FaCampground,
  FaCar, FaTools, FaCouch, FaBox,
} from "react-icons/fa";

const categories = [
  {
    name: "Properties",
    path: "properties",
    icon: FaHome,
    color: "text-blue-400",
    subcategories: ["Residential Rentals", "Commercial Rentals"],
  },
  {
    name: "Clothing",
    path: "clothing-accessories",
    icon: FaTshirt,
    color: "text-pink-400",
    subcategories: ["Mens Wear", "Womens Wear", "Kids Wear", "Shoes", "Bags", "Party Costumes", "Accessories"],
  },
  {
    name: "Electronics",
    path: "electronics-gadgets",
    icon: FaLaptop,
    color: "text-violet-400",
    subcategories: ["Cameras", "Camcorders", "Studio Equipments", "Sound System", "Party lightings", "Instruments", "Game Consoles", "Projectors", "Laptops", "Mobile & Tab"],
  },
  {
    name: "Outdoor",
    path: "outdoor-adventure",
    icon: FaCampground,
    color: "text-emerald-400",
    subcategories: ["Party Decoration", "Camping Gear", "Marquee", "Bouncy Castle", "Garden Furniture", "Bicycles", "Boats", "Barbecue-Grills"],
  },
  {
    name: "Vehicles",
    path: "vehicles",
    icon: FaCar,
    color: "text-orange-400",
    subcategories: ["Cars", "Van", "Caravan", "Motorbikes", "Scooters", "E-Bikes"],
  },
  {
    name: "Tools",
    path: "tools-equipments",
    icon: FaTools,
    color: "text-yellow-400",
    subcategories: ["Power Tools", "Builder tools", "Garden tools"],
  },
  {
    name: "Home & Furniture",
    path: "home-furniture",
    icon: FaCouch,
    color: "text-teal-400",
    subcategories: ["Furniture", "Kitchen Appliances"],
  },
  {
    name: "Misc",
    path: "miscellaneous",
    icon: FaBox,
    color: "text-indigo-400",
    subcategories: ["Events", "Community", "Services", "Jobs", "Freebies"],
  },
];

const SubNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (name) =>
    setActiveCategory(activeCategory === name ? null : name);

  return (
    <nav className="bg-[#0a0a18] border-b border-white/5">

      {/* ── Desktop nav ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="relative group shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap">
                  <Icon className={`text-xs ${cat.color}`} />
                  {cat.name}
                  <FaChevronDown className="text-[9px] opacity-40 group-hover:opacity-70 transition-opacity" />
                </button>

                {/* Dropdown */}
                <div className="absolute top-full left-0 z-50 hidden group-hover:block pt-2 min-w-[190px]">
                  <div className="glass-card rounded-xl p-2 shadow-2xl shadow-black/60 border border-white/10 animate-fade-slide-up">
                    <Link
                      to={`/${cat.path}`}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all mb-1 pb-2 border-b border-white/5"
                    >
                      <Icon className={`${cat.color} text-xs`} />
                      View All
                    </Link>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        to={`/${cat.path}/${sub.toLowerCase().replace(/ /g, "-")}`}
                        className="flex items-center px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile nav ── */}
      <div className="md:hidden px-4 py-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          {mobileOpen
            ? <FaTimes className="text-cyan-400" />
            : <FaBars />
          }
          <span>{mobileOpen ? "Close Menu" : "Browse Categories"}</span>
        </button>

        {mobileOpen && (
          <div className="mt-3 space-y-1.5 animate-fade-slide-up">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isOpen = activeCategory === cat.name;
              return (
                <div key={cat.name} className="glass-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`text-xs ${cat.color}`} />
                      {cat.name}
                    </div>
                    <FaChevronDown
                      className={`text-[10px] text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3 grid grid-cols-2 gap-1 border-t border-white/5 pt-2">
                      <Link
                        to={`/${cat.path}`}
                        onClick={() => setMobileOpen(false)}
                        className={`col-span-2 text-xs font-bold ${cat.color} py-1.5 px-2 rounded-lg hover:bg-white/5 transition-all mb-1`}
                      >
                        View All →
                      </Link>
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/${cat.path}/${sub.toLowerCase().replace(/ /g, "-")}`}
                          onClick={() => setMobileOpen(false)}
                          className="text-xs text-gray-500 hover:text-cyan-400 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-all"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default SubNav;
