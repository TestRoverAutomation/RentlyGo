import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../auth/firebase";
import { createListing } from "../../services/firestore";
import { FaCheck, FaSpinner, FaCamera, FaTimes, FaCloudUploadAlt } from "react-icons/fa";

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

const MAX_PHOTOS = 5;

const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/60 text-sm transition-colors";
const labelCls = "block text-gray-300 text-xs font-semibold uppercase tracking-wide mb-2";

const STOP_WORDS = new Set(["a","an","the","and","or","for","in","of","to","with","is","are","at","on","my","i","it","this","that","from","by","be","as","do","not","but"]);

function generateTags({ title, category, subcategory, location, description, condition }) {
  const tokens = new Set();

  const addWords = (text) =>
    (text || "").toLowerCase().split(/[\s,.\-/]+/).forEach((w) => {
      if (w.length > 2 && !STOP_WORDS.has(w)) tokens.add(w);
    });

  addWords(title);
  addWords(subcategory);
  addWords(description);

  if (category)    tokens.add(category.toLowerCase());
  if (subcategory) tokens.add(subcategory.toLowerCase());
  if (location)    tokens.add(location.toLowerCase());
  if (condition && condition !== "Good") tokens.add(condition.toLowerCase());

  // Rental intent keywords
  tokens.add("rent");
  tokens.add("hire");
  tokens.add("rental");

  return [...tokens].slice(0, 20);
}

async function uploadImages(files, userId) {
  const urls = [];
  for (const file of files) {
    const storageRef = ref(storage, `listings/${userId}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }
  return urls;
}

export default function PostAd({ user, onSuccess }) {
  const [form, setForm] = useState({
    title: "", description: "", category: "", subcategory: "",
    price: "", location: "", condition: "Good", phone: "",
  });
  const [photos, setPhotos] = useState([]); // { file, preview }[]
  const [status, setStatus] = useState("idle"); // idle | uploading | saving | done | error
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const selectedCat = CATEGORIES.find((c) => c.name === form.category);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCategoryChange = (e) => {
    setForm((f) => ({ ...f, category: e.target.value, subcategory: "" }));
  };

  const addFiles = (files) => {
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - photos.length);
    if (!valid.length) return;
    const newPhotos = valid.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.price || !form.location) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");

    let photoUrls = [];
    if (photos.length > 0) {
      setStatus("uploading");
      try {
        photoUrls = await uploadImages(photos.map((p) => p.file), user.uid);
      } catch {
        setError("Image upload failed. Please try again.");
        setStatus("idle");
        return;
      }
    }

    setStatus("saving");
    try {
      const tags = generateTags(form);

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
        photos: photoUrls,
        tags,
      }, user);

      setStatus("done");
      setTimeout(() => {
        setStatus("idle");
        photos.forEach((p) => URL.revokeObjectURL(p.preview));
        setPhotos([]);
        setForm({ title: "", description: "", category: "", subcategory: "", price: "", location: "", condition: "Good", phone: "" });
        onSuccess?.();
      }, 2000);
    } catch {
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

  const isBusy = status === "uploading" || status === "saving";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-black text-white">Post a New Ad</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* ── Photos ── */}
      <div>
        <label className={labelCls}>
          Photos <span className="text-gray-500 normal-case font-normal tracking-normal">({photos.length}/{MAX_PHOTOS})</span>
        </label>

        {/* Preview grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mb-3">
            {photos.map((p, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <FaTimes className="text-white text-sm" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-semibold">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Drop zone — only show when under the limit */}
        {photos.length < MAX_PHOTOS && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 cursor-pointer transition-colors select-none ${
              dragOver
                ? "border-indigo-400/70 bg-indigo-500/10"
                : "border-white/[0.10] bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/5"
            }`}
          >
            <FaCloudUploadAlt className="text-gray-500 text-2xl" />
            <p className="text-gray-400 text-sm">
              <span className="text-indigo-400 font-semibold">Click to upload</span> or drag & drop
            </p>
            <p className="text-gray-600 text-xs">PNG, JPG, WEBP — up to {MAX_PHOTOS} photos</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* ── Title ── */}
      <div>
        <label className={labelCls}>Title <span className="text-red-400 normal-case font-normal">*</span></label>
        <input
          type="text"
          value={form.title}
          onChange={set("title")}
          placeholder="e.g. Canon EOS R5 with 24-70mm lens"
          className={inputCls}
          required
        />
      </div>

      {/* ── Category + Subcategory ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category <span className="text-red-400 normal-case font-normal">*</span></label>
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

      {/* ── Price + Location ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Price per day (£) <span className="text-red-400 normal-case font-normal">*</span></label>
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
          <label className={labelCls}>Location <span className="text-red-400 normal-case font-normal">*</span></label>
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

      {/* ── Condition + Phone ── */}
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

      {/* ── Description ── */}
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
        disabled={isBusy}
        className="w-full glow-btn bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "uploading" && <><FaSpinner className="animate-spin" /> Uploading photos…</>}
        {status === "saving"   && <><FaSpinner className="animate-spin" /> Posting…</>}
        {status === "idle"     && <><FaCamera /> Post Ad</>}
      </button>
    </form>
  );
}
