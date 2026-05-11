import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaBolt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";

const Header = ({ user, setUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060610]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40"
          : "bg-[#060610]/75 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FaBolt className="text-white text-sm" />
            </div>
            <span className="text-xl font-black tracking-tight hidden sm:block">
              <span className="gradient-text">Rently</span>
              <span className="text-white">Go</span>
            </span>
          </div>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 items-center gap-0 glass-card search-glow rounded-xl overflow-hidden max-w-2xl">
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
            <FaSearch className="text-cyan-400 shrink-0 text-sm" />
            <input
              type="text"
              placeholder="Search rentals..."
              className="bg-transparent flex-1 text-white placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>
          <div className="w-px h-5 bg-white/10 shrink-0" />
          <div className="flex items-center gap-2 px-4 py-2.5 w-44">
            <FaMapMarkerAlt className="text-purple-400 shrink-0 text-sm" />
            <input
              type="text"
              placeholder="Location"
              className="bg-transparent w-full text-white placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>
          <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-5 py-[11px] whitespace-nowrap">
            Search
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile search toggle */}
          <button
            className="md:hidden p-2.5 glass-card rounded-xl text-gray-400 hover:text-cyan-400 transition-colors"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search"
          >
            <FaSearch className="text-sm" />
          </button>

          {user ? (
            <>
              <span className="hidden sm:block text-xs text-gray-500 max-w-[120px] truncate">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold px-4 py-2 rounded-xl glass-card text-gray-300 hover:text-white hover:border-white/20 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="text-sm font-semibold px-4 py-2 rounded-xl glass-card text-gray-300 hover:text-white hover:border-white/20 transition-all">
                Login
              </button>
            </Link>
          )}

          <Link to="/manage-ads">
            <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl whitespace-nowrap">
              + Post Ad
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile search (expandable) */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2 animate-fade-slide-up">
          <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2.5">
            <FaSearch className="text-cyan-400 text-sm shrink-0" />
            <input
              type="text"
              placeholder="Search rentals..."
              className="bg-transparent flex-1 text-white placeholder-gray-500 focus:outline-none text-sm"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2.5">
            <FaMapMarkerAlt className="text-purple-400 text-sm shrink-0" />
            <input
              type="text"
              placeholder="City, postcode or area"
              className="bg-transparent flex-1 text-white placeholder-gray-500 focus:outline-none text-sm"
            />
          </div>
          <button className="glow-btn bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-2.5 rounded-xl text-sm">
            Search
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
