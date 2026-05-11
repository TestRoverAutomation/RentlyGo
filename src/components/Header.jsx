import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";

const Header = ({ user, setUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQ) params.set("q", searchQ);
    if (searchLoc) params.set("location", searchLoc);
    navigate(`/search?${params.toString()}`);
    setMobileSearchOpen(false);
  };

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
          ? "bg-[#09090f]/95 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/30"
          : "bg-[#09090f]/80 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-black tracking-tighter">RG</span>
            </div>
            <span className="text-lg font-black tracking-tight hidden sm:block">
              <span className="gradient-text">Rently</span>
              <span className="text-white">Go</span>
            </span>
          </div>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center gap-0 glass-card search-glow rounded-xl overflow-hidden max-w-2xl" role="search">
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
            <FaSearch className="text-gray-500 shrink-0 text-xs" aria-hidden="true" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search rentals…"
              aria-label="Search rentals"
              className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none text-sm"
            />
          </div>
          <div className="w-px h-5 bg-white/8 shrink-0" />
          <div className="flex items-center gap-2 px-4 py-2.5 w-44">
            <FaMapMarkerAlt className="text-gray-500 shrink-0 text-xs" aria-hidden="true" />
            <input
              type="text"
              value={searchLoc}
              onChange={(e) => setSearchLoc(e.target.value)}
              placeholder="Location"
              aria-label="Location"
              className="bg-transparent w-full text-white placeholder-gray-600 focus:outline-none text-sm"
            />
          </div>
          <button type="submit" className="glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold px-5 py-[11px] whitespace-nowrap">
            Search
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="md:hidden p-2.5 glass-card rounded-xl text-gray-400 hover:text-white transition-colors"
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
                className="text-sm font-medium px-4 py-2 rounded-xl glass-card text-gray-400 hover:text-white transition-all"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="text-sm font-medium px-4 py-2 rounded-xl glass-card text-gray-400 hover:text-white transition-all">
                Sign in
              </button>
            </Link>
          )}

          <Link to="/manage-ads">
            <button className="glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap">
              Post an ad
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile search (expandable) */}
      {mobileSearchOpen && (
        <form onSubmit={handleSearch} className="md:hidden px-4 pb-3 flex flex-col gap-2 animate-fade-slide-up" role="search">
          <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2.5">
            <FaSearch className="text-gray-500 text-xs shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search rentals…"
              aria-label="Search rentals"
              className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none text-sm"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2 glass-card rounded-xl px-3 py-2.5">
            <FaMapMarkerAlt className="text-gray-500 text-xs shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={searchLoc}
              onChange={(e) => setSearchLoc(e.target.value)}
              placeholder="City, postcode or area"
              aria-label="Location"
              className="bg-transparent flex-1 text-white placeholder-gray-600 focus:outline-none text-sm"
            />
          </div>
          <button type="submit" className="glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-2.5 rounded-xl text-sm">
            Search
          </button>
        </form>
      )}
    </header>
  );
};

export default Header;
