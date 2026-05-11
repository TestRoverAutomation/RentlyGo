import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import { searchListings } from "../services/firestore";
import ListingCard from "../components/ListingCard";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const location = params.get("location") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q && !location) { setLoading(false); return; }
    setLoading(true);
    searchListings(q, location)
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q, location]);

  return (
    <div className="bg-[#09090f] text-white min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            {q ? `Results for "${q}"` : "All listings"}
          </h1>
          {location && <p className="text-gray-500 text-sm mt-1">in {location}</p>}
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-600">
            <FaSpinner className="animate-spin text-indigo-400" aria-hidden="true" />
            <span className="text-sm">Searching…</span>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-white font-semibold text-lg mb-2">No results found</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
              Try different keywords, or use the AI assistant to find what you need.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl text-sm"
            >
              <FaArrowLeft aria-hidden="true" /> Back to home
            </Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-gray-600 text-sm mb-5">
              {results.length} listing{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
