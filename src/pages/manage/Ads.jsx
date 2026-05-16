import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTimes, FaSpinner, FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import PostAd from "./PostAds";
import { getUserListings, deleteListing, toggleListingActive } from "../../services/firestore";
import SEO from "../../components/SEO";

export default function Ads({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    loadListings();
  }, [user]);

  const loadListings = () => {
    setLoading(true);
    getUserListings(user.uid)
      .then(setListings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing?")) return;
    await deleteListing(id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggle = async (id, active) => {
    await toggleListingActive(id, !active);
    setListings((prev) =>
      prev.map((l) => l.id === id ? { ...l, active: !active } : l)
    );
  };

  return (
    <div className="bg-[#09090f] text-white min-h-screen px-4 py-10">
      <SEO title="My Ads" description="Manage your rental listings on RentlyGo." noindex={true} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My ads</h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome, <span className="text-gray-200">{user?.displayName || user?.email}</span>
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {showForm ? <><FaTimes aria-hidden="true" /> Cancel</> : <><FaPlus aria-hidden="true" /> Post New Ad</>}
          </button>
        </div>

        {/* Post form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="glass-card rounded-2xl p-6 mb-8"
            >
              <PostAd user={user} onSuccess={() => { setShowForm(false); loadListings(); }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-600">
            <FaSpinner className="animate-spin text-indigo-400" aria-hidden="true" />
            <span className="text-sm">Loading your ads…</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4" aria-hidden="true">📭</div>
            <h3 className="text-white font-bold text-xl mb-2">No ads yet</h3>
            <p className="text-gray-400 text-sm mb-6">Post your first ad and start earning from items you own.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 rounded-xl text-sm"
            >
              <FaPlus aria-hidden="true" /> Post your first ad
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">{listings.length} listing{listings.length !== 1 ? "s" : ""}</p>
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-card rounded-2xl p-5 flex items-start gap-4 ${!listing.active ? "opacity-60" : ""}`}
              >
                <span className="text-3xl shrink-0" aria-hidden="true">{listing.emoji || "📦"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-white font-semibold text-base leading-tight">{listing.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{listing.category}</span>
                        {listing.subcategory && <><span>·</span><span>{listing.subcategory}</span></>}
                        <span>·</span>
                        <span>{listing.location}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-white font-bold">£{listing.price}/day</div>
                      <span className={`text-[10px] font-mono ${listing.active ? "text-emerald-400" : "text-gray-500"}`}>
                        {listing.active ? "LIVE" : "PAUSED"}
                      </span>
                    </div>
                  </div>
                  {listing.description && (
                    <p className="text-gray-400 text-xs mt-2 line-clamp-1">{listing.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      to={`/listing/${listing.id}`}
                      className="flex items-center gap-1.5 text-xs glass-card rounded-lg px-3 py-1.5 text-gray-300 hover:text-white transition-colors"
                    >
                      <FaEdit className="text-[10px]" aria-hidden="true" /> View
                    </Link>
                    <button
                      onClick={() => handleToggle(listing.id, listing.active)}
                      className="flex items-center gap-1.5 text-xs glass-card rounded-lg px-3 py-1.5 text-gray-300 hover:text-white transition-colors"
                      aria-label={listing.active ? "Pause listing" : "Activate listing"}
                    >
                      {listing.active
                        ? <><FaEyeSlash className="text-[10px]" aria-hidden="true" /> Pause</>
                        : <><FaEye className="text-[10px]" aria-hidden="true" /> Activate</>}
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="flex items-center gap-1.5 text-xs glass-card rounded-lg px-3 py-1.5 text-red-400 hover:text-red-300 transition-colors"
                      aria-label="Delete listing"
                    >
                      <FaTimes className="text-[10px]" aria-hidden="true" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
