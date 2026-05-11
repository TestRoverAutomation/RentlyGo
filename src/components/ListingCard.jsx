import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

export default function ListingCard({ listing, index = 0 }) {
  const {
    id, title, description, category, subcategory,
    price, location, hostName, hostRating, reviews,
    emoji, condition,
  } = listing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/listing/${id}`} className="block h-full group">
        <div className="glass-card rounded-xl p-5 h-full flex flex-col gap-3 hover:border-indigo-400/25 transition-all duration-200">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl" aria-hidden="true">{emoji || "📦"}</span>
              <div>
                <div className="text-white font-semibold text-sm leading-tight line-clamp-2">
                  {title}
                </div>
                {subcategory && (
                  <span className="inline-block text-[10px] text-gray-500 mt-0.5">
                    {subcategory}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-white font-bold text-base leading-none">£{price}</div>
              <div className="text-gray-600 text-[10px]">/day</div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">
              {description}
            </p>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <FaMapMarkerAlt className="text-[10px]" aria-hidden="true" />
              {location}
            </div>
            <div className="flex items-center gap-3">
              {condition && (
                <span className="text-[10px] text-gray-600">{condition}</span>
              )}
              {hostRating && (
                <div className="flex items-center gap-1 text-xs">
                  <FaStar className="text-amber-400 text-[10px]" aria-hidden="true" />
                  <span className="text-gray-400">{hostRating}</span>
                  {reviews > 0 && <span className="text-gray-600">({reviews})</span>}
                </div>
              )}
            </div>
          </div>

          {/* Host */}
          {hostName && (
            <div className="text-gray-600 text-[11px]">
              by <span className="text-gray-400">{hostName}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
