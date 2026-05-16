import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaPhone, FaEnvelope, FaSpinner } from "react-icons/fa";
import { getListingById } from "../services/firestore";
import SEO from "../components/SEO";

export default function ListingDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(1);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    getListingById(id)
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="bg-[#09090f] min-h-screen flex items-center justify-center gap-3 text-gray-600">
      <FaSpinner className="animate-spin text-indigo-400" aria-hidden="true" />
      <span className="text-sm">Loading listing…</span>
    </div>
  );

  if (!listing) return (
    <div className="bg-[#09090f] min-h-screen text-white flex flex-col items-center justify-center gap-4">
      <div className="text-4xl" aria-hidden="true">🔍</div>
      <h2 className="text-xl font-semibold">Listing not found</h2>
      <p className="text-gray-600 text-sm">This listing may have been removed.</p>
      <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">← Back to home</Link>
    </div>
  );

  const total = (listing.price * days).toFixed(2);

  const seoTitle = `Rent ${listing.title} in ${listing.location}`;
  const seoDesc  = `Hire ${listing.title} in ${listing.location} for £${listing.price}/day. ${listing.description ? listing.description.slice(0, 120) : ""} Listed by ${listing.hostName} on RentlyGo.`;
  const seoImage = listing.photos?.[0] || undefined;
  const seoKeywords = [
    `rent ${listing.title}`,
    `hire ${listing.subcategory || listing.category}`,
    `${listing.category} rental ${listing.location}`,
    ...(listing.tags || []),
  ].join(", ");

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": listing.title,
    "description": listing.description || "",
    "image": listing.photos?.[0] || "",
    "category": listing.category,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "GBP",
      "price": listing.price,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": listing.price,
        "priceCurrency": "GBP",
        "unitText": "DAY",
      },
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Person", "name": listing.hostName },
      "areaServed": listing.location,
    },
    "aggregateRating": listing.reviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": listing.hostRating,
      "reviewCount": listing.reviews,
    } : undefined,
  };

  return (
    <div className="bg-[#09090f] text-white min-h-screen px-4 py-10">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        image={seoImage}
        url={`/listing/${listing.id}`}
        type="product"
        jsonLd={listingJsonLd}
      />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors group"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl shrink-0" aria-hidden="true">{listing.emoji || "📦"}</span>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                    {listing.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {listing.subcategory && (
                      <span className="text-gray-500 text-xs">
                        {listing.subcategory}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <FaMapMarkerAlt className="text-[10px]" aria-hidden="true" />
                      {listing.location}
                    </span>
                    {listing.condition && (
                      <span className="glass-card rounded-full px-2.5 py-0.5 text-xs text-gray-400">
                        {listing.condition}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {listing.description && (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-white font-semibold text-base mb-3">About this item</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{listing.description}</p>
              </div>
            )}

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-semibold text-base mb-4">Host</h2>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-base shrink-0 overflow-hidden">
                  {listing.hostPhoto
                    ? <img src={listing.hostPhoto} alt={listing.hostName} className="w-full h-full object-cover" />
                    : (listing.hostName?.[0] || "H")}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{listing.hostName}</div>
                  {listing.hostRating && (
                    <div className="flex items-center gap-1 text-sm mt-0.5">
                      <FaStar className="text-amber-400 text-xs" aria-hidden="true" />
                      <span className="text-gray-400 text-xs">{listing.hostRating}</span>
                      {listing.reviews > 0 && (
                        <span className="text-gray-600 text-xs">({listing.reviews} reviews)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-black text-white">£{listing.price}</span>
                <span className="text-gray-600 text-sm">/day</span>
              </div>

              <div className="mt-4 mb-4">
                <label className="block text-gray-500 text-xs font-medium mb-2 uppercase tracking-wide">
                  Days
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDays((d) => Math.max(1, d - 1))}
                    className="glass-card w-9 h-9 rounded-xl text-white font-bold text-lg flex items-center justify-center hover:border-white/20 transition-all"
                    aria-label="Decrease days"
                  >−</button>
                  <span className="text-white font-bold text-lg w-8 text-center">{days}</span>
                  <button
                    onClick={() => setDays((d) => d + 1)}
                    className="glass-card w-9 h-9 rounded-xl text-white font-bold text-lg flex items-center justify-center hover:border-white/20 transition-all"
                    aria-label="Increase days"
                  >+</button>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-4 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">£{listing.price} × {days} day{days !== 1 ? "s" : ""}</span>
                  <span className="text-white font-bold">£{total}</span>
                </div>
              </div>

              {user ? (
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="w-full glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {showContact ? "Hide contact" : "Contact host"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Sign in to contact host
                </Link>
              )}

              {showContact && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 space-y-2"
                >
                  {listing.phone && (
                    <a
                      href={`tel:${listing.phone}`}
                      className="flex items-center gap-2 glass-card rounded-xl px-4 py-3 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      <FaPhone className="text-indigo-400 text-xs" aria-hidden="true" />
                      {listing.phone}
                    </a>
                  )}
                  {listing.hostEmail && (
                    <a
                      href={`mailto:${listing.hostEmail}?subject=Rental enquiry: ${listing.title}`}
                      className="flex items-center gap-2 glass-card rounded-xl px-4 py-3 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      <FaEnvelope className="text-violet-400 text-xs" aria-hidden="true" />
                      Email host
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
