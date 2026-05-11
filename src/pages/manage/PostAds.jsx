import { useState } from "react";
import { createListing } from "../../services/firestore";
import { FaCheck, FaSpinner } from "react-icons/fa";

const CATEGORIES = [
  { name: "Properties", subcategories: ["Residential Rentals", "Commercial Rentals"] },
  { name: "Clothing & Accessories", subcategories: ["Mens Wear", "Womens Wear", "Kids Wear", "Shoes", "Bags", "Party Costumes", "Accessories"] },
  { name: "Electronics & Gadgets", subcategories: ["Cameras", "Camcorders", "Studio Equipments", "Sound System", "Party lightings", "Instruments", "Game Consoles", "Projectors", "Laptops", "Mobile & Tab"] },
  { name: "Outdoor & Adventure", subcategories: ["Party Decoration", "Camping Gear", "Marquee", "Bouncy Castle", "Garden Furniture", "Bicycles", "Boats", "Barbecue-Grills"] },
  { name: "Vehicles", subcategories: ["Cars", "Van", "Caravan", "Motorbikes", "Scooters", "E-Bikes"] },
  { name: "Tools & Equipment", subcategories: ["Power Tools", "Builder tools", "Garden tools"] },
  { name: "Home & Furniture", subcategories: ["Furniture", "Kitchen Appliances"] },
  { name: "Miscellaneous", subcategories: ["Events", "Community", "Services", "Jobs", "Freebies"] },
];

const EMOJI_MAP = {
  "Properties": "🏠", "Clothing & Accessories": "👗", "Electronics & Gadgets": "💻",
  "Outdoor & Adventure": "🏕️", "Vehicles": "🚗", "Tools & Equipment": "🔧",
  "Home & Furniture": "🛋️", "Miscellaneous": "📦",
};

const inputCls = "w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 text-sm transition-colors";
const labelCls = "block text-gray-300 text-sm font-medium mb-1.5";

export default function PostAd({ user, onSuccess }) {
  const [form, setForm] = useState({
    title: "", description: "", category: "", subcategory: "",
    price: "", location: "", condition: "Good", phone: "",
  });
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [error, setError] = useState("");

  const selectedCat = CATEGORIES.find((c) => c.name === form.category);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCategoryChange = (e) => {
    setForm((f) => ({ ...f, category: e.target.value, subcategory: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.price || !form.location) {
      setError("Please fill in all required fields.");
      return;
    }
    setStatus("saving");
    setError("");
    try {
      const tags = [
        form.category.toLowerCase(),
        form.subcategory.toLowerCase(),
        ...form.title.toLowerCase().split(/\s+/),
      ].filter(Boolean);

      await createListing({
        title: form.title,
        description: form.description,
        category: form.category,
        subcategory: form.subcategory,
        price: parseFloat(form.price),
        location: form.location,
        condition: form.condition,
        phone: form.phone,
        emoji: EMOJI_MAP[form.category] || "📦",
        tags,
      }, user);

      setStatus("done");
      setTimeout(() => {
        setStatus("idle");
        setForm({ title: "", description: "", category: "", subcategory: "", price: "", location: "", condition: "Good", phone: "" });
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError("Failed to post ad. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
          <FaCheck className="text-emerald-400 text-2xl" />
        </div>
        <h3 className="text-white font-bold text-xl">Ad Posted!</h3>
        <p className="text-gray-400 text-sm">Your listing is now live and searchable.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-black text-white">Post a New Ad</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelCls}>Title <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={form.title}
          onChange={set("title")}
          placeholder="e.g. Canon EOS R5 with 24-70mm lens"
          className={inputCls}
          required
        />
      </div>

      {/* Category + Subcategory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category <span className="text-red-400">*</span></label>
          <select value={form.category} onChange={handleCategoryChange} className={inputCls} required>
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Subcategory</label>
          <select
            value={form.subcategory}
            onChange={set("subcategory")}
            className={inputCls}
            disabled={!selectedCat}
          >
            <option value="">Select subcategory</option>
            {selectedCat?.subcategories.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Price per day (£) <span className="text-red-400">*</span></label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={set("price")}
            placeholder="e.g. 45"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Location <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={form.location}
            onChange={set("location")}
            placeholder="e.g. Manchester"
            className={inputCls}
            required
          />
        </div>
      </div>

      {/* Condition + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Condition</label>
          <select value={form.condition} onChange={set("condition")} className={inputCls}>
            <option>New</option>
            <option>Like New</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Contact phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="e.g. 07700 900000"
            className={inputCls}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          value={form.description}
          onChange={set("description")}
          placeholder="Describe your item — what's included, any terms, collection/delivery info..."
          rows={4}
          className={inputCls + " resize-none"}
        />
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "saving" ? (
          <><FaSpinner className="animate-spin" /> Posting…</>
        ) : (
          "Post Ad"
        )}
      </button>
    </form>
  );
}
