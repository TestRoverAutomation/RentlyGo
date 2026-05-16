import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSpinner, FaPlus } from "react-icons/fa";
import { getListingsByCategory } from "../services/firestore";
import ListingCard from "./ListingCard";
import SEO from "./SEO";

const CATEGORY_KEYWORDS = {
  "Properties":              "property rental UK, residential rental, commercial rental, rent house, rent flat, rent office space",
  "Clothing & Accessories":  "clothing hire UK, outfit rental, dress hire, costume rental, fashion rental, party outfit hire",
  "Electronics & Gadgets":   "electronics rental UK, camera hire, laptop rental, projector hire, sound system rental, gadget hire",
  "Outdoor & Adventure":     "outdoor equipment hire UK, camping gear rental, marquee hire, bouncy castle hire, garden furniture rental",
  "Vehicles":                "vehicle rental UK, car hire, van rental, caravan hire, motorbike rental, scooter hire, e-bike rental",
  "Tools & Equipment":       "tool hire UK, power tool rental, builder tools hire, garden tool rental, DIY equipment hire",
  "Home & Furniture":        "furniture rental UK, kitchen appliance hire, home furnishing rental, furniture hire",
  "Miscellaneous":           "event hire UK, community rental, services hire, job equipment rental, freebies UK",
};

export default function CategoryPage({ category, subcategory = null, title, description, subcategories = [] }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const seoTitle    = subcategory ? `${subcategory} Rental` : `${title} Rental`;
  const seoDesc     = subcategory
    ? `Rent or hire ${subcategory.toLowerCase()} from people near you on RentlyGo. Browse listings, compare prices and contact hosts directly.`
    : `${description || `Browse ${title} rentals on RentlyGo.`} Find the best deals from local hosts and hire what you need today.`;
  const seoKeywords = `${seoTitle.toLowerCase()}, hire ${title.toLowerCase()}, rent ${title.toLowerCase()} near me, ${CATEGORY_KEYWORDS[category] || "rental UK"}`;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getListingsByCategory(category, subcategory)
      .then(setListings)
      .catch((err) => { console.error("CategoryPage error:", err); setError("Failed to load listings. Please try again."); })
      .finally(() => setLoading(false));
  }, [category, subcategory]);

  return (
    <div className="bg-[#09090f] text-white min-h-screen px-4 py-10">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        url={pathname}
      />
      <div className="max-w-6xl mx-auto">

        {/* Back + breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="glass-card rounded-xl p-2.5 text-gray-500 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xs" />
          </button>
          <div className="text-gray-600 text-sm">
            <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            {" / "}
            <span className="text-gray-400">{title}</span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          {description && (
            <p className="text-gray-500 text-sm max-w-xl">{description}</p>
          )}
        </motion.div>

        {/* Subcategory pills */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="Subcategories">
            {subcategories.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                role="listitem"
                className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/[0.03] transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-600">
            <FaSpinner className="animate-spin text-indigo-400" aria-hidden="true" />
            <span className="text-sm">Loading…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card rounded-xl p-5 text-red-300 text-sm border border-red-500/20">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && listings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="text-4xl mb-4" aria-hidden="true">📭</div>
            <h3 className="text-white font-semibold text-lg mb-2">No listings yet</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-xs mx-auto">
              Be the first to list a {title.toLowerCase()} item and start earning.
            </p>
            <Link
              to="/manage-ads"
              className="inline-flex items-center gap-2 glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl text-sm"
            >
              <FaPlus aria-hidden="true" /> Post the first ad
            </Link>
          </motion.div>
        )}

        {/* Listings */}
        {!loading && !error && listings.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 text-sm">
                {listings.length} listing{listings.length !== 1 ? "s" : ""}
              </p>
              <Link
                to="/manage-ads"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                + Post an ad
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
